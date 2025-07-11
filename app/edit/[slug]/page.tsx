import { updatePaste } from '@/app/actions'
import PasteEditor from '@/components/PasteEditor'
import prisma from '@/lib/server/db'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export interface PastePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return prisma.codePaste.findMany()
}

export default async function PastePage({ params }: PastePageProps) {
  const { slug } = await params
  const paste = await prisma.codePaste.findUnique({ where: { slug } })
  if (!paste) {
    notFound()
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Paste
            </h1>
            <Link
              href={`/view/${slug}`}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
        <PasteEditor
          action={updatePaste.bind(null, slug)}
          initialTitle={paste.title}
          initialContent={paste.content}
          initialLanguage={paste.language}
          initialIsPublic={paste.isPublic}
          submitButtonText="Update Paste"
        />
      </main>
    </div>
  )
}
