'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'

// Placeholder types
type Conversation = {
  id: string
  name: string
  lastMessage: string
}

// Placeholder data
const placeholderConversations: Conversation[] = [
  { id: '1', name: 'John Doe (Alumni)', lastMessage: 'Great, thanks for the info!' },
  { id: '2', name: 'Dr. Jane Smith (Faculty)', lastMessage: 'See you on Monday.' },
  { id: '3', name: 'CSE Study Group', lastMessage: 'Did anyone finish part 2?' },
]

// We'll pass the user in as a prop from the server component
type MessagesUIProps = {
  user: User
}

export default function MessagesUI({ user }: MessagesUIProps) {
  // This state will track which chat is open
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    placeholderConversations[0] // Default to opening the first chat
  )

  return (
    <div className="flex h-full w-full overflow-hidden rounded-lg bg-white shadow-lg">
      
      {/* --- 1. Left Pane: Conversation List --- */}
      <div className="w-1/3 border-r border-gray-200">
        <div className="border-b p-4">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          {/* We can add a search bar here later */}
        </div>
        <div className="flex-1 overflow-y-auto">
          {placeholderConversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => setSelectedConversation(convo)}
              className={`cursor-pointer p-4 hover:bg-gray-100 ${
                selectedConversation?.id === convo.id ? 'bg-indigo-50' : ''
              }`}
            >
              <p className="font-semibold text-gray-800">{convo.name}</p>
              <p className="truncate text-sm text-gray-600">{convo.lastMessage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- 2. Right Pane: Chat Window --- */}
      <div className="flex w-2/3 flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedConversation.name}
              </h3>
              <button className="text-indigo-600">
                {/* Placeholder for Video Call Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9a2.25 2.25 0 0 0-2.25 2.25v9A2.25 2.25 0 0 0 4.5 18.75Z" />
                </svg>
              </button>
            </div>

            {/* Chat History (Placeholder) */}
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-center text-gray-500">
                Chat history with {selectedConversation.name} would go here.
              </p>
            </div>

            {/* Message Input Box */}
            <div className="mt-auto border-t p-4">
              <div className="flex items-center space-x-3">
                {/* File Attachment Button */}
                <button className="text-gray-500 hover:text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94a3 3 0 1 1 4.243 4.243l-8.53 8.53a1.5 1.5 0 0 1-2.122-2.122l6.93-6.93" />
                  </svg>
                </button>
                {/* Text Input */}
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
                />
                {/* Send Button */}
                <button className="rounded-full bg-indigo-600 p-2 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L6 12Z" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  )
}