import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Sign In - Reflow',
  description: 'Sign in to your Reflow account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="flex items-center justify-center min-h-96">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}