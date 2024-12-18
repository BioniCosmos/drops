import { deletePaste } from '@/app/actions'
import CodePreview from '@/components/CodePreview'
import prisma from '@/lib/db'
import { getLangName } from '@/lib/lang'
import { format } from 'date-fns'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import DeleteButton from './DeleteButton'

export interface PastePageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const pastes = await prisma.codePaste.findMany()
  return pastes.map(({ id }) => ({ id: String(id) }))
}

export default async function PastePage({ params }: PastePageProps) {
  const id = Number((await params).id)
  if (!(await prisma.codePaste.findUnique({ where: { id } }))) {
    notFound()
  }
  const { title, content, language, createdAt, views } =
    await prisma.codePaste.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-x-4">
                <span>Created: {format(new Date(createdAt), 'PPP')}</span>
                <span>Views: {views}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {getLangName(language)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                New Paste
              </Link>
              <Link
                href={`/edit/${id}`}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit
              </Link>
              <DeleteButton action={deletePaste.bind(null, id)} />
            </div>
          </div>
          <CodePreview content={content} language={language} />
        </div>
      </main>
    </div>
  )
}
