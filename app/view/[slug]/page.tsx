import DecryptPaste from '@/app/view/[slug]/DecryptPaste'
import { CodePreviewServer } from '@/components/CodePreview/server'
import ExportImport from '@/components/ExportImport'
import { FileManager } from '@/components/FileManager'
import PasteStats from '@/components/PasteStats'
import { getLangName } from '@/lib/lang'
import { getCurrentSession } from '@/lib/server/auth'
import prisma from '@/lib/server/db'
import { format } from 'date-fns'
import { Paperclip } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import WriteOperations from './WriteOperations'

export interface PastePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return prisma.codePaste.findMany()
}

export default async function PastePage({ params }: PastePageProps) {
  const { slug } = await params
  const paste = await prisma.codePaste.findUnique({
    where: { slug },
    include: {
      files: {
        select: {
          id: true,
          filename: true,
          mimeType: true,
          size: true,
          createdAt: true,
        },
      },
    },
    omit: { anonymousKey: true },
  })
  if (!paste) {
    notFound()
  }
  const { user } = await getCurrentSession()
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {paste.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span>{format(new Date(paste.createdAt), 'PPP')}</span>
                <PasteStats
                  slug={paste.slug}
                  initialViews={paste.views}
                  initialUniqueViews={paste.uniqueViews}
                />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {getLangName(paste.language)}
                </span>
                {paste.files.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                    <Paperclip size={12} />
                    {paste.files.length} file
                    {paste.files.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                New
              </Link>
              <Link
                href={`/raw/${paste.slug}`}
                className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800 transition-colors"
                target="_blank"
              >
                Raw
              </Link>
              <ExportImport slug={paste.slug} />
              <WriteOperations paste={paste} user={user} />
            </div>
          </div>
          <DecryptPaste
            initialContent={paste.content}
            language={paste.language}
          >
            <CodePreviewServer
              content={paste.content}
              language={paste.language}
            />
          </DecryptPaste>
          {paste.files.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <FileManager files={paste.files} readonly />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
