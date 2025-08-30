import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';
import { AnalysisSchema } from '../_shared/types.ts'; // Our Zod schema for validation

// These are the required CORS headers
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
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      throw new Error('imageUrl is required in the request body.');
    }

    // Create a Supabase client with the user's authentication token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get the user from the token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('User not found or authentication failed.');
    }

    // --- Agent 1: OCR (OCR.space) ---
    const ocrSpaceUrl = `https://api.ocr.space/parse/imageurl?apikey=${Deno.env.get('OCR_SPACE_KEY')}&url=${imageUrl}`;
    const ocrResponse = await fetch(ocrSpaceUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!ocrResponse.ok) {
      const errorText = await ocrResponse.text();
      throw new Error(`OCR.space API failed: ${errorText}`);
    }

    const ocrData = await ocrResponse.json();
    const ingredientsText = ocrData.ParsedResults?.[0]?.ParsedText;

    // Gracefully handle the case where no text is found
    if (!ingredientsText) {
      return new Response(
        JSON.stringify({ error: "No ingredients text could be detected. Please try again with a clearer picture." }),
        { status: 400, headers: corsHeaders }
      );
    }
    
    // --- Agent 2: LLM Analysis (OpenRouter) ---
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENROUTER_KEY')!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: 'system', content: "You are a helpful nutrition analysis assistant. Your response MUST be a valid JSON object with the keys 'beneficial', 'harmful', 'neutral', and 'summary', matching the provided schema. Do not include any text or markdown before or after the JSON." },
          { role: 'user', content: `Analyze the following ingredient list: ${ingredientsText}` }
        ]
      })
    });

    if (!openRouterResponse.ok) {
        throw new Error("OpenRouter API call failed.");
    }
    
    const llmJson = await openRouterResponse.json();
    const llmContent = JSON.parse(llmJson.choices[0].message.content);

    // Validate the AI's output with Zod
    const validationResult = AnalysisSchema.safeParse(llmContent);
    if (!validationResult.success) {
      throw new Error("LLM returned invalid data structure.");
    }
    const validatedAnalysis = validationResult.data;

    // --- Agent 3: Storage (Supabase Database) ---
    const { data: scanData, error: scanError } = await supabaseClient
      .from('scans')
      .insert({ user_id: user.id, image_url: imageUrl, raw_text: ingredientsText })
      .select()
      .single();

    if (scanError) {
      throw scanError;
    }

    const { error: analysisError } = await supabaseClient
      .from('analysis_results')
      .insert({
        scan_id: scanData.id,
        beneficial: validatedAnalysis.beneficial,
        harmful: validatedAnalysis.harmful,
        neutral: validatedAnalysis.neutral,
        summary: validatedAnalysis.summary,
      });

    if (analysisError) {
      throw analysisError;
    }

    // --- Final Success Response ---
    return new Response(JSON.stringify(validatedAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('CRITICAL ERROR in Edge Function:', error);
    return new Response(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});