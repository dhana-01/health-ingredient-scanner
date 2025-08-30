import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { AnalysisSchema } from "../_shared/types.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'imageUrl is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Agent 1: OCR using Google Cloud Vision API
    const googleVisionKey = Deno.env.get('GOOGLE_VISION_KEY');
    if (!googleVisionKey) {
      throw new Error('GOOGLE_VISION_KEY environment variable not set');
    }

    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${googleVisionKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                source: {
                  imageUri: imageUrl,
                },
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!visionResponse.ok) {
      throw new Error(`Google Vision API error: ${visionResponse.statusText}`);
    }

    const visionData = await visionResponse.json();
    const ingredientsText = visionData.responses?.[0]?.textAnnotations?.[0]?.description || '';

    if (!ingredientsText) {
      throw new Error('No text detected in the image');
    }

    // Agent 2: LLM processing using OpenRouter API
    const openRouterKey = Deno.env.get('OPENROUTER_KEY');
    if (!openRouterKey) {
      throw new Error('OPENROUTER_KEY environment variable not set');
    }

    const systemPrompt = `You are a health and nutrition expert. Analyze the following ingredient list and provide a detailed health assessment.

INGREDIENTS TO ANALYZE:
${ingredientsText}

Please analyze each ingredient and categorize them as beneficial, harmful, or neutral for health. For each ingredient, provide a clear reason for the categorization.

You must respond with valid JSON that matches this exact structure:
{
  "beneficial": [
    {"ingredient": "ingredient_name", "reason": "why it's beneficial"}
  ],
  "harmful": [
    {"ingredient": "ingredient_name", "reason": "why it's harmful"}
  ],
  "neutral": [
    {"ingredient": "ingredient_name", "reason": "why it's neutral"}
  ],
  "summary": "Overall health assessment summary"
}

IMPORTANT: Only return valid JSON. Do not include any other text or formatting.`;

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ingredia.app',
        'X-Title': 'Ingredia Health Scanner',
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
        ],
        temperature: 0.1,
        max_tokens: 1000,
      }),
    });

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API error: ${openRouterResponse.statusText}`);
    }

    const llmData = await openRouterResponse.json();
    const llmResponse = llmData.choices?.[0]?.message?.content || '';

    if (!llmResponse) {
      throw new Error('No response received from LLM');
    }

    // Agent 3: Validation using Zod schema
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(llmResponse);
    } catch (parseError) {
      throw new Error(`Failed to parse LLM response as JSON: ${parseError.message}`);
    }

    const validationResult = AnalysisSchema.safeParse(parsedResponse);
    if (!validationResult.success) {
      console.error('LLM validation failed:', validationResult.error);
      throw new Error('LLM returned invalid data structure');
    }

    const validatedAnalysis = validationResult.data;

    // Return the validated analysis
    return new Response(
      JSON.stringify(validatedAnalysis),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-ingredient-image function:', error);
    
    return new Response(
      JSON.stringify({ error: `Internal Server Error: ${error.message}` }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
