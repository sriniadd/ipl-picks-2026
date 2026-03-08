'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
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
    setMenuOpen(false)
    router.refresh()
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="bg-ipl-blue text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <span className="text-2xl font-bold text-ipl-gold">IPL</span>
            <span className="text-xl font-semibold">Picks 2026</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
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

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-blue-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              onClick={closeMenu}
              className="block py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Matches
            </Link>
            <Link
              href="/leaderboard"
              onClick={closeMenu}
              className="block py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Leaderboard
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/my-picks"
                      onClick={closeMenu}
                      className="block py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      My Picks
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left py-2 px-4 rounded-lg bg-ipl-gold text-ipl-blue font-semibold hover:bg-yellow-400 transition-colors"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="block py-2 px-4 rounded-lg bg-ipl-gold text-ipl-blue font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
