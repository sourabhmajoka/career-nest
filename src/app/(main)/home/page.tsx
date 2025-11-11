// src/app/(main)/home/page.tsx
import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import NestFeed from '@/components/NestFeed' // 1. Import your new component

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        The Nest
      </h1>
      
      {/* 2. Render the client component and pass the user */}
      <NestFeed user={user} />
    </div>
  )
}