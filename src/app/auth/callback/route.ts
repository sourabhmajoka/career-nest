// src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/home'

  if (code) {
    // ✅ Fix: await the client
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // This sets the Supabase session cookie on the response
      const response = NextResponse.redirect(new URL(next, request.url))
      return response
    }

    console.error('Error exchanging code:', error)
  }

  // If no code or there’s an error
  return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
}