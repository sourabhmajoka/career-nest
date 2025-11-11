// src/app/(main)/profile/[userId]/page.tsx
import { createClient } from '@/lib/supabaseServer'
import { redirect, notFound } from 'next/navigation'
import { Plus, Edit, Briefcase, Users, MessageSquare, Video, UserPlus } from 'lucide-react'
import Link from 'next/link'

// Helper function to get initials
const getInitials = (user: any, profile: any) => {
  const fullName = profile?.full_name
  const email = user?.email
  if (fullName) {
    const names = fullName.split(' ')
    if (names.length > 1) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return names[0][0].toUpperCase()
  }
  if (email) {
    return email[0].toUpperCase()
  }
  return '?'
}

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const supabase = createClient()
  
  // 1. Get our *own* user
  const { data: { user: ownUser } } = await supabase.auth.getUser()
  if (!ownUser) {
    redirect('/login')
  }

  // 2. If we're viewing our *own* profile, redirect to the 'My Profile' page
  if (params.userId === ownUser.id) {
    redirect('/profile')
  }

  // 3. Fetch the data for the profile we are viewing
  // --- THIS IS THE FIXED LINE (no underscore) ---
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      college:colleges(name),
      department:departments(name)
    `)
    .eq('id', params.userId)
    .single()

  // 4. If no profile is found, show a 404 page
  if (error || !profile) {
    notFound()
  }

  const initials = getInitials(null, profile)

  return (
    <div className="mx-auto max-w-4xl p-8">
      
      {/* --- 1. INTRO CARD --- */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        {/* Banner Image */}
        <div className="h-32 bg-gray-200 lg:h-48" />
        
        {/* Profile Details */}
        <div className="relative p-6">
          
          {/* Profile Picture */}
          <div className="absolute -mt-24 h-32 w-32 rounded-full border-4 border-white bg-indigo-500">
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-5xl font-bold text-white">{initials}</span>
            </div>
          </div>

          {/* Name, Headline, Connections */}
          <div className="pt-16">
            <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
            <p className="mt-1 text-lg text-gray-600">
              {profile.headline || `${profile.role} at ${profile.department?.name || 'Your Department'}`}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {profile.college?.name || 'Your College'}
            </p>
          </div>

          {/* --- 2. ACTION BUTTONS --- */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
              <UserPlus className="h-4 w-4" />
              Connect
            </button>
            <button className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              <MessageSquare className="h-4 w-4" />
              Send Message
            </button>
            <button className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              <Video className="h-4 w-4" />
              Request Video Call
            </button>
            <button className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              <Briefcase className="h-4 w-4" /> 
              Request Mentorship
            </button>
          </div>
        </div>
      </div>

      {/* --- 3. ABOUT CARD (BIO) --- */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900">About</h2>
        <p className="mt-4 text-gray-700">
          {profile.bio || "This user hasn't added a bio yet."}
        </p>
      </div>
      
      {/* --- 4. EXPERIENCE (Placeholder) --- */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900">Experience</h2>
        <p className="mt-4 text-gray-500">This user hasn't added any experience yet.</p>
      </div>

      {/* --- 5. EDUCATION CARD --- */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900">Education</h2>
        <div className="mt-4 flex items-start space-x-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100">
            <Briefcase className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{profile.college?.name}</p>
            <p className="text-gray-700">{profile.department?.name}</p>
            <p className="text-gray-500">{profile.graduation_year}</p>
          </div>
        </div>
      </div>

      {/* --- 6. SKILLS (Placeholder) --- */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900">Skills</h2>
        <p className="mt-4 text-gray-500">This user hasn't added any skills yet.</p>
      </div>

    </div>
  )
}