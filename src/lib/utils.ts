export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function isMatchStarted(matchDate: string): boolean {
  return new Date(matchDate) <= new Date()
}

export function getMatchStatus(match: { status: string; match_date: string }): 'upcoming' | 'live' | 'completed' {
  if (match.status === 'completed') return 'completed'
  if (match.status === 'live') return 'live'
  if (isMatchStarted(match.match_date)) return 'live'
  return 'upcoming'
}

export function getPointsColor(points: number | null): string {
  if (points === null) return 'text-gray-500'
  if (points > 0) return 'text-green-600'
  if (points < 0) return 'text-red-600'
  return 'text-gray-500'
}

export function getConfidenceLabel(confidence: number): string {
  switch (confidence) {
    case 1: return 'Low'
    case 2: return 'Medium'
    case 3: return 'High'
    default: return ''
  }
}
