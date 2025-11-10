'use client'

import React, { useState, useEffect } from 'react' // Import useEffect
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link' 
import Image from 'next/image' 

// --- Types for dropdowns ---
type College = { id: number | string; name: string; verification_domain: string }
type Department = { id: number | string; name: string }

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [officialEmail, setOfficialEmail] = useState('') // <-- This is now the main email
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'Student' | 'Alumni' | 'Faculty' | ''>('')
  const [collegeId, setCollegeId] = useState<number | string>('')
  
  const [colleges, setColleges] = useState<College[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Fetch colleges (for domain check)
  useEffect(() => {
    const fetchColleges = async () => {
      const { data } = await supabase.from('colleges').select('id, name, verification_domain')
      if (data) setColleges(data)
    }
    fetchColleges()
  }, [])

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

    // --- NEW: Domain Check ---
    const selectedCollege = colleges.find(c => c.id == collegeId)
    if (!selectedCollege || !officialEmail.endsWith(selectedCollege.verification_domain)) {
      setError(`Your email must end with the selected college's domain (e.g., ${selectedCollege?.verification_domain || '@college.edu'})`)
      setLoading(false)
      return
    }

    // 1. Get the origin URL
    const redirectTo = `${window.location.origin}/auth/callback?next=/id-verification`

    // 2. Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email: officialEmail, // <-- Use the OFFICIAL email to sign up
      password: password,
      options: {
        data: {
          full_name: fullName, 
          role: role,
          college_id: collegeId,
        },
        emailRedirectTo: redirectTo,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage(`Success! Please check your official email (${officialEmail}) for a verification link to continue.`)
    }
    setLoading(false)
  }
  
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* --- Left Logo Pane --- */}
      <div className="hidden items-center justify-center bg-gray-50 p-12 md:flex">
        {/* ... (Your logo and tagline) ... */}
      </div>
      
      {/* --- Right Form Pane --- */}
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 py-12">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          
          {!message ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  id="full-name"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g., Jane Doe"
                />
              </div>

              <div>
                <label htmlFor="college-id" className="block text-sm font-medium text-gray-700">College</label>
                <select
                  id="college-id"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                  value={collegeId}
                  onChange={(e) => setCollegeId(e.target.value)}
                >
                  <option value="" disabled>Select your college...</option>
                  {colleges.map((college) => (
                    <option key={college.id} value={college.id}>{college.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Official College Email (For Login & Verification)
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  placeholder="your_id@dcrustm.org"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a...</label>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Type your password again"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm"
                >
                  {loading ? 'Submitting...' : 'Send Verification Link'}
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