// src/app/forgot-password/page.tsx
'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    // This is the crucial part
    // It tells Supabase to send a reset email.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // This is the URL the user will be redirected to after clicking the email link
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for a password reset link.')
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
          <p className="mt-6 text-xl text-gray-600">
            Enter your email to reset your password.
          </p>
        </div>
      </div>

      {/* --- Right Form Pane --- */}
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Forgot Your Password?
          </h2>
          
          <form onSubmit={handleResetPassword} className="space-y-6">
            
            {!message ? (
              <>
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

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    {loading ? 'Sending link...' : 'Send Reset Link'}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-green-600">{message}</p>
            )}

            {error && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Remembered your password?{' '}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}