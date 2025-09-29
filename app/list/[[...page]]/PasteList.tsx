import { CodePreviewServer } from '@/components/CodePreview'
import PasteStats from '@/components/PasteStats'
import { Skeleton } from '@/components/ui/skeleton'
import { getLangName } from '@/lib/lang'
import prisma from '@/lib/server/db'
import { cache } from '@/lib/server/utils'
import { pageSize } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'

const getPublicPastes = cache((page: number) =>
  prisma.codePaste.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    omit: { anonymousKey: true },
    take: pageSize,
    skip: (page - 1) * pageSize,
  }),
)

interface PasteListProps {
  page: number
}

export async function PasteList({ page }: PasteListProps) {
  const pastes = await getPublicPastes(page)

  if (pastes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center text-gray-500 dark:text-gray-400">
        No pastes found. Be the first to create one!
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
      {pastes.map(
        ({ title, content, language, createdAt, views, uniqueViews, slug }) => (
          <Link
            key={slug}
            href={`/view/${slug}`}
            className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <span>Created: {format(new Date(createdAt), 'PPP')}</span>
                  <PasteStats
                    slug={slug}
                    initialViews={views}
                    initialUniqueViews={uniqueViews}
                  />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {getLangName(language)}
                  </span>
                </div>
              </div>
              <CodePreviewServer
                content={content}
                language={language}
                preview={true}
              />
            </div>
          </Link>
        ),
      )}
    </div>
  )
}

export function PasteListSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="p-6 space-y-4">
          <div className="space-y-1">
            {/* Title skeleton */}
            <Skeleton className="h-6 w-3/4" />

            {/* Meta info skeleton */}
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>

          {/* Code preview skeleton */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
