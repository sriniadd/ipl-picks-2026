'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { formatDate, isMatchStarted, getPointsColor } from '@/lib/utils'
import ConfidenceSelector from './ConfidenceSelector'
import type { MatchWithTeams, Pick } from '@/types'

interface MatchCardProps {
  match: MatchWithTeams
  userPick?: Pick | null
  userId?: string | null
  onPickUpdate?: () => void
}

export default function MatchCard({ match, userPick, userId, onPickUpdate }: MatchCardProps) {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(userPick?.picked_team_id ?? null)
  const [confidence, setConfidence] = useState<1 | 2 | 3 | null>(userPick?.confidence ?? null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const matchStarted = isMatchStarted(match.match_date)
  const canPick = userId && !matchStarted && match.status === 'upcoming'

  useEffect(() => {
    setSelectedTeam(userPick?.picked_team_id ?? null)
    setConfidence(userPick?.confidence ?? null)
  }, [userPick])

  const handleSavePick = async () => {
    if (!userId || !selectedTeam || !confidence) return

    setSaving(true)
    setError(null)

    try {
      const { error: upsertError } = await supabase
        .from('picks')
        .upsert({
          user_id: userId,
          match_id: match.id,
          picked_team_id: selectedTeam,
          confidence: confidence,
        }, {
          onConflict: 'user_id,match_id',
        })

      if (upsertError) throw upsertError
      onPickUpdate?.()
    } catch (err: any) {
      setError(err.message || 'Failed to save pick')
    } finally {
      setSaving(false)
    }
  }

  const getTeamButtonClass = (teamId: string) => {
    const isSelected = selectedTeam === teamId
    const isWinner = match.winner_id === teamId
    const isLoser = match.status === 'completed' && match.winner_id && match.winner_id !== teamId

    if (match.status === 'completed') {
      if (isWinner) return 'border-green-500 bg-green-50 ring-2 ring-green-400'
      if (isLoser) return 'border-red-300 bg-red-50 opacity-60'
    }

    if (isSelected) return 'border-ipl-blue bg-blue-50 ring-2 ring-ipl-blue'
    return 'border-gray-200 hover:border-gray-300'
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-semibold text-gray-400">Match {match.match_number}</span>
          <p className="text-sm text-gray-600">{match.venue}</p>
        </div>
        <div className="text-right">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${
            match.status === 'completed' ? 'bg-gray-100 text-gray-600' :
            match.status === 'live' ? 'bg-red-100 text-red-600' :
            'bg-green-100 text-green-600'
          }`}>
            {match.status === 'completed' ? 'Completed' :
             match.status === 'live' ? 'LIVE' :
             'Upcoming'}
          </span>
          <p className="text-xs text-gray-500 mt-1">{formatDate(match.match_date)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => canPick && setSelectedTeam(match.team1_id)}
          disabled={!canPick}
          className={`p-4 rounded-lg border-2 transition-all ${getTeamButtonClass(match.team1_id)} ${
            canPick ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-ipl-blue">{match.team1.short_name}</div>
            <div className="text-sm text-gray-600">{match.team1.name}</div>
          </div>
        </button>

        <button
          onClick={() => canPick && setSelectedTeam(match.team2_id)}
          disabled={!canPick}
          className={`p-4 rounded-lg border-2 transition-all ${getTeamButtonClass(match.team2_id)} ${
            canPick ? 'cursor-pointer' : 'cursor-default'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-ipl-blue">{match.team2.short_name}</div>
            <div className="text-sm text-gray-600">{match.team2.name}</div>
          </div>
        </button>
      </div>

      {canPick && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Confidence:</p>
              <ConfidenceSelector
                value={confidence}
                onChange={setConfidence}
                disabled={!selectedTeam}
              />
            </div>
            <button
              onClick={handleSavePick}
              disabled={!selectedTeam || !confidence || saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : userPick ? 'Update Pick' : 'Save Pick'}
            </button>
          </div>
          {error && (
            <p className="text-red-600 text-sm mt-2">{error}</p>
          )}
        </div>
      )}

      {userPick && (
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Your Pick:</p>
              <p className="font-semibold">
                {userPick.picked_team_id === match.team1_id ? match.team1.short_name : match.team2.short_name}
                {' '}({userPick.confidence} pt{userPick.confidence > 1 ? 's' : ''})
              </p>
            </div>
            {match.status === 'completed' && userPick.points_earned !== null && (
              <div className="text-right">
                <p className="text-sm text-gray-500">Points:</p>
                <p className={`text-xl font-bold ${getPointsColor(userPick.points_earned)}`}>
                  {userPick.points_earned > 0 ? '+' : ''}{userPick.points_earned}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {!userId && !matchStarted && (
        <div className="border-t pt-4 text-center">
          <p className="text-sm text-gray-500">
            <a href="/login" className="text-ipl-blue font-semibold hover:underline">Sign in</a> to make your pick
          </p>
        </div>
      )}
    </div>
  )
}
