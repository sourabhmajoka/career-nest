// supabase/functions/student-verify-email/index.ts

import { createClient } from 'npm:@supabase/supabase-js@2'
import { Resend } from 'npm:resend@3'

console.log('--- Function Booting (Top Level) ---')

// --- 1. DEFINE YOUR CORS HEADERS ---
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Get Resend API key from Vault
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
if (!RESEND_API_KEY) {
  console.error('--- ERROR: RESEND_API_KEY is not set ---')
}
const resend = new Resend(RESEND_API_KEY)

// Get app's URL
const APP_URL = Deno.env.get('NEXT_PUBLIC_SITE_URL') || 'http://localhost:3000'

// Get Supabase URL and Key
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('--- ERROR: Missing Supabase Env Vars ---')
}

console.log('--- Env Vars Loaded. Serving function... ---')

Deno.serve(async (req) => {
  console.log(`--- Request received: ${req.method} ---`)

  // --- HANDLE 'OPTIONS' PREFLIGHT REQUEST ---
  if (req.method === 'OPTIONS') {
    console.log('--- Handling OPTIONS request ---')
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('--- Inside TRY block ---')

    const supabaseAdmin = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    console.log('--- Admin client created ---')

    const body = await req.json()
    const { user_id, official_email } = body
    console.log(`--- Request body parsed: ${JSON.stringify(body)} ---`)

    if (!user_id || !official_email) {
      console.error('--- ERROR: Missing user_id or official_email ---')
      return new Response(JSON.stringify({ error: 'Missing user_id or official_email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Generate token
    const token = crypto.randomUUID()
    const expires_at = new Date(Date.now() + 1000 * 60 * 60).toISOString() // 1 hour
    console.log('--- Token generated ---')

    // Store token
    const { error: insertError } = await supabaseAdmin
      .from('college_verifications')
      .insert({ user_id, official_email, token, expires_at })
    if (insertError) throw insertError
    console.log('--- Token stored in DB ---')

    // Create link
    const verificationURL = `${APP_URL}/auth/verify-college-email?token=${token}`

    // Send email
    console.log('--- Sending email via Resend... ---')
    const { error: emailError } = await resend.emails.send({
      from: 'CareerNest <onboarding@resend.dev>',
      to: [official_email],
      subject: 'Verify Your CareerNest College Email',
      html: `<a href="${verificationURL}">Verify My Email</a>`,
    })
    if (emailError) throw emailError
    console.log('--- Email sent successfully ---')

    // Send success
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    // --- This is the most important log ---
    console.error('---!! CRASHED IN CATCH BLOCK !!---')
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})