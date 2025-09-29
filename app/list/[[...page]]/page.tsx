import prisma from '@/lib/server/db'
import { pageSize } from '@/lib/utils'
import Link from 'next/link'
import { Suspense } from 'react'
import { Pagination, PaginationSkeleton } from './Pagination'
import { PasteList, PasteListSkeleton } from './PasteList'

export async function generateStaticParams() {
  const totalCount = await prisma.codePaste.count({ where: { isPublic: true } })
  const totalPages = Math.ceil(totalCount / pageSize)
  return [
    { page: undefined },
    ...Array.from({ length: totalPages - 1 }, (_, i) => ({
      page: [(i + 2).toString()],
    })),
  ]
}

export default async function ListPage({
  params,
}: PageProps<'/list/[[...page]]'>) {
  const { page } = await params
  const currentPage = Number(page) || 1

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Pastes
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Browse recently shared code snippets
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
            <PasteList page={currentPage} />
          </Suspense>
          <Suspense fallback={<PaginationSkeleton />}>
            <Pagination currentPage={currentPage} />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
