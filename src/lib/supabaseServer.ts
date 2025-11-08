import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Make 'get' async
        async get(name: string) {
          const cookieStore = await cookies()
          return cookieStore.get(name)?.value
        },
        // Make 'set' async
        async set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies()
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This is fine, will be ignored in Server Components
          }
        },
        // Make 'remove' async
        async remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = await cookies()
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // This is fine, will be ignored in Server Components
          }
        },
      },
    }
  )
}