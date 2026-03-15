import { RegisterForm } from '@/components/auth/register-form'

export const metadata = {
  title: 'Register - Reflow',
  description: 'Create your Reflow account',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent px-4 py-12">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}