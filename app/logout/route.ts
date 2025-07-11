import { deleteSession } from '@/lib/server/auth'
import { redirect } from 'next/navigation'

export async function GET() {
  await deleteSession()
  redirect('/')
}
