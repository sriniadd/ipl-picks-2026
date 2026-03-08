'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import type { MatchWithTeams } from '@/types'

function AdminContent() {
  const searchParams = useSearchParams()
  const adminKey = searchParams.get('key')
  const [authorized, setAuthorized] = useState(false)
  const [matches, setMatches] = useState<MatchWithTeams[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      if (!adminKey) {
        setLoading(false)
        return
      }

      const res = await fetch(`/api/admin/verify?key=${encodeURIComponent(adminKey)}`)
      const { valid } = await res.json()

      if (valid) {
        setAuthorized(true)
        fetchMatches()
      } else {
        setLoading(false)
      }
    }

    checkAuth()
  }, [adminKey])

  const fetchMatches = async () => {
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
    setLoading(false)
  }

  const updateResult = async (matchId: string, winnerId: string) => {
    setUpdating(matchId)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/update-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: adminKey,
          matchId,
          winnerId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update result')
      }

      setMessage({ type: 'success', text: `Match result updated! ${data.picksUpdated} picks scored.` })
      fetchMatches()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">You need a valid admin key to access this page.</p>
        <p className="text-gray-400 text-sm mt-2">Use: /admin?key=YOUR_SECRET_KEY</p>
      </div>
    )
  }

  const pendingMatches = matches.filter(m => m.status !== 'completed')
  const completedMatches = matches.filter(m => m.status === 'completed')

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-ipl-blue mb-2">Admin Panel</h1>
        <p className="text-gray-600">Update match results and manage the competition</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Matches Needing Results</h2>
        {pendingMatches.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">All matches have results!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingMatches.map((match) => (
              <div key={match.id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-400">
                        Match {match.match_number}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        match.status === 'live' ? 'bg-red-100 text-red-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {match.status}
                      </span>
                    </div>
                    <p className="font-semibold text-lg">
                      {match.team1.name} vs {match.team2.name}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(match.match_date)}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => updateResult(match.id, match.team1_id)}
                      disabled={updating === match.id}
                      className="px-4 py-2 bg-ipl-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
                    >
                      {updating === match.id ? '...' : `${match.team1.short_name} Won`}
                    </button>
                    <button
                      onClick={() => updateResult(match.id, match.team2_id)}
                      disabled={updating === match.id}
                      className="px-4 py-2 bg-ipl-blue text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
                    >
                      {updating === match.id ? '...' : `${match.team2.short_name} Won`}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-700 mb-4">Completed Matches</h2>
        {completedMatches.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No completed matches yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedMatches.map((match) => (
              <div key={match.id} className="card bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-400">
                      Match {match.match_number}
                    </span>
                    <p className="font-semibold">
                      {match.team1.short_name} vs {match.team2.short_name}
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(match.match_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Winner</p>
                    <p className="font-bold text-green-600 text-lg">
                      {match.winner?.name || '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    }>
      <AdminContent />
    </Suspense>
  )
}
