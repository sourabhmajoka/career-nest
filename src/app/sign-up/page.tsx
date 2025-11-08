'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

// --- 1. Define types ---
type College = { id: number | string; name: string }
type Department = { id: number | string; name: string }

export default function SignUpPage() {
  // Form state
  const [fullName, setFullName] = useState('')
  const [collegeId, setCollegeId] = useState<number | string>('')
  const [departmentId, setDepartmentId] = useState<number | string>('')
  const [colleges, setColleges] = useState<College[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'Student' | 'Alumni' | 'Faculty' | ''>('')
  const [graduationYear, setGraduationYear] = useState<number | ''>('')
  const [idProofFile, setIdProofFile] = useState<File | null>(null)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // --- Fetch colleges and departments ---
  useEffect(() => {
    const fetchDropdownData = async () => {
      // Fetch Colleges
      const { data: collegesData, error: collegesError } = await supabase
        .from('colleges')
        .select('id, name')
        .order('name', { ascending: true })
      if (collegesData) setColleges(collegesData)

      // Fetch Departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('id, name')
        .order('name', { ascending: true })
      if (departmentsData) setDepartments(departmentsData)
    }
    fetchDropdownData()
  }, [])

  // --- THIS IS THE NEW, REWRITTEN FUNCTION ---
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

    // --- STEP 1: Sign up the user (Auth) ---
    // We have REMOVED the 'options.data' block
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (!authData.user) {
      setError('An unknown error occurred. Please try again.')
      setLoading(false)
      return
    }

    // --- STEP 2: Manually insert into the 'profiles' table ---
    
    // Define the profile data
    const profileData = {
      id: authData.user.id, // The most important part
      email: email,
      full_name: fullName,
      college_id: collegeId,
      department_id: departmentId,
      role: role,
      status: role === 'Alumni' ? 'pending' : 'approved',
      graduation_year: role === 'Student' || role === 'Alumni' ? graduationYear : null,
    }

    // PATH A: STUDENT OR FACULTY
    if (role === 'Student' || role === 'Faculty') {
      if (!email.endsWith('@dcrustm.org')) {
        setError('You must use your official @dcrustm.org college email.')
        setLoading(false)
        return
      }
      
      const { error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)

      if (profileError) {
        setError(`Auth successful, but DB error: ${profileError.message}`)
      } else {
        setMessage('Success! Please check your @dcrustm.org email for a verification link.')
      }
    }

    // PATH B: ALUMNI
    if (role === 'Alumni') {
      if (!idProofFile) {
        setError('Please upload your college ID proof.')
        setLoading(false)
        return
      }

      // 2B. Upload the ID proof first
      const fileExt = idProofFile.name.split('.').pop()
      const filePath = `public/${authData.user.id}.${fileExt}`

      const { error: storageError } = await supabase.storage
        .from('id-proofs')
        .upload(filePath, idProofFile)

      if (storageError) {
        setError(`Auth successful, but file upload failed: ${storageError.message}`)
        setLoading(false)
        return
      }

      // 3B. Insert the profile WITH the proof url
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          ...profileData,
          id_proof_url: filePath, // Add the file path
        })
      
      if (profileError) {
        setError(`Auth/Upload successful, but DB error: ${profileError.message}`)
      } else {
        setMessage('Success! Your account is pending approval. Please check your email for a verification link.')
      }
    }

    setLoading(false)
  }
  
  // --- Your JSX form (no changes needed) ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Join CareerNest
        </h2>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="full-name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* College Name */}
          <div>
            <label htmlFor="college-id" className="block text-sm font-medium text-gray-700">
              College Name
            </label>
            <select
              id="college-id"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)} 
            >
              <option value="" disabled>Select your college...</option>
              {colleges.map((college) => (
                <option key={college.id} value={college.id}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department-id" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="department-id"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)} 
            >
              <option value="" disabled>Select your department...</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Role Selection */}
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
              <option value="Alumni">Alumni (Requires ID Proof)</option>
            </select>
          </div>
          
          {/* STUDENT & FACULTY FIELDS */}
          {(role === 'Student' || role === 'Faculty') && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  College Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your_id@dcrustm.org"
                />
              </div>
              {role === 'Student' && (
                <div>
                  <label htmlFor="grad-year" className="block text-sm font-medium text-gray-700">
                    Graduation Year
                  </label>
                  <input
                    id="grad-year"
                    type="number"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(Number(e.target.value))}
                    placeholder="e.g., 2025"
                  />
                </div>
              )}
            </div>
          )}

          {/* ALUMNI FIELDS */}
          {role === 'Alumni' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Personal Email Address
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
                <label htmlFor="grad-year" className="block text-sm font-medium text-gray-700">
                  Graduation Year
                </label>
                <input
                  id="grad-year"
                  type="number"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  placeholder="e.g., 2018"
                />
              </div>
              <div>
                <label htmlFor="id-proof" className="block text-sm font-medium text-gray-700">
                  College ID Proof (PDF or Image)
                </label>
                <input
                  id="id-proof"
                  type="file"
                  required
                  accept=".pdf, .png, .jpg, .jpeg"
                  className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100"
                  onChange={(e) => setIdProofFile(e.target.files ? e.target.files[0] : null)}
                />
              </div>
            </div>
          )}

          {/* PASSWORD FIELDS */}
          {role && (
            <div className="space-y-4">
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
            </div>
          )}
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || !role}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm"
            >
              {loading ? 'Submitting...' : 'Sign Up'}
            </button>
          </div>

          {/* Error and Message Display */}
          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}
          {message && (
            <p className="text-center text-sm text-green-600">{message}</p>
          )}

        </form>

        {/* Link to Login Page */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Log In
          </a>
        </p>
      </div>
    </div>
  )
}