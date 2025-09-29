import { deletePaste } from '@/app/actions'
import DeleteButton from '@/components/DeleteButton'
import PasteStats from '@/components/PasteStats'
import { Skeleton } from '@/components/ui/skeleton'
import { getLangName } from '@/lib/lang'
import prisma from '@/lib/server/db'
import { cache } from '@/lib/server/utils'
import { pageSize } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'

const getUserPastes = cache((userId: number, page: number) =>
  prisma.codePaste.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    omit: { anonymousKey: true },
    take: pageSize,
    skip: (page - 1) * pageSize,
  }),
)

interface PasteListProps {
  userId: number
  page: number
}

export async function PasteList({ userId, page }: PasteListProps) {
  const pastes = await getUserPastes(userId, page)

  if (pastes.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center text-gray-500 dark:text-gray-400">
        You haven’t created any pastes yet.
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
      {pastes.map((paste) => (
        <div
          key={paste.id}
          className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="space-y-1">
            <Link href={`/view/${paste.slug}`}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white hover:underline">
                {paste.title}
              </h2>
            </Link>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
              <span>Created: {format(new Date(paste.createdAt), 'PPP')}</span>
              <PasteStats
                slug={paste.slug}
                initialViews={paste.views}
                initialUniqueViews={paste.uniqueViews}
              />
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {getLangName(paste.language)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/edit/${paste.slug}`}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Edit
            </Link>
            <DeleteButton
              action={deletePaste.bind(null, paste.slug, '')}
              className="px-3 py-1 text-sm rounded-lg"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function PasteListSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="space-y-1 flex-1">
            {/* Title skeleton */}
            <Skeleton className="h-6 w-3/4" />

            {/* Meta info skeleton */}
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
