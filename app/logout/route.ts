import { deleteSession } from '@/lib/server/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET() {
  await deleteSession()
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/')
}
