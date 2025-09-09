import { Duration, minute } from '@/lib/duration'
import { github } from '@/lib/server/oauth'
import { generateState } from 'arctic'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  const state = generateState()
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'github_oauth_state',
    value: state,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: Duration(10 * minute).seconds,
    sameSite: 'lax',
  })
  redirect(github().createAuthorizationURL(state, []).href)
}
