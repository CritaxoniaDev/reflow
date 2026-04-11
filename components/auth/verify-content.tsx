'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { gooeyToast } from 'goey-toast'
import { InputOTP, InputOTPGroup, InputOTPSlot, Button, Card, CardContent } from '@/components/ui'
import { CheckCircle2, Loader2, KeyRound } from 'lucide-react'
import { parseRateLimitSeconds, useVerifyHandlers } from '@/components/auth/_ts/verify'

export function VerifyContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const [manualCode, setManualCode] = useState('')
    const [rateLimitSeconds, setRateLimitSeconds] = useState(0)
    const [isLogin, setIsLogin] = useState(false)

    const { handleVerifyToken, handleManualVerify: handleManualVerifyCallback } = useVerifyHandlers()

    useEffect(() => {
        if (rateLimitSeconds <= 0) return

        const interval = setInterval(() => {
            setRateLimitSeconds((s) => {
                if (s <= 1) {
                    clearInterval(interval)
                    gooeyToast.success('Rate limit lifted', {
                        description: 'You can try again now',
                    })
                    return 0
                }
                return s - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [rateLimitSeconds])

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const code = searchParams.get('code')
                const email = searchParams.get('email')

                if (!code) {
                    setLoading(false)
                    return
                }

                await handleVerifyToken(
                    code,
                    email || '',
                    setRateLimitSeconds,
                    setSuccess,
                    setIsLogin,
                    () => {
                        setLoading(false)
                        setTimeout(() => router.push('/dashboard'), 2000)
                    }
                )
            } catch (err: any) {
                const seconds = parseRateLimitSeconds(err)
                if (seconds > 0) {
                    setRateLimitSeconds(seconds)
                    gooeyToast.error('Too many attempts', {
                        description: `Please wait ${seconds}s before trying again`,
                    })
                } else {
                    gooeyToast.error('Verification failed', {
                        description: err.message || 'Failed to verify email',
                    })
                }
                setLoading(false)
            }
        }

        verifyToken()
    }, [searchParams, router, handleVerifyToken])

    const handleManualVerify = async (e: React.FormEvent) => {
        e.preventDefault()

        if (rateLimitSeconds > 0) {
            gooeyToast.error('Rate limited', {
                description: `Please wait ${rateLimitSeconds}s before trying again`,
            })
            return
        }

        setLoading(true)

        try {
            const email = searchParams.get('email')

            await handleManualVerifyCallback(
                manualCode,
                email || '',
                setRateLimitSeconds,
                setSuccess,
                () => {
                    setLoading(false)
                    setTimeout(() => router.push('/dashboard'), 2000)
                }
            )
        } catch (err: any) {
            const seconds = parseRateLimitSeconds(err)
            if (seconds > 0) {
                setRateLimitSeconds(seconds)
                gooeyToast.error('Too many attempts', {
                    description: `Please wait ${seconds}s before trying again`,
                })
            } else {
                gooeyToast.error('Verification failed', {
                    description: err.message || 'Failed to verify code',
                })
            }
            setLoading(false)
        }
    }

    return (
        <>
            {/* Loading State */}
            {loading && !success && (
                <div className="w-full space-y-8">
                    {/* Header */}
                    <div className="space-y-3 text-center">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl">
                            <span className="text-5xl font-bold text-black dark:text-white" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                                R
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                            Verify your <span className="text-blue-600 dark:text-blue-400 text-5xl font-serif">email</span>
                        </h1>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                            We're confirming your account. One moment...
                        </p>
                    </div>

                    {/* Loading Card */}
                    <div className="rounded-2xl border border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50 p-8 sm:p-10">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">Verifying your email...</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Manual Input State */}
            {!loading && !success && (
                <div className="w-full space-y-8">
                    {/* Header */}
                    <div className="space-y-3 text-center">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl">
                            <span className="text-4xl font-bold text-black dark:text-white" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                                R
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                            Verify your <span className="text-blue-600 dark:text-blue-400 text-5xl font-serif">email</span>
                        </h1>
                        <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                            Enter the 8-digit code from your email to complete {isLogin ? 'sign in' : 'sign up'}
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="rounded-2xl border border-zinc-200 bg-white/50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50 p-8 sm:p-10">
                        <form onSubmit={handleManualVerify} className="space-y-6">
                            {/* Code Input */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <KeyRound className="h-5 w-5 text-zinc-400" />
                                    <label className="text-sm font-semibold text-zinc-900 dark:text-white">
                                        Verification Code
                                    </label>
                                </div>
                                <div className="flex justify-center">
                                    <InputOTP
                                        maxLength={8}
                                        value={manualCode}
                                        onChange={setManualCode}
                                        disabled={rateLimitSeconds > 0}
                                        containerClassName="gap-2"
                                    >
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} className="h-12 w-10 text-lg font-bold" />
                                            <InputOTPSlot index={1} className="h-12 w-10 text-lg font-bold" />
                                            <InputOTPSlot index={2} className="h-12 w-10 text-lg font-bold" />
                                            <InputOTPSlot index={3} className="h-12 w-10 text-lg font-bold" />
                                        </InputOTPGroup>
                                        <span className="text-zinc-400">–</span>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={4} className="h-12 w-10 text-lg font-bold" />
                                            <InputOTPSlot index={5} className="h-12 w-10 text-lg font-bold" />
                                            <InputOTPSlot index={6} className="h-12 w-10 text-lg font-bold" />
                                            <InputOTPSlot index={7} className="h-12 w-10 text-lg font-bold" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                                    Check your email for the verification code
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading || manualCode.length !== 8 || rateLimitSeconds > 0}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : rateLimitSeconds > 0 ? (
                                    `Wait ${rateLimitSeconds}s`
                                ) : (
                                    'Verify Email'
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Didn't receive the code?{' '}
                            <button className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                                Resend
                            </button>
                        </p>
                    </div>
                </div>
            )}

            {/* Success State */}
            {success && (
                <div className="w-full space-y-8">
                    {/* Header */}
                    <div className="space-y-4 text-center">
                        <div className="inline-flex items-center justify-center">
                            <div className="p-3 rounded-full bg-green-100 dark:bg-green-950/40 border border-green-200/60 dark:border-green-900/40">
                                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 scale-100 transition-transform duration-300" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                All <span className="text-green-600 dark:text-green-400 font-serif">set!</span>
                            </h1>
                            <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-sm mx-auto leading-relaxed">
                                {isLogin ? 'You have been signed in successfully.' : 'Your email has been verified successfully.'}
                            </p>
                        </div>
                    </div>

                    {/* Success Card */}
                    <div className="rounded-2xl border border-green-200/60 bg-gradient-to-br from-white/70 to-green-50/40 dark:from-zinc-900/70 dark:to-green-950/20 backdrop-blur-xl shadow-lg dark:border-green-900/40 p-8 sm:p-12">
                        <div className="flex flex-col items-center gap-6">
                            {/* Checkmark with background */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-200/30 dark:bg-green-600/20 rounded-full blur-xl" />
                                <div className="relative p-5 rounded-full bg-green-100 dark:bg-green-950/60 border border-green-200/50 dark:border-green-900/50">
                                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                                </div>
                            </div>

                            {/* Status message */}
                            <div className="text-center space-y-2">
                                <p className="text-base font-semibold text-zinc-900 dark:text-white">
                                    {isLogin ? 'Welcome back!' : 'Account verified!'}
                                </p>
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Redirecting to your dashboard...
                                </p>
                            </div>

                            {/* Loading indicator */}
                            <div className="flex gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
                            </div>
                        </div>
                    </div>

                    {/* Footer hint */}
                    <div className="text-center space-y-2">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            If you're not redirected in a few seconds,{' '}
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                            >
                                click here
                            </button>
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}