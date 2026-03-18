import { trpc } from '@/utils/trpc'
import { gooeyToast } from 'goey-toast'

export const registerFormConfig = {
  fields: {
    username: {
      id: 'username',
      type: 'text',
      placeholder: 'john_doe',
      label: 'Username',
      hint: 'Your unique identifier. Can contain letters, numbers, and underscores.',
    },
    email: {
      id: 'email',
      type: 'email',
      placeholder: 'you@company.com', 
      label: 'Email',
      hint: "We'll send you a secure magic link to sign in.",
    },
  },
}

export const useRegisterMutation = (router: any) => {
  return trpc.users.register.useMutation({
    onSuccess: async (data) => {
      gooeyToast.success('Check your email!', {
        description: 'Magic link sent to ' + data.email,
      })

      // OTP already sent by the server during register mutation
      setTimeout(() => {
        router.push(`/auth/verify?email=${encodeURIComponent(data.email)}`)
      }, 1500)
    },
    onError: (error) => {
      gooeyToast.error('Registration failed', {
        description: error.message,
      })
    },
  })
}

export const handleRegisterSubmit = (
  e: React.FormEvent,
  username: string,
  email: string,
  registerMutation: any,
  clearFields: () => void
) => {
  e.preventDefault()
  
  // Store username in sessionStorage BEFORE the mutation
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('register_username', username)
  }
  
  registerMutation.mutate({ username, email })
}