// src/components/SidebarNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SidebarNav() {
  const pathname = usePathname()

  const links = [
    { href: '/home', label: 'Home Feed' },
    { href: '/profile', label: 'My Profile' },
    { href: '/messages', label: 'Messages' },
    { href: '/jobs', label: 'Job Board' },
  ]

  return (
    <ul className="space-y-2">
      {links.map((link) => {
        const isActive = pathname === link.href

        return (
          <li
            key={link.label}
            className={`rounded-lg p-2 ${
              isActive
                ? 'bg-indigo-100'
                : 'hover:bg-gray-100'
            }`}
          >
            <Link
              href={link.href}
              className={`font-medium ${
                isActive
                  ? 'font-bold text-indigo-700'
                  : 'text-gray-700'
              }`}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}