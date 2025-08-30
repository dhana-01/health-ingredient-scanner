// supabase/functions/save-scan-history/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

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
    const { analysis, imageBase64 } = await req.json();
    
    if (!analysis) {
      throw new Error('analysis is required in the request body.');
    }
    
    if (!imageBase64) {
      throw new Error('imageBase64 is required in the request body.');
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

    // --- Image Storage ---
    // Convert base64 back to buffer for Supabase Storage
    const imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${user.id}_${timestamp}.jpg`;
    const filePath = `${user.id}/${fileName}`;

    // Upload image to Supabase Storage
    const { error: uploadError } = await supabaseClient.storage
      .from('scanned-images')
      .upload(filePath, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get public URL for the uploaded image
    const { data: publicUrlData } = supabaseClient.storage
      .from('scanned-images')
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData?.publicUrl;
    if (!imageUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }

    // --- Database Operations ---
    // First, insert into scans table
    const { data: scanData, error: scanError } = await supabaseClient
      .from('scans')
      .insert({ 
        user_id: user.id, 
        image_url: imageUrl,
        raw_text: analysis.summary || 'No text available' // Use summary as fallback
      })
      .select()
      .single();

    if (scanError) {
      throw new Error(`Failed to save scan: ${scanError.message}`);
    }

    // Then, insert into analysis_results table
    const { error: analysisError } = await supabaseClient
      .from('analysis_results')
      .insert({
        scan_id: scanData.id,
        beneficial: analysis.beneficial || [],
        harmful: analysis.harmful || [],
        neutral: analysis.neutral || [],
        summary: analysis.summary || '',
      });

    if (analysisError) {
      throw new Error(`Failed to save analysis results: ${analysisError.message}`);
    }

    // --- Success Response ---
    return new Response(JSON.stringify({
      success: true,
      message: 'Scan saved successfully',
      scanId: scanData.id,
      imageUrl: imageUrl
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('ERROR in save-scan-history function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
