import { trpc } from '@/utils/trpc'
import { gooeyToast } from 'goey-toast'

export const loginFormConfig = {
  fields: {
    email: {
      id: 'email',
      type: 'email',
      placeholder: 'you@email.com',
      label: 'Email',
      hint: "We'll send you a secure magic link to sign in.",
    },
  },
}

export const useSignInMutation = (router: any) => {
  return trpc.users.signIn.useMutation({
    onSuccess: async (data) => {
      gooeyToast.success('Magic link sent!', {
        description: 'Check your email to sign in.',
      })

      // Store email in sessionStorage for verify page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('login_email', data.email)
      }

      // Redirect to verify page (OTP already sent by server)
      setTimeout(() => {
        router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`)
      }, 1500)
    },
    onError: (error) => {
      gooeyToast.error('Sign in failed', {
        description: error.message,
      })
    },
  })
}

export const handleLoginSubmit = (
  e: React.FormEvent,
  email: string,
  signInMutation: any
) => {
  e.preventDefault()
  signInMutation.mutate({ email })
}