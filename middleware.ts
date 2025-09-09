import { NextRequest, NextResponse } from 'next/server'
import { Duration, year } from './lib/duration'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const token = req.cookies.get('session')?.value
  if (token) {
    res.cookies.set({
      name: 'session',
      value: token,
      maxAge: Duration(year).seconds,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
  }
  return res
}
