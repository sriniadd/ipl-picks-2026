'use client'

import type { LeaderboardEntry } from '@/types'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full">
        <thead className="bg-ipl-blue text-white">
          <tr>
            <th className="px-4 py-3 text-left">Rank</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-center">Points</th>
            <th className="px-4 py-3 text-center hidden sm:table-cell">Correct</th>
            <th className="px-4 py-3 text-center hidden sm:table-cell">Wrong</th>
            <th className="px-4 py-3 text-center hidden md:table-cell">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                No picks have been made yet. Be the first!
              </td>
            </tr>
          ) : (
            entries.map((entry, index) => {
              const accuracy = entry.total_picks > 0
                ? Math.round((entry.correct / entry.total_picks) * 100)
                : 0

              return (
                <tr
                  key={entry.display_name}
                  className={`border-b ${index < 3 ? 'bg-yellow-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <span className={`
                      ${index === 0 ? 'text-yellow-500 font-bold text-lg' : ''}
                      ${index === 1 ? 'text-gray-400 font-bold' : ''}
                      ${index === 2 ? 'text-amber-600 font-bold' : ''}
                    `}>
                      {index === 0 && '🥇 '}
                      {index === 1 && '🥈 '}
                      {index === 2 && '🥉 '}
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium">{entry.display_name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold ${
                      entry.total_points > 0 ? 'text-green-600' :
                      entry.total_points < 0 ? 'text-red-600' :
                      'text-gray-500'
                    }`}>
                      {entry.total_points > 0 ? '+' : ''}{entry.total_points}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-green-600 hidden sm:table-cell">
                    {entry.correct}
                  </td>
                  <td className="px-4 py-3 text-center text-red-600 hidden sm:table-cell">
                    {entry.wrong}
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">
                    <span className={`px-2 py-1 rounded text-sm ${
                      accuracy >= 60 ? 'bg-green-100 text-green-700' :
                      accuracy >= 40 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {accuracy}%
                    </span>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
