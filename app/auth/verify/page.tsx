'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { trpc } from '@/utils/trpc'
import { Input } from '@shadcn/input'
import { Button } from '@/components/ui'
import { ArrowRight } from 'lucide-react'
import { userService } from '@supabase/index'

export default function VerifyPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [manualCode, setManualCode] = useState('')

    const verifySessionMutation = trpc.users.verifySession.useMutation()

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const code = searchParams.get('code')
                const email = searchParams.get('email')

                if (!code) {
                    setLoading(false)
                    return
                }

                if (!email) {
                    throw new Error('No email provided')
                }

                // Verify OTP with Supabase first
                const otpResult = await userService.verifyOtp(email, code)

                if (otpResult) {
                    // Then confirm session via tRPC
                    const sessionResult = await verifySessionMutation.mutateAsync({
                        email: email.toLowerCase()
                    })

                    if (sessionResult.success) {
                        setSuccess(true)
                        setTimeout(() => {
                            router.push('/dashboard')
                        }, 2000)
                    }
                }
            } catch (err: any) {
                setError(err.message || 'Failed to verify email')
                setLoading(false)
            }
        }

        verifyToken()
    }, [searchParams, router, verifySessionMutation])

    const handleManualVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            const email = searchParams.get('email')

            if (!email) {
                throw new Error('Email not found')
            }

            if (!manualCode) {
                throw new Error('Please enter the verification code')
            }

            // Verify OTP with Supabase
            const { data, error } = await userService.verifyOtp(email, manualCode)

            if (error) {
                throw new Error(error.message || 'Invalid verification code')
            }

            if (!data) {
                throw new Error('Verification failed')
            }

            // Confirm session via tRPC using the verified email
            const sessionResult = await verifySessionMutation.mutateAsync({
                email: email.toLowerCase()
            })

            if (sessionResult.success) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/dashboard')
                }, 2000)
            }
        } catch (err: any) {
            setError(err.message || 'Failed to verify code')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent px-4 py-12">
            <div className="w-full max-w-md">
                {/* Loading State */}
                {loading && !success && (
                    <div className="w-full space-y-8">
                        <div className="space-y-3 text-center">
                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl">
                                <span className="text-4xl font-bold text-black dark:text-white" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                                    R
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                Verify your <span className="text-blue-600 dark:text-blue-400" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>email</span>
                            </h1>
                            <p className="text-base text-zinc-600 dark:text-zinc-400">
                                We're confirming your account. One moment...
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50 p-8 sm:p-10">
                            <div className="flex flex-col items-center gap-4">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-zinc-300 dark:border-zinc-600 border-t-blue-600"></div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Verifying your email...</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manual Input State */}
                {!loading && !success && (
                    <div className="w-full space-y-8">
                        <div className="space-y-3 text-center">
                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl">
                                <span className="text-4xl font-bold text-black dark:text-white" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                                    R
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                Verify your <span className="text-blue-600 dark:text-blue-400" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>email</span>
                            </h1>
                            <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                                Enter the code from your email to complete sign up
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50 p-8 sm:p-10">
                            <form onSubmit={handleManualVerify} className="space-y-6">
                                <div className="space-y-3">
                                    <label htmlFor="code" className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        Verification Code
                                    </label>
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="Enter 6-digit code or token"
                                        value={manualCode}
                                        onChange={(e) => setManualCode(e.target.value)}
                                        disabled={verifySessionMutation.isPending}
                                        required
                                        className="pl-4 py-5 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-base font-medium rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Check your email for the verification code
                                    </p>
                                </div>

                                {error && (
                                    <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4">
                                        <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={verifySessionMutation.isPending || !manualCode}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    {verifySessionMutation.isPending ? 'Verifying...' : 'Verify Email'}
                                    {!verifySessionMutation.isPending && <ArrowRight className="ml-2 h-5 w-5" />}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Success State */}
                {success && (
                    <div className="w-full space-y-8">
                        <div className="space-y-3 text-center">
                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl">
                                <span className="text-4xl font-bold text-green-600 dark:text-green-400" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                                    ✓
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                Email <span className="text-green-600 dark:text-green-400" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>verified</span>!
                            </h1>
                            <p className="text-base text-zinc-600 dark:text-zinc-400">
                                Welcome to Reflow. Redirecting to your dashboard...
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50 p-8 sm:p-10">
                            <div className="flex flex-col items-center gap-4">
                                <div className="inline-block h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/30 flex items-center justify-center">
                                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Redirecting...</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}