'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient' // Use the absolute path
import { useRouter } from 'next/navigation' // For redirecting after login

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  // Handle the login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Sign in the user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setError(error.message)
    } else {
      // Login was successful!
      // We will check their role (student, alumni, faculty)
      // and their status (pending, approved)
      
      // For now, let's just redirect them to a dashboard
      // We will create this page next.
      router.push('/home')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Welcome Back
        </h2>
        
        {/* Login Form */}
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
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
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
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-400"
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
          <a href="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}