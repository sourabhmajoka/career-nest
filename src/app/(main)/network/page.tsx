// src/app/(main)/network/page.tsx
import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import NetworkClient from '@/components/NetworkClient' // <-- Import your new client component

// We'll use the server-side client to fetch initial data
// (These queries are examples, adjust as needed)

async function getRequests(supabase: any) {
  // Example: fetch 3 pending requests
  const { data, error } = await supabase
    .from('profiles') // This is just an example
    .select('*')
    .limit(3)
  return data || []
}

async function getSuggestions(supabase: any) {
  // Example: fetch 10 other users
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(10)
  return data || []
}


export default async function NetworkPage() {
  const supabase = createClient()
  
  // 1. Protect the route
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Fetch initial data on the server
  const initialRequests = await getRequests(supabase)
  const initialSuggestions = await getSuggestions(supabase)

  // 3. Render the Client Component and pass data to it
  return (
    <NetworkClient 
      initialRequests={initialRequests} 
      initialSuggestions={initialSuggestions} 
    />
  )
}