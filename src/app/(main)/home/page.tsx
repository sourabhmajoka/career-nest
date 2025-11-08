import { createClient } from '@/lib/supabaseServer' // <-- 1. This is fixed
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = createClient() // <-- 1. This is fixed

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Home Feed</h1>

      {/* Placeholder: Post Creation Box */}
      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <textarea
          className="w-full rounded-md border border-gray-300 p-2 text-gray-900 placeholder:text-gray-400"
          rows={3}
          placeholder={`What's on your mind, ${user.email}?`}
        ></textarea>
        <button className="mt-3 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Post
        </button>
      </div>

      {/* Placeholder: Feed Content */}
      <div className="space-y-4">
        {/* ... your feed content ... */}
      </div>

    </div>
  )
}