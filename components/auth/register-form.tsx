'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Mail, User } from 'lucide-react'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui'
import { Label } from '@/components/ui'
import { registerFormConfig, useRegisterMutation, handleRegisterSubmit } from '@/components/auth/_ts/register'

export function RegisterForm() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')

    const registerMutation = useRegisterMutation(router)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        handleRegisterSubmit(e, username, email, registerMutation, () => {
            setUsername('')
            setEmail('')
        })
    }

    return (
        <div className="w-full space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl">
                    <span className="text-5xl font-bold text-black dark:text-white" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                        R
                    </span>
                </div>
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                    Create <span className="text-blue-600 dark:text-blue-400 text-5xl font-serif mr-1">your</span> account
                </h1>
                <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                    Join thousands of teams creating flowcharts together. No credit card required.
                </p>
            </div>

            {/* Form Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50 p-8 sm:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Username */}
                    <div className="space-y-3">
                        <Label htmlFor="username" className="text-sm font-semibold text-zinc-900 dark:text-white">
                            {registerFormConfig.fields.username.label}
                        </Label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                id="username"
                                type="text"
                                placeholder={registerFormConfig.fields.username.placeholder}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={registerMutation.isPending}
                                required
                                className="pl-12 py-5 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-base font-medium rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {registerFormConfig.fields.username.hint}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-semibold text-zinc-900 dark:text-white">
                            {registerFormConfig.fields.email.label}
                        </Label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                id="email"
                                type="email"
                                placeholder={registerFormConfig.fields.email.placeholder}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={registerMutation.isPending}
                                required
                                className="pl-12 py-5 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-base font-medium rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {registerFormConfig.fields.email.hint}
                        </p>
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={registerMutation.isPending || !username || !email}
                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        {registerMutation.isPending ? 'Creating account...' : 'Continue with Email'}
                        {!registerMutation.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
                    </Button>
                </form>
            </div>

            {/* Footer */}
            <div className="text-center space-y-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                        Sign in
                    </Link>
                </p>
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        By registering, you agree to our{' '}
                        <Link href="#" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
                            Terms
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}