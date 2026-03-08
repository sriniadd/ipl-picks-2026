'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { formatDate, getPointsColor, getConfidenceLabel } from '@/lib/utils'
import type { PickWithDetails } from '@/types'

export default function MyPicksPage() {
  const [picks, setPicks] = useState<PickWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPoints: 0,
    correct: 0,
    wrong: 0,
    pending: 0,
    accuracy: 0,
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchPicks = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: picksData } = await supabase
        .from('picks')
        .select(`
          *,
          match:matches!picks_match_id_fkey(
            *,
            team1:teams!matches_team1_id_fkey(*),
            team2:teams!matches_team2_id_fkey(*),
            winner:teams!matches_winner_id_fkey(*)
          ),
          picked_team:teams!picks_picked_team_id_fkey(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (picksData) {
        setPicks(picksData as PickWithDetails[])

        // Calculate stats
        let totalPoints = 0
        let correct = 0
        let wrong = 0
        let pending = 0

        picksData.forEach((pick: PickWithDetails) => {
          if (pick.points_earned !== null) {
            totalPoints += pick.points_earned
            if (pick.points_earned > 0) correct++
            else if (pick.points_earned < 0) wrong++
          } else {
            pending++
          }
        })

        const decided = correct + wrong
        const accuracy = decided > 0 ? Math.round((correct / decided) * 100) : 0

        setStats({ totalPoints, correct, wrong, pending, accuracy })
      }

      setLoading(false)
    }

    fetchPicks()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading your picks...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ipl-blue mb-2">My Picks</h1>
        <p className="text-gray-600">Track your predictions and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-sm text-gray-500">Total Points</p>
          <p className={`text-3xl font-bold ${getPointsColor(stats.totalPoints)}`}>
            {stats.totalPoints > 0 ? '+' : ''}{stats.totalPoints}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Accuracy</p>
          <p className="text-3xl font-bold text-ipl-blue">{stats.accuracy}%</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Correct</p>
          <p className="text-3xl font-bold text-green-600">{stats.correct}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">Wrong</p>
          <p className="text-3xl font-bold text-red-600">{stats.wrong}</p>
        </div>
      </div>

      {/* Picks List */}
      {picks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">You haven&apos;t made any picks yet.</p>
          <a href="/" className="text-ipl-blue font-semibold hover:underline">
            Go to matches →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {picks.map((pick) => (
            <div key={pick.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-400">
                      Match {pick.match.match_number}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      pick.match.status === 'completed' ? 'bg-gray-100 text-gray-600' :
                      pick.match.status === 'live' ? 'bg-red-100 text-red-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {pick.match.status}
                    </span>
                  </div>
                  <p className="font-semibold">
                    {pick.match.team1.short_name} vs {pick.match.team2.short_name}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(pick.match.match_date)}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Your Pick</p>
                    <p className="font-semibold">{pick.picked_team.short_name}</p>
                    <p className="text-xs text-gray-400">
                      {getConfidenceLabel(pick.confidence)} ({pick.confidence} pt{pick.confidence > 1 ? 's' : ''})
                    </p>
                  </div>

                  {pick.match.status === 'completed' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-500">Winner</p>
                        <p className="font-semibold text-green-600">
                          {pick.match.winner?.short_name || '-'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Points</p>
                        <p className={`text-2xl font-bold ${getPointsColor(pick.points_earned)}`}>
                          {pick.points_earned !== null ? (
                            <>
                              {pick.points_earned > 0 ? '+' : ''}{pick.points_earned}
                            </>
                          ) : '-'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
