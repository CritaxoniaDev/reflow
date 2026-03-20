import { Suspense } from 'react'
import { VerifyContent } from '@/components/auth/verify-content'

export const metadata = {
  title: 'Verify Email - Reflow',
  description: 'Verify your email to complete registration or sign in',
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="flex items-center justify-center min-h-96">Loading verification...</div>}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  )
}