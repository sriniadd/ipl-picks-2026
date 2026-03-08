import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  const adminKey = process.env.ADMIN_SECRET_KEY

  if (!adminKey) {
    return NextResponse.json({ valid: false, error: 'Admin key not configured' })
  }

  const valid = key === adminKey

  return NextResponse.json({ valid })
}
