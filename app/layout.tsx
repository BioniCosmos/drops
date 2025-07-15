import ProgressBar from '@/components/ProgressBar'
import { getCurrentSession } from '@/lib/server/auth'
import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Drops',
  description: 'Share your code snippets instantly',
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user } = await getCurrentSession()
  return (
    <html lang="en" className="dark">
      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <header className="bg-gray-100 dark:bg-gray-900">
          <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Drops
              </Link>
              <Link
                href="/list"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Browse Pastes
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    href="/admin"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    My Pastes
                  </Link>
                  <a
                    href="/logout"
                    className="text-sm bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </a>
                </>
              ) : (
                <a
                  href="/login/github"
                  className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Login with GitHub
                </a>
              )}
            </div>
          </nav>
        </header>
        <main className="grow">
          <ProgressBar>{children}</ProgressBar>
        </main>
      </body>
    </html>
  )
}
