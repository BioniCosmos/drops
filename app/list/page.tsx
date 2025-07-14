import { CodePreviewServer } from '@/components/CodePreview'
import { getLangName } from '@/lib/lang'
import prisma from '@/lib/server/db'
import { format } from 'date-fns'
import Link from 'next/link'

export default async function ListPage() {
  const pastes = await prisma.codePaste.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' },
    omit: { anonymousKey: true },
  })

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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg divide-y divide-gray-200 dark:divide-gray-700">
            {pastes.map(
              ({ id, title, content, language, createdAt, views, slug }) => (
                <Link
                  key={id}
                  href={`/view/${slug}`}
                  className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                      </h2>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <span>
                          Created: {format(new Date(createdAt), 'PPP')}
                        </span>
                        <span>Views: {views}</span>
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
          {pastes.length === 0 && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No pastes found. Be the first to create one!
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
