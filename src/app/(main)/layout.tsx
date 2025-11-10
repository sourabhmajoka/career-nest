// src/app/(main)/layout.tsx
import React from 'react'
import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar' 

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  // 1. Get the user (Authentication)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // If no user, send to login
    redirect('/login')
  }

  // 2. NEW: Get the user's profile (Authorization)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single()

  // 3. NEW: Check the profile status
  if (error || !profile || profile.status !== 'approved') {
    // If they have no profile, or an error, OR their status is not 'approved'
    // (e.g., it's 'pending_verification' or 'pending_admin_approval')
    // force them to the verification page.
    redirect('/id-verification')
  }

  // 4. If they ARE approved, show the app
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="flex-shrink-0">
        <Sidebar user={user} /> 
      </div>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}