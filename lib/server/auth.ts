import { nanoid } from 'nanoid'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { ulid } from 'ulid'
import { day, Duration, minute, year } from '../duration'
import { hash } from '../utils'
import prisma from './db'

export async function createSession(userId: number) {
  const id = ulid()
  const secret = nanoid()
  await prisma.session.create({
    data: {
      id,
      secretHash: await hash(secret),
      userId,
      lastVerifiedAt: new Date(),
    },
  })
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'session',
    value: `${id}.${secret}`,
    maxAge: Duration(year).seconds,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function deleteSession(sessionId?: string) {
  const cookieStore = await cookies()
  if (!sessionId) {
    const token = cookieStore.get('session')?.value
    if (!token) {
      return
    }
    const [id] = token.split('.')
    sessionId = id
  }
  await prisma.session.delete({ where: { id: sessionId } })
}

export const getCurrentSession = cache(async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) {
    return { session: null, user: null }
  }
  const session = await validateSessionToken(token)
  if (!session) {
    return { session: null, user: null }
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } })
  if (!user) {
    return { session: null, user: null }
  }
  return { session, user }
})

async function validateSessionToken(token: string) {
  const [id, secret] = token.split('.')
  const session = await prisma.session.findUnique({ where: { id } })
  if (!session) {
    return null
  }
  const now = new Date()
  if (
    now.getTime() - session.lastVerifiedAt.getTime() >
    Duration(10 * day).milliseconds
  ) {
    await deleteSession(id)
    return null
  }
  const secretHash = await hash(secret)
  if (!constantTimeEqual(secretHash, session.secretHash)) {
    return null
  }
  if (
    now.getTime() - session.lastVerifiedAt.getTime() >
    Duration(10 * minute).milliseconds
  ) {
    await prisma.session.update({
      where: { id },
      data: { lastVerifiedAt: now },
    })
  }
  return session
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.byteLength !== b.byteLength) {
    return false
  }
  let c = 0
  for (let i = 0; i < a.byteLength; i++) {
    c |= a[i] ^ b[i]
  }
  return c === 0
}
