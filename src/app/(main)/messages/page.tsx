import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import MessagesUI from '@/components/MessagesUI' // We will create this next

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // We will pass the user to the client component
  // In the future, we could also fetch the initial conversation list here
  
  return (
    <div className="h-full"> {/* Full height minus navbar */}
      <MessagesUI user={user} />
    </div>
  )
}