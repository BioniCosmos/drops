import { deleteSession } from '@/lib/server/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  await deleteSession()
  return NextResponse.redirect('/')
}
