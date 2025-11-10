// src/app/id-verification/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'

// --- Types for dropdowns ---
type College = { id: number | string; name: string }
type Department = { id: number | string; name: string }

// --- 1. Student Verification Form ---
const StudentVerificationForm = ({ user }: { user: User }) => {
  const [officialEmail, setOfficialEmail] = useState('')
  const [collegeId, setCollegeId] = useState<number | string>('')
  const [departmentId, setDepartmentId] = useState<number | string>('')
  const [graduationYear, setGraduationYear] = useState('')
  
  const [colleges, setColleges] = useState<College[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Fetch colleges and departments
  useEffect(() => {
    const fetchDropdownData = async () => {
      const { data: collegesData } = await supabase.from('colleges').select('id, name')
      if (collegesData) setColleges(collegesData)
      
      const { data: departmentsData } = await supabase.from('departments').select('id, name')
      if (departmentsData) setDepartments(departmentsData)
    }
    fetchDropdownData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    // A. First, update the profile with the new data
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        college_id: collegeId,
        department_id: departmentId,
        graduation_year: graduationYear,
        official_email: officialEmail,
      })
      .eq('id', user.id)

    if (profileError) {
      setError(profileError.message)
      setLoading(false)
      return
    }

    // B. Now, call the Edge Function to send the email
    try {
      const { error: funcError } = await supabase.functions.invoke(
        'student-verify-email',
        { body: { official_email: officialEmail, user_id: user.id } }
      )

      if (funcError) throw funcError
      
      setMessage(`Success! We've sent a verification link to ${officialEmail}. Please check your inbox.`)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (message) {
    return <p className="text-center text-lg text-green-600">{message}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p>Hello Student! Please complete your profile to get verified.</p>
      
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
        <label htmlFor="department-id" className="block text-sm font-medium text-gray-700">Department</label>
        <select
          id="department-id"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="" disabled>Select your department...</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="grad-year" className="block text-sm font-medium text-gray-700">Graduation Year</label>
        <input 
          id="grad-year"
          type="number" 
          placeholder="e.g., 2026" 
          required 
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400" 
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)} 
        />
      </div>

      <div>
        <label htmlFor="official-email" className="block text-sm font-medium text-gray-700">Official College Email</label>
        <input 
          id="official-email"
          type="email" 
          placeholder="your_id@dcrustm.org" 
          required 
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400" 
          value={officialEmail}
          onChange={(e) => setOfficialEmail(e.target.value)} 
        />
      </div>
      
      <button type="submit" disabled={loading} className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm">
        {loading ? 'Sending...' : 'Send Verification Email'}
      </button>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </form>
  )
}

// --- 2. Faculty & Alumni Verification Form ---
const FacultyAlumniForm = ({ user, role }: { user: User, role: 'Faculty' | 'Alumni' }) => {
  const [officialEmail, setOfficialEmail] = useState('')
  const [collegeId, setCollegeId] = useState<number | string>('')
  const [departmentId, setDepartmentId] = useState<number | string>('')
  const [graduationYear, setGraduationYear] = useState('')
  const [idProofFile, setIdProofFile] = useState<File | null>(null)
  
  const [colleges, setColleges] = useState<College[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  // Fetch colleges and departments
  useEffect(() => {
    const fetchDropdownData = async () => {
      const { data: collegesData } = await supabase.from('colleges').select('id, name')
      if (collegesData) setColleges(collegesData)
      
      const { data: departmentsData } = await supabase.from('departments').select('id, name')
      if (departmentsData) setDepartments(departmentsData)
    }
    fetchDropdownData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idProofFile) {
      setError('Please upload your ID proof.')
      return
    }
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      // 1. Upload the ID proof file
      const fileExt = idProofFile.name.split('.').pop()
      const filePath = `${user.id}/id_proof.${fileExt}` 

      const { data: uploadData, error: storageError } = await supabase.storage
        .from('id-proofs')
        .upload(filePath, idProofFile, { upsert: true })
        
      if (storageError) throw storageError

      // 2. Update the user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          college_id: collegeId,
          department_id: departmentId,
          graduation_year: role === 'Alumni' ? graduationYear : null,
          official_email: officialEmail,
          id_proof_url: uploadData.path, 
          status: 'pending_admin_approval'
        })
        .eq('id', user.id)
        
      if (profileError) throw profileError

      setMessage('Your request has been submitted for approval. You will receive an email once it has been reviewed.')

    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (message) {
    return <p className="text-center text-lg text-green-600">{message}</p>
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p>Hello {role}! Please complete your profile to request approval.</p>

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
        <label htmlFor="department-id" className="block text-sm font-medium text-gray-700">Department</label>
        <select
          id="department-id"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
          value={departmentId}
          onChange={(e) => setDepartmentId(e.target.value)}
        >
          <option value="" disabled>Select your department...</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      </div>
      
      {role === 'Alumni' && (
        <div>
          <label htmlFor="grad-year" className="block text-sm font-medium text-gray-700">Graduation Year</label>
          <input 
            id="grad-year"
            type="number" 
            placeholder="e.g., 2018" 
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400" 
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)} 
          />
        </div>
      )}
      
      <div>
        <label htmlFor="official-email" className="block text-sm font-medium text-gray-700">Official College Email</label>
        <input 
          id="official-email"
          type="email" 
          placeholder="your_id@dcrustm.org" 
          required 
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400" 
          value={officialEmail}
          onChange={(e) => setOfficialEmail(e.target.value)} 
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Upload ID Card (PDF/Image)</label>
        <input type="file" required className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100" onChange={(e) => setIdProofFile(e.target.files ? e.target.files[0] : null)} />
      </div>

      <button type="submit" disabled={loading} className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm">
        {loading ? 'Submitting...' : 'Request Approval'}
      </button>
      {error && <p className="text-center text-sm text-red-600">{error}</p>}
    </form>
  )
}

// --- The Main Page Component ---
export default function IdVerificationPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profileStatus, setProfileStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        setProfileStatus(profile.status)
        if (profile.status === 'approved') {
          router.push('/home')
          return
        }
      }
      
      setUser(user)
      setLoading(false)
    }

    fetchUserAndProfile()
  }, [router])

  const renderVerificationForm = () => {
    if (!user) return null

    if (profileStatus === 'pending_admin_approval') {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-700">Your request is pending admin approval.</p>
          <p className="mt-2 text-sm text-gray-500">You will receive an email once it has been reviewed. You may close this page.</p>
        </div>
      )
    }

    const role = user.user_metadata?.role
    
    switch (role) {
      case 'Student':
        return <StudentVerificationForm user={user} />
      case 'Faculty':
        return <FacultyAlumniForm user={user} role="Faculty" />
      case 'Alumni':
        return <FacultyAlumniForm user={user} role="Alumni" />
      default:
        return <p>Error: User role not found.</p>
    }
  }

  return (
    // --- UPDATED LAYOUT ---
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
            Just one more step. We need to verify who you are.
          </p>
        </div>
      </div>
      
      {/* --- Right Form Pane --- */}
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 py-12">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
            Complete Your Profile
          </h2>
          
          {loading ? (
            <p className="text-center text-gray-600">Loading your profile...</p>
          ) : (
            renderVerificationForm()
          )}
        </div>
      </div>
    </div>
  )
}