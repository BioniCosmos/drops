import { PaginationNavbar } from '@/components/PaginationNavbar'
import { Skeleton } from '@/components/ui/skeleton'
import prisma from '@/lib/server/db'
import { cache } from '@/lib/server/utils'

const getUserPastesCount = cache((userId: number) =>
  prisma.codePaste.count({ where: { authorId: userId } }),
)

interface PaginationProps {
  userId: number
  currentPage: number
}

export async function Pagination({ userId, currentPage }: PaginationProps) {
  const totalCount = await getUserPastesCount(userId)

  return (
    <PaginationNavbar
      currentPage={currentPage}
      totalCount={totalCount}
      pathname="/admin"
    />
  )
}

export function PaginationSkeleton() {
  return (
    <div className="flex justify-center">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}
