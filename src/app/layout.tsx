// src/app/layout.tsx
import React from 'react'
import './globals.css' // Your global stylesheet
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CareerNest - Your University Network',
  description: 'Connect, Collaborate, and Grow with your university network.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* This children prop will be your landing page,
            or your login page, or your (main) app layout */}
        {children}
      </body>
    </html>
  )
}