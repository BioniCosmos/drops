import { createSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { github } from '@/lib/server/oauth'
import { OAuth2RequestError } from 'arctic'
import ky from 'ky'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const state = req.nextUrl.searchParams.get('state')
  const storedState = req.cookies.get('github_oauth_state')?.value
  if (!code || !state || !storedState || state !== storedState) {
    return new NextResponse(null, { status: 400 })
  }
  try {
    const tokens = await github().validateAuthorizationCode(code)
    const { login, name } = await ky('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokens.accessToken()}` },
    }).json<{ login: string; name: string }>()
    const existingUser = await prisma.user.findUnique({
      where: { githubId: login },
    })
    if (existingUser) {
      await createSession(existingUser.id)
    } else {
      const user = await prisma.user.create({
        data: {
          userId: login,
          githubId: login,
          username: name,
          isAnonymous: false,
        },
      })
      await createSession(user.id)
    }
    return NextResponse.redirect('/')
  } catch (e) {
    console.error(e)
    if (e instanceof OAuth2RequestError) {
      return new Response(null, { status: 400 })
    }
    return new NextResponse(null, { status: 500 })
  }
}
