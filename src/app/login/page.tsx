// src/app/login/page.tsx
'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient' 
import { useRouter } from 'next/navigation' 
import Link from 'next/link' 
import Image from 'next/image' 

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/home')
      router.refresh() // Ensure a clean redirect
    }

    setLoading(false)
  }

  return (
    // --- 1. Main 2-column grid ---
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      
      {/* --- 2. Left Logo Pane --- */}
      <div className="hidden items-center justify-center bg-gray-50 p-12 md:flex">
        <div className="flex flex-col items-center text-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="CareerNest Logo"
              width={728}
              height={142}
              className="h-auto w-80" // w-80 is 320px
            />
          </Link>
          <p className="mt-2 text-m text-gray-600">
            Welcome back! Please log in to access your network.
          </p>
        </div>
      </div>

      {/* --- 3. Right Form Pane --- */}
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Welcome Back
          </h2>
          
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Email Address */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end text-xs mt-1">
                <Link
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}
          </form>

          {/* Link to Sign Up Page */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}