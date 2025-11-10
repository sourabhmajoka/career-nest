// src/app/auth/verify-college-email/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(`${origin}/login?error=Invalid verification link.`)
  }

  // Create an admin client to bypass RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Make sure this is in your .env.local
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Find the token in the database
  const { data: verification, error: tokenError } = await supabaseAdmin
    .from('college_verifications')
    .select('user_id, official_email, expires_at')
    .eq('token', token)
    .single()

  if (tokenError || !verification) {
    return NextResponse.redirect(`${origin}/login?error=Invalid or expired token.`)
  }

  // Check if the token is expired
  if (new Date(verification.expires_at) < new Date()) {
    await supabaseAdmin.from('college_verifications').delete().eq('token', token)
    return NextResponse.redirect(`${origin}/login?error=Verification link has expired.`)
  }

  // Token is valid! Update the user's profile
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({
      status: 'approved',
      official_email: verification.official_email,
    })
    .eq('id', verification.user_id)

  if (profileError) {
    return NextResponse.redirect(`${origin}/login?error=Failed to update your profile.`)
  }

  // Success! Delete the token
  await supabaseAdmin.from('college_verifications').delete().eq('token', token)

  // Redirect the user to their home feed
  return NextResponse.redirect(`${origin}/home`)
}