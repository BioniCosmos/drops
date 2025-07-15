import DeleteButton from '@/components/DeleteButton'
import { getLangName } from '@/lib/lang'
import { getCurrentSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { format } from 'date-fns'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { deletePaste } from '../actions'

const getUserPastes = unstable_cache((userId: number) => {
  return prisma.codePaste.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    omit: { anonymousKey: true },
  })
})

export default async function AdminPage() {
  const { user } = await getCurrentSession()
  if (!user) {
    redirect('/login/github')
  }
  const pastes = await getUserPastes(user.id)
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
                    <span>
                      Created: {format(new Date(paste.createdAt), 'PPP')}
                    </span>
                    <span>Views: {paste.views}</span>
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
          {pastes.length === 0 && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              You haven’t created any pastes yet.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
