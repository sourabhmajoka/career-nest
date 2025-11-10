// src/app/request-onboarding/page.tsx
'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'

export default function RequestOnboardingPage() {
  const [collegeName, setCollegeName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactRole, setContactRole] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const { error } = await supabase
      .from('college_onboarding_requests')
      .insert({
        college_name: collegeName,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_role: contactRole,
      })

    if (error) {
      setError(`Error: ${error.message}`)
    } else {
      setSuccess("Your request has been submitted! We will get back to you soon.")
      setCollegeName('')
      setContactName('')
      setContactEmail('')
      setContactRole('')
    }
    setLoading(false)
  }

  return (
    // --- Main 2-column grid ---
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      
      {/* --- 1. Left Logo Pane (BG color changed) --- */}
      <div className="hidden items-center justify-center bg-gray-50 p-12 md:flex">
        {/* We wrap the logo and tagline in a flex-col */}
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
          {/* 2. Tagline moved here, under the logo */}
          <p className="mt-2 text-m text-gray-600">
            Join the CareerNest network and connect your entire community.
          </p>
        </div>
      </div>

      {/* --- Right Form Pane --- */}
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 pr-24">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          
          <div className="text-center">
            {/* --- 2. Removed top margin (mt-6) from h2 --- */}
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Onboard Your College
            </h2>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* (The rest of your form JSX is perfect, no changes needed) */}
              <div>
                <label htmlFor="college-name" className="block text-sm font-medium text-gray-700">
                  Official College Name
                </label>
                <input
                  id="college-name"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="e.g., Deenbandhu Chhotu Ram University"
                />
              </div>

              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
                  Your Full Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g., Dr. Jane Smith"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                  Your Official Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g., jane.smith@collegedomain.edu"
                />
              </div>

              <div>
                <label htmlFor="contact-role" className="block text-sm font-medium text-gray-700">
                  Your Role/Title (e.g., "Dean of Students")
                </label>
                <input
                  id="contact-role"
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  placeholder="e.g., Dean of Students"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  {loading ? 'Submitting...' : 'Request Access'}
                </button>
              </div>

              {error && (
                <p className="text-center text-sm text-red-600">{error}</p>
              )}
            </form>
          ) : (
            <div className="mt-8 text-center">
              <p className="text-lg font-medium text-green-600">{success}</p>
              <Link href="/">
                <span className="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
                  &larr; Back to Home
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}