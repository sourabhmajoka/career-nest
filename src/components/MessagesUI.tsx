// src/components/MessagesUI.tsx
'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Search, Edit, Video, Paperclip, Send } from 'lucide-react'

// Placeholder types
type Conversation = {
  id: string
  name: string
  role: string
  lastMessage: string
  avatar: string // Using initials as a placeholder
}

type Message = {
  id: string
  sender: 'me' | 'them'
  text: string
}

// Placeholder data
const placeholderConversations: Conversation[] = [
  { id: '1', name: 'John Doe', role: 'Alumni, Class of 2020', lastMessage: 'Great, thanks for the info!', avatar: 'JD' },
  { id: '2', name: 'Dr. Jane Smith', role: 'Faculty, Computer Science', lastMessage: 'See you on Monday.', avatar: 'JS' },
  { id: '3', name: 'CSE Study Group', role: 'Group Chat', lastMessage: 'Did anyone finish part 2?', avatar: 'CS' },
]

const placeholderMessages: Message[] = [
  { id: 'a', sender: 'them', text: 'Hey, I saw your post about the job opening. Can you tell me more?' },
  { id: 'b', sender: 'me', text: 'Absolutely! It\'s for a junior developer role. Are you interested?' },
  { id: 'c', sender: 'them', text: 'Great, thanks for the info!' },
]

type MessagesUIProps = {
  user: User
}

export default function MessagesUI({ user }: MessagesUIProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    placeholderConversations[0]
  )

  return (
    <div className="flex h-full w-full overflow-hidden rounded-lg bg-white shadow-lg">
      
      {/* --- 1. Left Pane: Conversation List --- */}
      <div className="flex w-1/3 flex-col border-r border-gray-200">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600">
            <Edit className="h-5 w-5" />
          </button>
        </div>
        {/* Search Bar */}
        <div className="flex-shrink-0 p-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search messages..."
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {placeholderConversations.map((convo) => (
            <div
              key={convo.id}
              onClick={() => setSelectedConversation(convo)}
              className={`flex cursor-pointer items-center space-x-3 p-4 hover:bg-gray-100 ${
                selectedConversation?.id === convo.id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                {convo.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-800">{convo.name}</p>
                <p className="truncate text-sm text-gray-600">{convo.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- 2. Right Pane: Chat Window --- */}
      <div className="flex w-2/3 flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="flex flex-shrink-0 items-center justify-between border-b p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                  {selectedConversation.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedConversation.name}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedConversation.role}</p>
                </div>
              </div>
              <button className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-100">
                <Video className="h-6 w-6" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
              <div className="flex flex-col space-y-4">
                {placeholderMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs rounded-lg px-4 py-3 shadow-sm ${
                        msg.sender === 'me'
                          ? 'rounded-br-none bg-indigo-600 text-white'
                          : 'rounded-bl-none bg-white text-gray-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input Box */}
            <div className="flex-shrink-0 border-t bg-white p-4">
              <div className="flex items-center space-x-3">
                <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600">
                  <Paperclip className="h-6 w-6" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-gray-900 focus:border-indigo-500 focus:outline-none"
                />
                <button className="rounded-full bg-indigo-600 p-2 text-white shadow-md hover:bg-indigo-700">
                  <Send className="h-5 w-5" />
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