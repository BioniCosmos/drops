import { getCurrentSession } from '@/lib/server/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Pagination, PaginationSkeleton } from './Pagination'
import { PasteList, PasteListSkeleton } from './PasteList'

export default async function AdminPage({
  params,
}: PageProps<'/admin/[[...page]]'>) {
  const { user } = await getCurrentSession()
  if (!user) {
    redirect('/login/github')
  }

  const { page } = await params
  const currentPage = Number(page) || 1

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Pastes
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Manage your code snippets
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              New Paste
            </Link>
          </div>
          <Suspense fallback={<PasteListSkeleton />}>
            <PasteList userId={user.id} page={currentPage} />
          </Suspense>
          <Suspense fallback={<PaginationSkeleton />}>
            <Pagination userId={user.id} currentPage={currentPage} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
