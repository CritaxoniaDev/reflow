'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { gooeyToast } from 'goey-toast'
import { trpc } from '@/utils/trpc'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'
import { ArrowRight } from 'lucide-react'
import { createBrowserClient } from '@/packages/supabase-v1/client'

export default function VerifyPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const [manualCode, setManualCode] = useState('')
    const [rateLimitSeconds, setRateLimitSeconds] = useState(0)
    const [isLogin, setIsLogin] = useState(false)

    const verifyAndCreateProfileMutation = trpc.users.verifyAndCreateProfile.useMutation()
    const verifyLoginMutation = trpc.users.verifyLogin.useMutation()

    // Parse rate limit time from error message
    const parseRateLimitSeconds = (error: any): number => {
        const message = error?.message || ''
        const match = message.match(/after (\d+) seconds/)
        return match ? parseInt(match[1], 10) : 0
    }

    // Countdown timer for rate limiting
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

                if (!email) {
                    throw new Error('No email provided')
                }

                // Check if this is a registration or login flow
                const registrationUsername = sessionStorage.getItem('register_username')
                const isRegistrationFlow = !!registrationUsername

                setIsLogin(!isRegistrationFlow)

                console.log('Verify flow:', isRegistrationFlow ? 'registration' : 'login')

                // Verify OTP client-side first (this sets cookies in browser)
                const supabase = createBrowserClient()
                const { data: authData, error: otpError } = await supabase.auth.verifyOtp({
                    email: email.toLowerCase(),
                    token: code,
                    type: 'email',
                })

                if (otpError) {
                    const seconds = parseRateLimitSeconds(otpError)
                    if (seconds > 0) {
                        setRateLimitSeconds(seconds)
                        throw new Error(`Please wait ${seconds}s before trying again`)
                    }
                    throw new Error(otpError.message || 'Invalid verification code')
                }

                if (!authData?.user) {
                    throw new Error('Failed to verify email')
                }

                console.log('OTP verified client-side, session set')

                await new Promise(resolve => setTimeout(resolve, 100))

                // Now call tRPC to get/create profile
                if (isRegistrationFlow) {
                    console.log('Calling verifyAndCreateProfile with email:', email, 'username:', registrationUsername)

                    const result = await verifyAndCreateProfileMutation.mutateAsync({
                        email: email.toLowerCase(),
                        code,
                        username: registrationUsername,
                    })

                    if (result.success) {
                        sessionStorage.removeItem('register_username')
                        gooeyToast.success('Email verified!', {
                            description: 'Welcome to Reflow. Redirecting...',
                        })
                        setSuccess(true)
                        setTimeout(() => {
                            router.push('/dashboard')
                        }, 2000)
                    }
                } else {
                    console.log('Calling verifyLogin with email:', email)

                    const result = await verifyLoginMutation.mutateAsync({
                        email: email.toLowerCase(),
                        code,
                    })

                    if (result.success) {
                        gooeyToast.success('Signed in!', {
                            description: 'Welcome back to Reflow. Redirecting...',
                        })
                        setSuccess(true)
                        setTimeout(() => {
                            router.push('/dashboard')
                        }, 2000)
                    }
                }
            } catch (err: any) {
                console.error('Verify error:', err)
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
    }, [searchParams, router, verifyAndCreateProfileMutation, verifyLoginMutation])

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

            if (!email) {
                throw new Error('Email not found')
            }

            if (!manualCode) {
                throw new Error('Please enter the verification code')
            }

            // Check if this is a registration or login flow
            const registrationUsername = sessionStorage.getItem('register_username')
            const isRegistrationFlow = !!registrationUsername

            console.log('Manual verify flow:', isRegistrationFlow ? 'registration' : 'login')

            // Verify OTP client-side first (this sets cookies in browser)
            const supabase = createBrowserClient()
            const { data: authData, error: otpError } = await supabase.auth.verifyOtp({
                email: email.toLowerCase(),
                token: manualCode,
                type: 'email',
            })

            if (otpError) {
                const seconds = parseRateLimitSeconds(otpError)
                if (seconds > 0) {
                    setRateLimitSeconds(seconds)
                    throw new Error(`Please wait ${seconds}s before trying again`)
                }
                throw new Error(otpError.message || 'Invalid verification code')
            }

            if (!authData?.user) {
                throw new Error('Failed to verify email')
            }

            console.log('OTP verified client-side, session set')

            if (isRegistrationFlow) {
                const result = await verifyAndCreateProfileMutation.mutateAsync({
                    email: email.toLowerCase(),
                    code: manualCode,
                    username: registrationUsername,
                })

                if (result.success) {
                    sessionStorage.removeItem('register_username')
                    gooeyToast.success('Email verified!', {
                        description: 'Welcome to Reflow. Redirecting...',
                    })
                    setSuccess(true)
                    setTimeout(() => {
                        router.push('/dashboard')
                    }, 2000)
                }
            } else {
                const result = await verifyLoginMutation.mutateAsync({
                    email: email.toLowerCase(),
                    code: manualCode,
                })

                if (result.success) {
                    gooeyToast.success('Signed in!', {
                        description: 'Welcome back to Reflow. Redirecting...',
                    })
                    setSuccess(true)
                    setTimeout(() => {
                        router.push('/dashboard')
                    }, 2000)
                }
            }
        } catch (err: any) {
            console.error('Manual verify error:', err)
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
                                Enter the code from your email to complete {isLogin ? 'sign in' : 'sign up'}
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
                                        placeholder="Enter 6-8 digit code"
                                        value={manualCode}
                                        onChange={(e) => setManualCode(e.target.value)}
                                        disabled={(isLogin ? verifyLoginMutation.isPending : verifyAndCreateProfileMutation.isPending) || rateLimitSeconds > 0}
                                        required
                                        className="pl-4 py-5 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-base font-medium rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {rateLimitSeconds > 0
                                            ? `Try again in ${rateLimitSeconds}s`
                                            : 'Check your email for the verification code'}
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={(isLogin ? verifyLoginMutation.isPending : verifyAndCreateProfileMutation.isPending) || !manualCode || rateLimitSeconds > 0}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {(isLogin ? verifyLoginMutation.isPending : verifyAndCreateProfileMutation.isPending) ? 'Verifying...' : rateLimitSeconds > 0 ? `Wait ${rateLimitSeconds}s` : 'Verify Email'}
                                    {!(isLogin ? verifyLoginMutation.isPending : verifyAndCreateProfileMutation.isPending) && rateLimitSeconds <= 0 && <ArrowRight className="ml-2 h-5 w-5" />}
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
                                All set!
                            </h1>
                            <p className="text-base text-zinc-600 dark:text-zinc-400">
                                {isLogin ? 'You have been signed in.' : 'Your email has been verified.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}