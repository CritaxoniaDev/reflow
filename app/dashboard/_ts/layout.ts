import { useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Settings,
    Workflow,
    Bell,
} from 'lucide-react'
import { gooeyToast } from 'goey-toast'
import { trpc } from '@/utils/trpc'

export const navigationItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
    },
    {
        title: 'Flowcharts',
        icon: Workflow,
        href: '/dashboard/my',
    },
    {
        title: 'Team',
        icon: Users,
        href: '/dashboard/team',
    },
    {
        title: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
    },
]

export function useLogout() {
    const router = useRouter()
    const logoutMutation = trpc.users.logout.useMutation()

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync()
            gooeyToast.success('Signed out', {
                description: 'You have been signed out successfully.',
            })
            router.push('/')
        } catch (error: any) {
            gooeyToast.error('Logout failed', {
                description: error.message || 'An error occurred while signing out.',
            })
        }
    }

    return { handleLogout, isLoading: logoutMutation.isPending }
}