'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import MatchCard from '@/components/MatchCard'
import type { MatchWithTeams, Pick } from '@/types'

export default function Home() {
  const [matches, setMatches] = useState<MatchWithTeams[]>([])
  const [picks, setPicks] = useState<Record<string, Pick>>({})
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    setUserId(user?.id ?? null)

    // Fetch matches with team data
    const { data: matchesData } = await supabase
      .from('matches')
      .select(`
        *,
        team1:teams!matches_team1_id_fkey(*),
        team2:teams!matches_team2_id_fkey(*),
        winner:teams!matches_winner_id_fkey(*)
      `)
      .order('match_date', { ascending: true })

    if (matchesData) {
      setMatches(matchesData as MatchWithTeams[])
    }

    // Fetch user's picks if logged in
    if (user) {
      const { data: picksData } = await supabase
        .from('picks')
        .select('*')
        .eq('user_id', user.id)

      if (picksData) {
        const picksMap: Record<string, Pick> = {}
        picksData.forEach((pick: Pick) => {
          picksMap[pick.match_id] = pick
        })
        setPicks(picksMap)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchData()
    })

    return () => subscription.unsubscribe()
  }, [])

  const upcomingMatches = matches.filter(m => m.status === 'upcoming')
  const liveMatches = matches.filter(m => m.status === 'live')
  const completedMatches = matches.filter(m => m.status === 'completed')

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading matches...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ipl-blue mb-2">IPL 2026 Picks</h1>
        <p className="text-gray-600">Pick winners with confidence and compete for glory!</p>
      </div>

      {liveMatches.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            Live Matches
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {liveMatches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                userPick={picks[match.id]}
                userId={userId}
                onPickUpdate={fetchData}
              />
            ))}
          </div>
        </section>
      )}

      {upcomingMatches.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-green-600 mb-4">Upcoming Matches</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingMatches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                userPick={picks[match.id]}
                userId={userId}
                onPickUpdate={fetchData}
              />
            ))}
          </div>
        </section>
      )}

      {completedMatches.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-600 mb-4">Completed Matches</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {completedMatches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                userPick={picks[match.id]}
                userId={userId}
                onPickUpdate={fetchData}
              />
            ))}
          </div>
        </section>
      )}

      {matches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No matches scheduled yet.</p>
          <p className="text-gray-400 text-sm mt-2">Check back soon for IPL 2026 fixtures!</p>
        </div>
      )}
    </div>
  )
}
