'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Leaderboard from '@/components/Leaderboard'
import type { LeaderboardEntry } from '@/types'

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Use a raw query to get leaderboard data
      const { data, error } = await supabase.rpc('get_leaderboard')

      if (data && !error) {
        setEntries(data)
      } else {
        // Fallback: fetch and compute manually
        const { data: profiles } = await supabase.from('profiles').select('*')
        const { data: picks } = await supabase
          .from('picks')
          .select('*')
          .not('points_earned', 'is', null)

        if (profiles) {
          const entriesMap: Record<string, LeaderboardEntry> = {}

          profiles.forEach((profile: any) => {
            entriesMap[profile.id] = {
              display_name: profile.display_name,
              total_points: 0,
              correct: 0,
              wrong: 0,
              total_picks: 0,
            }
          })

          picks?.forEach((pick: any) => {
            if (entriesMap[pick.user_id]) {
              entriesMap[pick.user_id].total_points += pick.points_earned || 0
              entriesMap[pick.user_id].total_picks += 1
              if (pick.points_earned > 0) {
                entriesMap[pick.user_id].correct += 1
              } else if (pick.points_earned < 0) {
                entriesMap[pick.user_id].wrong += 1
              }
            }
          })

          const sortedEntries = Object.values(entriesMap).sort(
            (a, b) => b.total_points - a.total_points
          )
          setEntries(sortedEntries)
        }
      }

      setLoading(false)
    }

    fetchLeaderboard()
  }, [])

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ipl-blue mb-2">Leaderboard</h1>
        <p className="text-gray-600">See who&apos;s leading the prediction game!</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-gray-500">Loading leaderboard...</div>
        </div>
      ) : (
        <Leaderboard entries={entries} />
      )}
    </div>
  )
}
