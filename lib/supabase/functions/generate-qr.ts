import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4'; // Use latest
import { v4 as uuidv4 } from 'https://esm.sh/uuid@9.0.0'; // To generate unique QR values

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust for production to your frontend URL
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();

    // Create a Supabase client with the service role key for direct database access
    // This bypasses RLS, so ensure calls to this function are secured via API Gateway or other means
    // For local dev, you might use anon_key, but for production, this should be a secret.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') as string,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string,
      { auth: { persistSession: false } }
    );

    // Fetch current session data
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('is_attendance_active, last_qr_code_generated_at')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      console.error('Session fetch error:', sessionError);
      return new Response(JSON.stringify({ error: 'Session not found or database error.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!session.is_attendance_active) {
      return new Response(JSON.stringify({ error: 'Attendance is not active for this session.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const lastGeneratedTime = new Date(session.last_qr_code_generated_at || 0); // Use 0 if null
    const currentTime = new Date();
    const timeDiffSeconds = (currentTime.getTime() - lastGeneratedTime.getTime()) / 1000;

    // Check if 30 seconds have passed or if it's the first time generating for this active session
    if (timeDiffSeconds >= 30 || !session.last_qr_code_generated_at) {
      const newQrValue = `${sessionId}-${uuidv4()}`; // Unique for this session and refresh

      const { data: updatedSession, error: updateError } = await supabase
        .from('sessions')
        .update({
          last_qr_code_value: newQrValue,
          last_qr_code_generated_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      if (updateError) {
        console.error('Error updating session:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update QR code.' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ newQrValue: newQrValue }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Not yet time for a refresh, return a message or error
      return new Response(JSON.stringify({ message: 'QR not yet due for refresh.', currentQrValue: session.last_qr_code_value }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Edge Function error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});