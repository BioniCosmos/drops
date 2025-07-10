import { github } from '@/lib/server/oauth'
import { minute } from '@/lib/utils'
import { generateState } from 'arctic'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const state = generateState()
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'github_oauth_state',
    value: state,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 10 * minute,
    sameSite: 'lax',
  })
  return NextResponse.redirect(github().createAuthorizationURL(state, []))
}
