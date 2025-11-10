// src/components/NestFeed.tsx
'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Grid, Briefcase, Calendar, Users } from 'lucide-react'

// Define the tabs
const tabs = [
  { id: 'all', label: 'All Posts', icon: Grid },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'connections', label: 'Connections', icon: Users },
]

// Define the component's props
type NestFeedProps = {
  user: User
}

export default function NestFeed({ user }: NestFeedProps) {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState('all')

  // Get the user's name for the placeholder
  const placeholderName = user.user_metadata?.full_name || user.email

  return (
    <div className="flex flex-col gap-6">
      
      {/* --- 1. MAKE A POST CARD --- */}
      <div className="rounded-lg bg-white p-4 shadow-md">
        <textarea
          className="w-full rounded-md border-gray-300 p-2 text-gray-900 placeholder:text-gray-400"
          rows={3}
          placeholder={`What's on your mind, ${placeholderName}?`}
        ></textarea>
        <button className="mt-3 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Post
        </button>
      </div>

      {/* --- 2. TAB NAVIGATION --- */}
      <div className="rounded-lg bg-white shadow-md">
        <nav className="flex space-x-2 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium
                ${activeTab === tab.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <span className="flex items-center justify-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* --- 3. TAB CONTENT (THE FEED) --- */}
      <div className="space-y-6">
        
        {/* All Posts Content */}
        {activeTab === 'all' && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold">Showing all posts...</h3>
            <p>(Placeholder for all posts)</p>
          </div>
        )}

        {/* Jobs Content */}
        {activeTab === 'jobs' && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold">Showing only jobs...</h3>
            <p>(Placeholder for job posts)</p>
          </div>
        )}

        {/* Events Content */}
        {activeTab === 'events' && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold">Showing only events...</h3>
            <p>(Placeholder for event posts)</p>
          </div>
        )}

        {/* Connections Content */}
        {activeTab === 'connections' && (
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-2 text-lg font-semibold">Showing updates from connections...</h3>
            <p>(Placeholder for connection posts)</p>
          </div>
        )}
      </div>
    </div>
  )
}