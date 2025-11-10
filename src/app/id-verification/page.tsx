'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'

// ... (Your College/Department types) ...

// Form for ALL users (Student, Faculty, Alumni)
const VerificationForm = ({ user, role }: { user: User, role: string }) => {
  const [personalEmail, setPersonalEmail] = useState('')
  const [departmentId, setDepartmentId] = useState<number | string>('')
  const [graduationYear, setGraduationYear] = useState('')
  const [idProofFile, setIdProofFile] = useState<File | null>(null)
  
  const [departments, setDepartments] = useState<any[]>([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data } = await supabase.from('departments').select('id, name')
      if (data) setDepartments(data)
    }
    fetchDepartments()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // For Faculty/Alumni, ID proof is required
    if ((role === 'Faculty' || role === 'Alumni') && !idProofFile) {
      setError('Please upload your ID proof.')
      setLoading(false)
      return
    }

    try {
      let id_proof_url: string | null = null
      
      // 1. Upload ID proof if needed
      if (idProofFile) {
        const fileExt = idProofFile.name.split('.').pop()
        const filePath = `${user.id}/id_proof.${fileExt}`
        const { data: uploadData, error: storageError } = await supabase.storage
          .from('id-proofs')
          .upload(filePath, idProofFile, { upsert: true })
        if (storageError) throw storageError
        id_proof_url = uploadData.path
      }

      // 2. Prepare data to update profile
      const updates: any = {
        department_id: departmentId,
        email_personal: personalEmail, // New column for personal email
        status: (role === 'Student') ? 'approved' : 'pending_admin_approval',
      }
      
      if (role !== 'Faculty') {
        updates.graduation_year = graduationYear
      }
      if (id_proof_url) {
        updates.id_proof_url = id_proof_url
      }

      // 3. Update the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        
      if (profileError) throw profileError

      // 4. Redirect
      if (updates.status === 'approved') {
        router.push('/home')
      } else {
        router.push('/pending-approval') // We need to create this simple page
      }
      
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p>Welcome, {role}! Your official email is verified. Please complete your profile.</p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Personal Email</label>
        <input 
          type="email" 
          placeholder="e.g., you@gmail.com" 
          required 
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400" 
          value={personalEmail}
          onChange={(e) => setPersonalEmail(e.target.value)} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Department</label>
        <select
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
      
      {role !== 'Faculty' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
          <input 
            type="number" 
            placeholder="e.g., 2026" 
            required 
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400" 
            value={graduationYear}
            onChange={(e) => setGraduationYear(e.target.value)} 
          />
        </div>
      )}
      
      {(role === 'Faculty' || role === 'Alumni') && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload ID Card (PDF/Image)</label>
          <input 
            type="file" 
            required 
            className="mt-1 block w-full text-sm text-gray-700 file:..." 
            onChange={(e) => setIdProofFile(e.target.files ? e.target.files[0] : null)} 
          />
        </div>
      )}
      
      <button type="submit" disabled={loading} className="flex w-full justify-center ...">
        {loading ? 'Saving...' : 'Complete Profile'}
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
        if (profile.status === 'approved') {
          router.push('/home')
          return
        }
        if (profile.status === 'pending_admin_approval') {
          router.push('/pending-approval')
          return
        }
        // If status is 'pending_verification', we stay here
        setProfileStatus(profile.status)
      }
      
      setUser(user)
      setLoading(false)
    }

    fetchUserAndProfile()
  }, [router])

  const renderVerificationForm = () => {
    if (!user) return null
    const role = user.user_metadata?.role
    return <VerificationForm user={user} role={role} />
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
            Complete Your Profile
          </h2>
          {loading ? <p>Loading...</p> : renderVerificationForm()}
        </div>
      </div>
    </div>
  )
}