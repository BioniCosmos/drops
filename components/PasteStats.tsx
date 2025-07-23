interface PasteStatsProps {
  views: number
  uniqueViews: number
}

export default function PasteStats({ views, uniqueViews }: PasteStatsProps) {
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
