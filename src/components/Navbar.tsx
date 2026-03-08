'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className="bg-ipl-blue text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-ipl-gold">IPL</span>
            <span className="text-xl font-semibold">Picks 2026</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-ipl-gold transition-colors">
              Matches
            </Link>
            <Link href="/leaderboard" className="hover:text-ipl-gold transition-colors">
              Leaderboard
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/my-picks" className="hover:text-ipl-gold transition-colors">
                      My Picks
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="bg-ipl-gold text-ipl-blue px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="bg-ipl-gold text-ipl-blue px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
