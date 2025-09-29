import ProgressBar from '@/components/ProgressBar'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import User from './User'

export const metadata: Metadata = {
  title: 'Drops',
  description: 'Share your code snippets instantly',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
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
            <User />
          </nav>
        </header>
        <main className="grow">
          <ProgressBar>{children}</ProgressBar>
        </main>
        <SpeedInsights />
      </body>
    </html>
  )
}
