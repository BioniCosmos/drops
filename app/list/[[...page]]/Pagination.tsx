import { PaginationNavbar } from '@/components/PaginationNavbar'
import { Skeleton } from '@/components/ui/skeleton'
import prisma from '@/lib/server/db'
import { cache } from '@/lib/server/utils'

const getTotalCount = cache(() =>
  prisma.codePaste.count({ where: { isPublic: true } }),
)

interface PaginationProps {
  currentPage: number
}

export async function Pagination({ currentPage }: PaginationProps) {
  const totalCount = await getTotalCount()
  return (
    <PaginationNavbar
      currentPage={currentPage}
      totalCount={totalCount}
      pathname="/list"
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
