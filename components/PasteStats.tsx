'use client'

import { trackPasteView } from '@/app/actions'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface PasteStatsProps {
  id: number
  initialViews: number
  initialUniqueViews: number
}

export default function PasteStats({
  id,
  initialViews,
  initialUniqueViews,
}: PasteStatsProps) {
  const [views, setViews] = useState(initialViews)
  const [uniqueViews, setUniqueViews] = useState(initialUniqueViews)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/view/')) {
      trackPasteView(id).then((result) => {
        if (result) {
          setViews(result.views)
          setUniqueViews(result.uniqueViews)
        }
      })
    }
  }, [id, pathname])

  return (
    <span title={`${uniqueViews} unique visitors`}>
      Views: {views}
      {uniqueViews !== views && (
        <span className="text-xs text-gray-500 ml-1">
          ({uniqueViews} unique)
        </span>
      )}
    </span>
  )
}
