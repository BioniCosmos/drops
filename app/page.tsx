import PasteEditor from '@/components/PasteEditor'
import Link from 'next/link'
import { createPaste } from './actions'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Drops
            </h1>
            <Link
              href="/list"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Pastes
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Share your code snippets instantly
          </p>
        </div>
        <PasteEditor action={createPaste} submitButtonText="Create Paste" />
      </main>
    </div>
  )
}
