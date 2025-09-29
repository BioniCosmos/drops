import { Skeleton } from '@/components/ui/skeleton'
import { getCurrentSession } from '@/lib/server/auth'
import Link from 'next/link'
import { Suspense } from 'react'

export default function User() {
  return (
    <Suspense fallback={<Skeleton className="h-8 w-32" />}>
      <UserContent />
    </Suspense>
  )
}

async function UserContent() {
  const { user } = await getCurrentSession()
  if (!user) {
    return (
      <a
        href="/login/github"
        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Login with GitHub
      </a>
    )
  }
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/admin"
        className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        My Pastes
      </Link>
      <a
        href="/logout"
        className="text-sm bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      >
        Logout
      </a>
    </div>
  )
}
