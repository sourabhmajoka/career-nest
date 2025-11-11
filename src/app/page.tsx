// src/app/page.tsx
import Image from 'next/image'
import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import Link from 'next/link'
// You might need to install lucide-react: npm install lucide-react
import { ArrowRight, Briefcase, Users, MessageSquare } from 'lucide-react'

export default async function LandingPage() {
  // 1. Get the server-side Supabase client
  const supabase = await createClient() 

  // 2. Check if a user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. If the user is logged in, redirect them to the app's home feed
  if (user) {
    redirect('/home')
  }

  // 4. If no user, show the landing page
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      
      {/* --- Header --- */}
      <header className="absolute z-10 w-full px-6 py-6">
        <nav className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/">
            <Image
              src="/logo.png" // This path points to 'public/logo.png'
              alt="CareerNest Logo"
              width={728} // Set your logo's width
              height={142} // Set your logo's height
              priority // Tells Next.js to load this image first
              className="h-8 w-auto"
            />
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/request-onboarding"> {/* <-- ADDED THIS LINK */}
              <span className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                Add Your College
              </span>
            </Link>
            <Link href="/login">
              <span className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                Log In
              </span>
            </Link>
            <Link href="/sign-up">
              <span className="flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700">
                Sign Up
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Link>
          </div>
        </nav>
      </header>

      {/* --- Hero Section --- */}
      <main className="flex-1">
        <section className="relative flex h-screen items-center justify-center pt-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Connect, Collaborate, and Grow.
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Welcome to CareerNest, the exclusive professional network for
              students, alumni, and faculty of your university community.
            </p>
            <div className="mt-10">
              <Link href="/sign-up">
                <span className="rounded-md bg-indigo-600 px-8 py-3 text-lg font-medium text-white shadow-lg hover:bg-indigo-700">
                  Get Started Today
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* --- Features Section --- */}
        <section className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                Everything You Need
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                A private network built for success.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Briefcase className="h-5 w-5 flex-none text-indigo-600" />
                  Exclusive Job Board
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Find opportunities posted by verified alumni and faculty who
                    want to hire from within your university community.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Users className="h-5 w-5 flex-none text-indigo-600" />
                  Powerful Mentorship
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Connect with experienced alumni and faculty in your field.
                    Give and get advice that truly matters.
                  </p>
                </dd>
              </div>

              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <MessageSquare className="h-5 w-5 flex-none text-indigo-600" />
                  Private Messaging
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    A secure and private way to network, ask questions, and
                    collaborate on projects, all within a trusted network.
                  </p>
                </dd>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-400">
              &copy; {new Date().getFullYear()} CareerNest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
    </div>
  )
}