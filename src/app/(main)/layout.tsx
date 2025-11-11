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
  const supabase = await createClient()
  
  // 1. Get the user (Authentication)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // If no user, send to login
    redirect('/login')
  }

  // 2. Get the user's profile (Authorization)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single()

  // 3. This is the new, correct security logic
  if (error || !profile) {
    // This can happen if the profile trigger hasn't run yet.
    // Send them to /id-verification to complete their profile.
    redirect('/id-verification')
  }

  // 4. Handle different statuses
  switch (profile.status) {
    case 'approved':
      // This is a normal, approved user. Let them see the page.
      break
    case 'pending_verification':
      // The user has signed up but not finished the ID verification step.
      // Force them to the verification page.
      redirect('/id-verification')
      break
    case 'pending_admin_approval':
      // The user is a faculty/alumni and is waiting for an admin.
      // Force them to a "pending" page.
      redirect('/pending-approval') // You will need to create this page
      break
    default:
      // Any other status (e.g., 'rejected'), send them to login.
      redirect('/login?error=account_issue')
  }

  // 5. If they ARE approved, show the app
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