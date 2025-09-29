import { cn, pageSize as defaultPageSize } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'
import { Button } from './ui/button'

interface PaginationProps {
  currentPage: number
  totalCount: number
  pathname: string
  searchParams?: Record<string, string>
  pageSize?: number
  visibleItems?: number
  showFirstLast?: boolean
  className?: string
}

export function PaginationNavbar({
  currentPage,
  totalCount,
  pathname,
  searchParams,
  pageSize = defaultPageSize,
  visibleItems = 5,
  showFirstLast = true,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize)
  const visiblePageItems = getPageItems(currentPage, totalPages, visibleItems)

  function createHref(page: number) {
    if (!searchParams) {
      return page === 1 ? pathname : `${pathname}/${page}`
    }
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', page.toString())
    return `${pathname}?${newSearchParams.toString()}`
  }

  return (
    <nav
      role="navigation"
      aria-label="分页导航"
      className={cn('flex items-center justify-center space-x-1', className)}
    >
      {/* 首页按钮 */}
      {showFirstLast && (
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          className="hidden sm:flex"
        >
          <Link href={createHref(1)}>首页</Link>
        </Button>
      )}
      {/* 上一页按钮 */}
      <Button
        asChild
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        className="flex items-center"
      >
        <Link href={createHref(currentPage - 1)}>
          <ChevronLeft className="size-4" />
          <span className="hidden sm:ml-1 sm:inline">上一页</span>
        </Link>
      </Button>
      {/* 页码按钮 */}
      <div className="flex items-center space-x-1">
        {visiblePageItems.map((page, i) => (
          <Fragment key={i}>
            {page === -1 ? (
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="cursor-default"
              >
                <Ellipsis className="size-4" />
              </Button>
            ) : (
              <Button
                asChild
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                className="min-w-[40px]"
                aria-current={currentPage === page ? 'page' : undefined}
              >
                <Link href={createHref(page as number)}>{page}</Link>
              </Button>
            )}
          </Fragment>
        ))}
      </div>
      {/* 下一页按钮 */}
      <Button
        asChild
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        className="flex items-center"
      >
        <Link href={createHref(currentPage + 1)}>
          <span className="hidden sm:mr-1 sm:inline">下一页</span>
          <ChevronRight className="size-4" />
        </Link>
      </Button>
      {/* 末页按钮 */}
      {showFirstLast && (
        <Button
          asChild
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          className="hidden sm:flex"
        >
          <Link href={createHref(totalPages)}>末页</Link>
        </Button>
      )}
    </nav>
  )
}

function getPageItems(
  currentPage: number,
  totalPages: number,
  visibleItems: number,
) {
  if (totalPages <= visibleItems) {
    return range(1, totalPages)
  }
  const halfVisible = Math.floor(visibleItems / 2)
  const startPage = Math.max(1, currentPage - halfVisible)
  const endPage = Math.min(totalPages, currentPage + halfVisible)
  const firstItem = startPage > 1 ? 1 : 0
  const lastItem = endPage < totalPages ? totalPages : 0
  const startEllipsis = startPage > 2 ? -1 : 0
  const endEllipsis = endPage < totalPages - 1 ? -1 : 0
  return [
    firstItem,
    startEllipsis,
    ...range(startPage, endPage),
    endEllipsis,
    lastItem,
  ].filter(Boolean)
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
