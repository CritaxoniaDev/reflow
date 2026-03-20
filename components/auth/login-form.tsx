'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'
import { useSearchParams } from 'next/navigation'
import { loginFormConfig, useSignInMutation, handleLoginSubmit } from '@/components/auth/_ts/login'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const signInMutation = useSignInMutation(router, redirectTo)

  const handleSubmit = (e: React.FormEvent) => {
    handleLoginSubmit(e, email, signInMutation)
  }

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl">
          <span className="text-4xl font-bold text-black dark:text-white" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
            R
          </span>
        </div>
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
          Welcome <span className="text-blue-600 dark:text-blue-400" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>back</span>
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
          Sign in to your account and continue creating amazing flowcharts.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50 p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-zinc-900 dark:text-white">
              {loginFormConfig.fields.email.label}
            </Label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder={loginFormConfig.fields.email.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={signInMutation.isPending}
                required
                className="pl-12 py-5 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-base font-medium rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {loginFormConfig.fields.email.hint}
            </p>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={signInMutation.isPending || !email}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {signInMutation.isPending ? 'Sending magic link...' : 'Sign In with Email'}
            {!signInMutation.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="text-center space-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Create one
          </Link>
        </p>
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            By signing in, you agree to our{' '}
            <Link href="#" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}