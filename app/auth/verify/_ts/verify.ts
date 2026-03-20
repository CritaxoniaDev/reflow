import { useCallback, Dispatch, SetStateAction } from 'react'
import { gooeyToast } from 'goey-toast'
import { trpc } from '@/utils/trpc'
import { createBrowserClient } from '@/packages/supabase-v1/client'

export const parseRateLimitSeconds = (error: any): number => {
    const message = error?.message || ''
    const match = message.match(/after (\d+) seconds/)
    return match ? parseInt(match[1], 10) : 0
}

export const verifyTokenHandler = async (
    code: string,
    email: string,
    verifyAndCreateProfileMutation: any,
    verifyLoginMutation: any,
    setRateLimitSeconds: Dispatch<SetStateAction<number>>,
    setSuccess: Dispatch<SetStateAction<boolean>>,
    setIsLogin: Dispatch<SetStateAction<boolean>>,
    onSuccessRedirect: () => void
) => {
    if (!code) {
        return { success: false, isLoading: false }
    }

    if (!email) {
        throw new Error('No email provided')
    }

    const registrationUsername = sessionStorage.getItem('register_username')
    const isRegistrationFlow = !!registrationUsername

    setIsLogin(!isRegistrationFlow)

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

    await new Promise(resolve => setTimeout(resolve, 100))

    if (isRegistrationFlow) {
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
            onSuccessRedirect()
        }
    } else {
        const result = await verifyLoginMutation.mutateAsync({
            email: email.toLowerCase(),
            code,
        })

        if (result.success) {
            gooeyToast.success('Signed in!', {
                description: 'Welcome back to Reflow. Redirecting...',
            })
            setSuccess(true)
            onSuccessRedirect()
        }
    }
}

export const handleManualVerifyHandler = async (
    manualCode: string,
    email: string,
    verifyAndCreateProfileMutation: any,
    verifyLoginMutation: any,
    setRateLimitSeconds: Dispatch<SetStateAction<number>>,
    setSuccess: Dispatch<SetStateAction<boolean>>,
    onSuccessRedirect: () => void
) => {
    if (!email) {
        throw new Error('Email not found')
    }

    if (!manualCode) {
        throw new Error('Please enter the verification code')
    }

    const registrationUsername = sessionStorage.getItem('register_username')
    const isRegistrationFlow = !!registrationUsername

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
            onSuccessRedirect()
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
            onSuccessRedirect()
        }
    }
}

export const useVerifyHandlers = () => {
    const verifyAndCreateProfileMutation = trpc.users.verifyAndCreateProfile.useMutation()
    const verifyLoginMutation = trpc.users.verifyLogin.useMutation()

    const handleVerifyToken = useCallback(
        (
            code: string,
            email: string,
            setRateLimitSeconds: Dispatch<SetStateAction<number>>,
            setSuccess: Dispatch<SetStateAction<boolean>>,
            setIsLogin: Dispatch<SetStateAction<boolean>>,
            onSuccessRedirect: () => void
        ) =>
            verifyTokenHandler(
                code,
                email,
                verifyAndCreateProfileMutation,
                verifyLoginMutation,
                setRateLimitSeconds,
                setSuccess,
                setIsLogin,
                onSuccessRedirect
            ),
        [verifyAndCreateProfileMutation, verifyLoginMutation]
    )

    const handleManualVerify = useCallback(
        (
            manualCode: string,
            email: string,
            setRateLimitSeconds: Dispatch<SetStateAction<number>>,
            setSuccess: Dispatch<SetStateAction<boolean>>,
            onSuccessRedirect: () => void
        ) =>
            handleManualVerifyHandler(
                manualCode,
                email,
                verifyAndCreateProfileMutation,
                verifyLoginMutation,
                setRateLimitSeconds,
                setSuccess,
                onSuccessRedirect
            ),
        [verifyAndCreateProfileMutation, verifyLoginMutation]
    )

    return { handleVerifyToken, handleManualVerify }
}