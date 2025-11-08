// app/(main)/profile/page.tsx
import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
// We don't need the LogoutButton here anymore, it's in the layout

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return <div>Error loading your profile. Please try again.</div>
  }

  return (
    <div className="mx-auto max-w-3xl p-8"> {/* <-- 1. Increased width */}
      
      {/* 2. Made title dark */}
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Your Profile
      </h1>
      
      {/* 3. Added 'relative' to this div */}
      <div className="relative rounded-lg bg-white p-6 shadow-md">
        
        {/* 4. This is the new Profile Picture placeholder */}
        <div className="absolute top-6 right-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
            {/* You can add an icon or image tag here later */}
            <span className="text-3xl text-gray-500">
              {profile.full_name ? profile.full_name[0] : (user.email ? user.email[0] : 'A')}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <p className="text-lg text-gray-900">{user.email}</p>
        </div>
        
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <p className="text-lg text-gray-900">{profile.full_name || 'Not set'}</p>
        </div>
        
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Graduation Year</label>
          <p className="text-lg text-gray-900">{profile.graduation_year || 'Not set'}</p>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Role</label>
          <p className="text-lg capitalize text-gray-900">{profile.role || 'Not set'}</p>
        </div>
      </div>
    </div>
  )
}