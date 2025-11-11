// src/components/Sidebar.tsx
'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient' 
import type { User } from '@supabase/supabase-js'

// --- 1. THIS IS THE CORRECT IMPORT LIST ---
import { 
  Home,     // <-- Use 'Nest'
  Users,
  User as UserIcon, // <-- Import 'User' as 'UserIcon'
  MessageSquare, 
  Briefcase, 
  LogOut, 
  ChevronsLeft, 
  ChevronsRight 
} from 'lucide-react'

// 2. Define the component's props
type SidebarProps = {
  user: User
}

// 3. Update navLinks to use 'Nest'
const navLinks = [
  { href: '/home', label: 'The Nest', icon: Home }, // <-- Use 'Nest'
  { href: '/network', label: 'Network', icon: Users },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/jobs', label: 'Job Board', icon: Briefcase },
]

// 4. Update the component to accept props
export default function Sidebar({ user }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // 5. Helper function to get initials for the avatar
  const getInitials = () => {
    const fullName = user.user_metadata?.full_name
    const email = user.email // <-- Fixed typo (was missing 'user.')
    if (fullName) {
      const names = fullName.split(' ')
      if (names.length > 1) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase()
      }
      return names[0][0].toUpperCase()
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return '?' // Fallback
  }
  const initials = getInitials()

  return (
    <nav 
      className={`flex h-full flex-col bg-white p-4 shadow-lg transition-all duration-300 ease-in-out
      ${isOpen ? 'w-64' : 'w-20'}
    `}>
      
      {/* Top section: Logo and Toggle Button */}
      <div className={`flex items-center pb-4 ${isOpen ? 'justify-between' : 'justify-center'}`}>
        {/* Logo (only visible when open) */}
        <Link href="/home" className={`${!isOpen && 'hidden'}`}>
          <Image
            src="/logo.png"
            alt="CareerNest Logo"
            width={728}
            height={142}
            className="h-8 w-auto"
          />
        </Link>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          {isOpen ? <ChevronsLeft className="h-6 w-6" /> : <ChevronsRight className="h-6 w-6" />}
        </button>
      </div>

      {/* Navigation Links (This part grows) */}
      <ul className="mt-6 flex-1 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href
          
          return (
            <li key={link.href}>
              <Link 
                href={link.href} 
                className={`flex items-center gap-3 rounded-lg p-3
                  ${!isOpen && 'justify-center'}
                  ${isActive 
                    ? 'bg-indigo-100 font-bold text-indigo-700' 
                    : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                <link.icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="font-medium">{link.label}</span>}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* --- BOTTOM SECTION --- */}
      <div>
        
        {/* My Profile Link */}
        <div className="mt-4 border-t pt-4">
          <Link 
            href="/profile"
            className={`flex w-full items-center gap-3 rounded-lg p-3
              ${!isOpen && 'justify-center'}
              ${pathname === '/profile'
                ? 'bg-indigo-100 font-bold text-indigo-700' 
                : 'text-gray-700 hover:bg-gray-100'}
            `}
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
              {initials}
            </div>
            {isOpen && <span className="font-medium">My Profile</span>}
          </Link>
        </div>

        {/* Logout Button */}
        <div className="mt-2">
          <button 
            onClick={handleLogout} 
            className={`flex w-full items-center gap-3 rounded-lg p-3 text-gray-700 hover:bg-red-100 hover:text-red-700
              ${!isOpen && 'justify-center'}
            `}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="font-medium">Log Out</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}