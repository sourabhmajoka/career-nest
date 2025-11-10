'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link' 
import Image from 'next/image' 

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('') // This is the PERSONAL email
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'Student' | 'Alumni' | 'Faculty' | ''>('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    // 1. Get the origin URL
    const redirectTo = `${window.location.origin}/auth/callback?next=/id-verification`

    // 2. Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // 3. Store the full_name and role in the user's metadata
        data: {
          full_name: fullName, 
          role: role,
        },
        // 4. Tell Supabase where to redirect after the email link is clicked
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Success! Please check your personal email for a verification link to continue.')
    }
    setLoading(false)
  }
  
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* --- Left Logo Pane --- */}
      <div className="hidden items-center justify-center bg-gray-50 p-12 md:flex">
        <div className="flex flex-col items-center text-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="CareerNest Logo"
              width={728}
              height={142}
              className="h-auto w-80"
            />
          </Link>
          <p className="mt-2 text-m text-gray-600">
            Join the CareerNest network and connect your entire community.
          </p>
        </div>
      </div>
      
      {/* --- Right Form Pane --- */}
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 py-12">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          
          {/* Show a success message or the form */}
          {!message ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Personal Email (For Login)
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., you@gmail.com"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  I am a...
                </label>
                <select
                  id="role"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="" disabled>Select your role...</option>
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Alumni">Alumni</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm"
                >
                  {loading ? 'Submitting...' : 'Sign Up'}
                </button>
              </div>

              {error && (
                <p className="text-center text-sm text-red-600">{error}</p>
              )}
            </form>
          ) : (
            <p className="text-center text-lg text-green-600">{message}</p>
          )}

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}