import { year } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const token = req.cookies.get('session')?.value
  if (token) {
    res.cookies.set({
      name: 'session',
      value: token,
      maxAge: year,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
  }
  return res
}
