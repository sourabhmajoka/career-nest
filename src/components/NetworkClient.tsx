// src/components/NetworkClient.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { Search, UserPlus, Check, X, Users } from 'lucide-react'

// Define the types for our data
type Profile = {
  id: string
  full_name: string
  role: string
  // Add other fields you might fetch, like avatar_url
}
type Request = Profile // Assuming requests are just profiles for now

type NetworkClientProps = {
  initialRequests: Request[]
  initialSuggestions: Profile[]
}

export default function NetworkClient({ initialRequests, initialSuggestions }: NetworkClientProps) {
  // --- STATE ---
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [requests, setRequests] = useState(initialRequests)
  const [suggestions, setSuggestions] = useState(initialSuggestions)
  const [searchResults, setSearchResults] = useState<Profile[] | null>(null)

  // --- FUNCTIONS ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults(null) // If search is empty, show default lists
      return
    }

    setIsLoading(true)
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('full_name', `%${searchQuery}%`)
      .limit(20)

    if (data) {
      setSearchResults(data)
    } else {
      setSearchResults([]) // Show "no results"
    }
    setIsLoading(false)
  }

  // --- RENDER LOGIC ---
  return (
    <div>
      {/* 1. Sticky header (Title and Search) */}
      <div className="sticky top-0 z-10 bg-gray-100 px-8 pt-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Network</h1>
        <form onSubmit={handleSearch} className="mb-8">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              className="block w-full rounded-full border border-gray-300 bg-white p-4 pl-10 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Search for people, faculty, or departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* 2. Scrollable content area */}
      <div className="px-8 pb-8">
        
        {/* We show search results OR the default view */}
        {searchResults ? (
          // --- SEARCH RESULTS VIEW ---
          // (This now uses the new card grid as well)
          <div className="rounded-lg bg-white shadow-md">
            <div className="border-b p-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results ({searchResults.length})
              </h2>
            </div>
            {isLoading ? (
              <p className="p-4 text-gray-500">Loading...</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 lg:grid-cols-5">
                {searchResults.length === 0 ? (
                  <p className="p-4 text-gray-500">No people found.</p>
                ) : (
                  searchResults.map((person) => (
                    <div key={person.id} className="flex flex-col items-center rounded-lg border border-gray-200 p-4 shadow-sm">
                      <div className="h-20 w-20 rounded-full bg-gray-200 mb-3" />
                      <div className="text-center">
                        <p className="font-bold text-gray-900">{person.full_name}</p>
                        <p className="text-sm text-gray-600 mb-3">{person.role}</p>
                      </div>
                      <button className="flex w-full items-center justify-center gap-2 rounded-full border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
                        <UserPlus className="h-4 w-4" />
                        Connect
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          // --- DEFAULT VIEW ---
          <div className="space-y-6">
            
            {/* --- Top 2-Column Grid --- */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              
              {/* --- Left Column (Manage My Network) --- */}
              <div className="lg:col-span-1">
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h2 className="mb-4 text-xl font-semibold text-gray-900">
                    Manage My Network
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-gray-500" />
                        <span className="font-medium text-gray-700">My Connections</span>
                      </div>
                      <span className="font-semibold text-gray-900">2</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* --- Right Column (Connection Requests) --- */}
              <div className="lg:col-span-3">
                <div className="rounded-lg bg-white shadow-md">
                  <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Connection Requests ({requests.length})
                    </h2>
                    <Link href="/network/requests">
                      <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        View all
                      </span>
                    </Link>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {requests.slice(0, 3).map((person) => (
                      <li key={person.id} className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-200" />
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">{person.full_name}</p>
                            <p className="text-sm text-gray-600">{person.role}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600"><X className="h-5 w-5" /></button>
                            <button className="rounded-full border border-indigo-600 p-2 text-indigo-600 hover:bg-indigo-100"><Check className="h-5 w-5" /></button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* --- Bottom Full-Width Section --- */}
            <div className="rounded-lg bg-white shadow-md">
              <div className="flex items-center justify-between border-b p-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  People You May Know
                </h2>
                <Link href="/network/suggestions">
                  <span className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    View all
                  </span>
                </Link>
              </div>
              
              {/* --- THIS IS THE NEW GRID LAYOUT --- */}
              <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3 lg:grid-cols-5">
                {suggestions.slice(0, 10).map((person) => (
                  <div key={person.id} className="flex flex-col items-center rounded-lg border border-gray-200 p-4 shadow-sm">
                    {/* Avatar */}
                    <div className="h-20 w-20 rounded-full bg-gray-200 mb-3" />
                    {/* Info */}
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{person.full_name}</p>
                      <p className="text-sm text-gray-600 mb-3">{person.role}</p>
                    </div>
                    {/* Connect Button */}
                    <button className="flex w-full items-center justify-center gap-2 rounded-full border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-100">
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </button>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  )
}