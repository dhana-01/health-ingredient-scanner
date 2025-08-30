// supabase/functions/analyze-ingredient-image/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { AnalysisSchema } from '../_shared/types.ts';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      throw new Error('imageBase64 is required in the request body.');
    }

    // --- Agent 1: Gemini OCR (Multimodal with Base64) ---
    const openRouterKey = Deno.env.get('OPENROUTER_KEY');
    if (!openRouterKey) {
      throw new Error('OPENROUTER_KEY environment variable is not set.');
    }

    // Convert base64 to Data URL format for Gemini
    const dataUrl = `data:image/jpeg;base64,${imageBase64}`;

    const geminiOcrResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview:free',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all text from this image. Respond ONLY with the raw text and no additional commentary.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: dataUrl
                }
              }
            ]
          }
        ]
      })
    });

    if (!geminiOcrResponse.ok) {
      const errorText = await geminiOcrResponse.text();
      throw new Error(`Gemini OCR API failed: ${errorText}`);
    }

    const geminiOcrData = await geminiOcrResponse.json();
    const ingredientsText = geminiOcrData.choices?.[0]?.message?.content;

    // Check if OCR extracted any text
    if (!ingredientsText || ingredientsText.trim() === '') {
      return new Response(
        JSON.stringify({ 
          error: "No text could be detected in the image. Please try again with a clearer picture." 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // --- Agent 2: Mistral Analysis ---
    const mistralAnalysisResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'user',
            content: `Analyze the following ingredient list:
"${ingredientsText}"

Your response MUST be a valid JSON object. Do not include any text before or after the JSON. The JSON object must have the following structure:
{
  "beneficial": [],
  "harmful": [],
  "neutral": [],
  "summary": ""
}

Each item inside the 'beneficial', 'harmful', and 'neutral' arrays MUST be an object with two specific keys: "ingredient" and "reason".

For example:
{
  "beneficial": [
    { "ingredient": "Almonds", "reason": "Good source of healthy fats and protein." }
  ]
}

Do NOT combine the ingredient and its reason into a single string. They must be separate keys within an object.`
          }
        ]
      })
    });

    if (!mistralAnalysisResponse.ok) {
      const errorText = await mistralAnalysisResponse.text();
      throw new Error(`Mistral Analysis API failed: ${errorText}`);
    }

    const mistralAnalysisData = await mistralAnalysisResponse.json();
    const llmContent = mistralAnalysisData.choices?.[0]?.message?.content;

    if (!llmContent) {
      throw new Error('Mistral returned empty content');
    }

    // --- Robust JSON Parsing from LLM Response ---
    let parsedAnalysis;
    try {
      // Find the start and end of JSON content
      const jsonStart = llmContent.indexOf('{');
      const jsonEnd = llmContent.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
        throw new Error('No valid JSON structure found in LLM response');
      }
      
      // Extract just the JSON portion
      const jsonString = llmContent.substring(jsonStart, jsonEnd + 1);
      
      // Try to parse the extracted JSON
      parsedAnalysis = JSON.parse(jsonString);
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw LLM content:', llmContent);
      throw new Error('Failed to parse JSON from LLM response');
    }

    // Validate the AI's output with Zod
    const validationResult = AnalysisSchema.safeParse(parsedAnalysis);
    if (!validationResult.success) {
      console.error('Zod validation failed:', validationResult.error);
      console.error('Parsed analysis:', parsedAnalysis);
      throw new Error('Mistral returned invalid data structure');
    }
    const validatedAnalysis = validationResult.data;

    // --- Return the validated analysis ---
    return new Response(JSON.stringify(validatedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('CRITICAL ERROR in Edge Function:', error);
    return new Response(
      JSON.stringify({ error: `Internal Server Error: ${error.message}` }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
