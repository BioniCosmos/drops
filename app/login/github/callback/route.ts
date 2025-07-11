import { createSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { github } from '@/lib/server/oauth'
import { OAuth2RequestError } from 'arctic'
import ky from 'ky'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  const storedState = req.cookies.get('github_oauth_state')?.value
  if (!code || !state || !storedState || state !== storedState) {
    return new Response('invalid state or code', { status: 400 })
  }
  try {
    const tokens = await github().validateAuthorizationCode(code)
    const { login, name } = await ky('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokens.accessToken()}` },
    }).json<{ login: string; name: string }>()
    const existingUser = await prisma.user.findUnique({
      where: { githubId: login },
    })
    const userId = existingUser
      ? existingUser.id
      : await prisma.user
          .create({
            data: { userId: login, githubId: login, username: name },
          })
          .then(({ id }) => id)
    await createSession(userId)
    req.cookies.delete('github_oauth_state')
    redirect('/')
  } catch (e) {
    if (isRedirectError(e)) {
      throw e
    }
    if (e instanceof OAuth2RequestError) {
      return new Response(e.message, { status: 400 })
    }
    console.error(e)
    return new Response(null, { status: 500 })
  }
}
