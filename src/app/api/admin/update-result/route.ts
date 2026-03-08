import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { key, matchId, winnerId } = await request.json()

    // Verify admin key
    const adminKey = process.env.ADMIN_SECRET_KEY
    if (!adminKey || key !== adminKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create Supabase client with service role for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Update match with winner and set status to completed
    const { error: matchError } = await supabase
      .from('matches')
      .update({
        winner_id: winnerId,
        status: 'completed',
      })
      .eq('id', matchId)

    if (matchError) {
      throw new Error(`Failed to update match: ${matchError.message}`)
    }

    // Get all picks for this match
    const { data: picks, error: picksError } = await supabase
      .from('picks')
      .select('*')
      .eq('match_id', matchId)

    if (picksError) {
      throw new Error(`Failed to fetch picks: ${picksError.message}`)
    }

    // Calculate and update points for each pick
    let picksUpdated = 0
    for (const pick of picks || []) {
      const isCorrect = pick.picked_team_id === winnerId
      const pointsEarned = isCorrect ? pick.confidence : -pick.confidence

      const { error: updateError } = await supabase
        .from('picks')
        .update({ points_earned: pointsEarned })
        .eq('id', pick.id)

      if (updateError) {
        console.error(`Failed to update pick ${pick.id}:`, updateError)
      } else {
        picksUpdated++
      }
    }

    return NextResponse.json({
      success: true,
      picksUpdated,
      message: `Match result updated. ${picksUpdated} picks scored.`,
    })
  } catch (error: any) {
    console.error('Admin update error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
