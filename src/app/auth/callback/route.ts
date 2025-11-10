// src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // This 'next' parameter is the one we set in the sign-up form
  const next = searchParams.get('next') || '/home'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // This is the fix:
      // Redirect to the 'next' URL (our /id-verification page)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Fallback: redirect to an error page or home
  return NextResponse.redirect(`${origin}/login?error=Invalid verification link.`)
}