import PasteEditor from '@/components/PasteEditor'
import { createPaste } from './actions'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <PasteEditor action={createPaste} submitButtonText="Create Paste" />
    </div>
  )
}
