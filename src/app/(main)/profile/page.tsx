// src/app/(main)/profile/page.tsx
import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import { Plus, Edit, Briefcase, Users } from 'lucide-react'
import Link from 'next/link'

// --- PLACEHOLDER DATA ---
// We'll replace these with real data later
const connectionCount = 125 // Placeholder
const placeholderPosts = [
  { id: 1, content: "Excited to share that I'll be interning at Google this summer! #computerscience" },
  { id: 2, content: "Does anyone have a good resource for learning advanced React hooks?" },
]
// --- END PLACEHOLDERS ---

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

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // We'll fetch the profile, and also join the college/department names
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      college:colleges(name),
      department:departments(name)
    `)
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return <div>Error loading your profile. Please try again.</div>
  }

  const initials = getInitials(user, profile)

  return (
    // We're using a single-column layout with stacked cards
    <div className="mx-auto max-w-4xl p-8">
      
      {/* --- 1. INTRO CARD --- */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        {/* Banner Image */}
        <div className="h-32 bg-gray-200 lg:h-48">
          {/* You can add a <Image> tag here for a cover photo later */}
        </div>
        
        {/* Profile Details */}
        <div className="relative p-6">
          {/* Edit Profile Button */}
          <Link href="/profile/edit" className="absolute top-4 right-4 rounded-full p-2 text-indigo-600 hover:bg-indigo-100">
            <Edit className="h-5 w-5" />
          </Link>
          
          {/* Profile Picture */}
          <div className="absolute -mt-24 h-32 w-32 rounded-full border-4 border-white bg-indigo-500">
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-5xl font-bold text-white">{initials}</span>
            </div>
            {/* Later, you can replace this with:
            <Image src={profile.avatar_url} layout="fill" className="rounded-full" />
            */}
          </div>

          {/* Name, Headline, Connections */}
          <div className="pt-16">
            <h1 className="text-3xl font-bold text-gray-900">{profile.full_name}</h1>
            <p className="mt-1 text-lg text-gray-600">
              {profile.role} at {profile.department?.name || 'Your Department'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {profile.college?.name || 'Your College'}
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-indigo-600">
                {connectionCount} Connections
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- 2. ABOUT CARD (BIO) --- */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900">About</h2>
        <p className="mt-4 text-gray-700">
          {profile.bio || "You haven't added a bio yet. Click the edit button to add one!"}
        </p>
      </div>

      {/* --- 3. ACTIVITY CARD (POSTS) --- */}
      <div className="mt-6 rounded-lg bg-white shadow-md">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-bold text-gray-900">Activity</h2>
          <Link href="/profile/posts">
            <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all
            </span>
          </Link>
        </div>
        <ul className="divide-y divide-gray-200">
          {placeholderPosts.map((post) => (
            <li key={post.id} className="p-6">
              <p className="text-gray-700">{post.content}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* --- 4. EDUCATION CARD --- */}
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

    </div>
  )
}