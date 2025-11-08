// src/app/(main)/layout.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'
import SidebarNav from '@/components/SidebarNav' // <-- 1. Import new component

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen">

      {/* --- Sidebar --- */}
      <nav className="hidden w-64 shrink-0 flex-col bg-white p-6 shadow-lg md:flex">
        <div>
          <div className="mb-6">
            <Link href="/home">
              <Image
                src="/logo.png"
                alt="CareerNest Logo"
                width={728} // Set your logo's width
                height={142} // Set your logo's height
                priority // Tells Next.js to load this image first
                className="h-8 w-auto"
              />
            </Link>
          </div>
          
          {/* 2. Use the new component here */}
          <SidebarNav />

          <button className="mt-8 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
            Post a Job
          </button>
        </div>

        {/* Logout Button at the bottom of the sidebar */}
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <main className="flex-1 bg-gray-100">
        {children}
      </main>
    </div>
  )
}