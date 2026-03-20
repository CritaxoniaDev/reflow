'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { gooeyToast } from 'goey-toast'
import { InputOTP, InputOTPGroup, InputOTPSlot, Button, Card, CardContent } from '@/components/ui'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { parseRateLimitSeconds, useVerifyHandlers } from './_ts/verify'

export default function VerifyPage() {
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

                        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                            <CardContent className="flex flex-col items-center gap-4 pt-6">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">Verifying your email...</p>
                            </CardContent>
                        </Card>
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
                                Enter the code from your email to complete {isLogin ? 'sign in' : 'sign up'}
                            </p>
                        </div>

                        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                            <CardContent className="pt-6">
                                <form onSubmit={handleManualVerify} className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            Enter 8-digit code
                                        </label>
                                        <div className="flex justify-center">
                                            <InputOTP
                                                maxLength={8}
                                                value={manualCode}
                                                onChange={setManualCode}
                                                disabled={rateLimitSeconds > 0}
                                                containerClassName="gap-2 px-4 py-3"
                                            >
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                </InputOTPGroup>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                    <InputOTPSlot index={6} />
                                                    <InputOTPSlot index={7} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading || manualCode.length !== 8 || rateLimitSeconds > 0}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : rateLimitSeconds > 0 ? (
                                            `Wait ${rateLimitSeconds}s`
                                        ) : (
                                            'Verify'
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Success State */}
                {success && (
                    <div className="w-full space-y-8">
                        <div className="space-y-3 text-center">
                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl">
                                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                            </div>
                            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
                                All set!
                            </h1>
                            <p className="text-base text-zinc-600 dark:text-zinc-400">
                                {isLogin ? 'You have been signed in.' : 'Your email has been verified.'}
                            </p>
                        </div>

                        <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800">
                            <CardContent className="flex flex-col items-center gap-4 pt-6">
                                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}