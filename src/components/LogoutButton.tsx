'use client'

import { supabase } from '@/lib/supabaseClient' // The client-side client
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    // Sign out the user
    await supabase.auth.signOut()
    // Redirect to the login page
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-lg p-2 text-left font-medium text-gray-700 hover:bg-red-100 hover:text-red-700"
    >
      Log Out
    </button>
  )
}