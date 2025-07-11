import { nanoid } from 'nanoid'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { ulid } from 'ulid'
import { day, minute, year } from '../utils'
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
    maxAge: year,
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
  cookieStore.delete('session')
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
  if (new Date().getTime() - session.lastVerifiedAt.getTime() > 10 * day) {
    await deleteSession(id)
    return null
  }
  const secretHash = await hash(secret)
  if (!constantTimeEqual(secretHash, session.secretHash)) {
    return null
  }
  const now = new Date()
  if (now.getTime() - session.lastVerifiedAt.getTime() > 10 * minute) {
    await prisma.session.update({
      where: { id },
      data: { lastVerifiedAt: now },
    })
  }
  return session
}

async function hash(secret: string) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(secret),
  )
  return new Uint8Array(buf)
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
