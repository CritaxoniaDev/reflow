'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useSupabaseRealtime } from './_ts/realtime'
import {
    LogOut,
    Workflow,
    Bell,
    LayoutTemplate,
    Users,
} from 'lucide-react'
import { navigationItems, useLogout } from './_ts/layout'
import { useAccountInfo } from './_ts/account'
import { AuthNavHead } from '@/components/common/auth-nav-head'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
    Skeleton,
} from '@/components/ui'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui'
import { useState, useEffect } from 'react'

// Skeleton Components
const SidebarHeaderSkeleton = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className="flex px-2 py-3">
        {isCollapsed ? (
            <Skeleton className="h-6 w-6 rounded" />
        ) : (
            <Skeleton className="h-8 w-32" />
        )}
    </div>
)

const SidebarNavSkeleton = () => (
    <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
        ))}
    </div>
)

const SidebarResourcesSkeleton = () => (
    <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
        ))}
    </div>
)

const SidebarFooterSkeleton = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className={`w-full rounded-lg border border-border bg-card p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <Skeleton className={isCollapsed ? 'h-5 w-5 rounded-full' : 'h-8 w-8 rounded-full'} />
            {!isCollapsed && (
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                </div>
            )}
        </div>
    </div>
)

function SidebarHeaderContent({ isLoading }: { isLoading: boolean }) {
    const { state } = useSidebar()

    if (isLoading) {
        return <SidebarHeaderSkeleton isCollapsed={state === 'collapsed'} />
    }

    if (state === 'collapsed') return null

    return (
        <div className="flex px-2 py-3">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                Reflooow
            </span>
        </div>
    )
}

function SidebarHeaderWrapper({ isLoading }: { isLoading: boolean }) {
    const { state } = useSidebar()

    return (
        <SidebarHeader className={`border-b border-sidebar-border ${state === 'collapsed' ? 'py-[.81rem] items-center' : ''}`}>
            <div className="flex justify-between items-center">
                <SidebarHeaderContent isLoading={isLoading} />
                <SidebarTrigger className="cursor-w-resize" />
            </div>
        </SidebarHeader>
    )
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const { handleLogout, isLoading } = useLogout()
    const { username, teamName } = useAccountInfo()
    const [isLoadingAccount, setIsLoadingAccount] = useState(true)
    const [isLoadingNav, setIsLoadingNav] = useState(true)

    useEffect(() => {
        if (username) {
            setIsLoadingAccount(false)
        }
    }, [username])

    // Simulate navigation loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoadingNav(false), 500)
        return () => clearTimeout(timer)
    }, [])

    function SidebarFooterContent() {
        const { state } = useSidebar()

        if (isLoadingAccount) {
            return <SidebarFooterSkeleton isCollapsed={state === 'collapsed'} />
        }

        return (
            <DropdownMenu>
                <DropdownMenuTrigger suppressHydrationWarning>
                    <div className="w-full cursor-pointer rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors" suppressHydrationWarning>
                        <div className={`flex items-center ${state === 'collapsed' ? 'justify-center' : 'gap-3'}`} suppressHydrationWarning>
                            <div className={`flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0 transition-all ${state === 'collapsed' ? 'h-5 w-5' : 'h-8 w-8'}`}>
                                <span className={`font-bold text-white ${state === 'collapsed' ? 'text-[10px]' : 'text-xs'}`}>{username.charAt(0).toUpperCase()}</span>
                            </div>
                            {state === 'expanded' && (
                                <div className="flex flex-col text-left min-w-0 flex-1">
                                    <span className="font-medium truncate text-sm uppercase font-mono">{username}</span>
                                    <span className="text-xs text-muted-foreground truncate">{teamName}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="end" className="w-56">
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings/profile')}>
                        <span className="text-sm">Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings/preferences')}>
                        <span className="text-sm">Preferences</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} disabled={isLoading} className="text-red-600">
                        <LogOut className="h-4 w-4" />
                        <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    // Enable realtime sync for all dashboard pages
    useSupabaseRealtime()

    // Don't show global header on flowchart editor pages
    const isFlowchartEditor = pathname.match(/^\/dashboard\/my\/[^/]+$/)

    return (
        <SidebarProvider defaultOpen={true} suppressHydrationWarning>
            <Sidebar collapsible="icon">
                <SidebarHeaderWrapper isLoading={isLoadingNav} />

                <SidebarContent suppressHydrationWarning>
                    {isLoadingNav ? (
                        <>
                            <SidebarGroup>
                                <SidebarGroupLabel>Main</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarNavSkeleton />
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SidebarSeparator />

                            <SidebarGroup>
                                <SidebarGroupLabel>Resources</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarResourcesSkeleton />
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </>
                    ) : (
                        <>
                            <SidebarGroup>
                                <SidebarGroupLabel>Main</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu suppressHydrationWarning>
                                        {navigationItems.map((item) => {
                                            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
                                            return (
                                                <SidebarMenuItem key={item.title} suppressHydrationWarning>
                                                    <SidebarMenuButton className='cursor-pointer'
                                                        isActive={isActive}
                                                        tooltip={item.title}
                                                        onClick={() => router.push(item.href)}
                                                        suppressHydrationWarning
                                                    >
                                                        <item.icon className="h-4 w-4" />
                                                        <span>{item.title}</span>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            )
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>

                            <SidebarSeparator />

                            <SidebarGroup>
                                <SidebarGroupLabel>Resources</SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu suppressHydrationWarning>
                                        <SidebarMenuItem suppressHydrationWarning>
                                            <SidebarMenuButton className='cursor-pointer'
                                                onClick={() => router.push('/dashboard/team')}
                                                suppressHydrationWarning
                                            >
                                                <Users className="h-4 w-4" />
                                                <span>Team</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem suppressHydrationWarning>
                                            <SidebarMenuButton className='cursor-pointer'
                                                onClick={() => router.push('/dashboard/templates')}
                                                suppressHydrationWarning
                                            >
                                                <LayoutTemplate className="h-4 w-4" />
                                                <span>Templates</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem suppressHydrationWarning>
                                            <SidebarMenuButton className='cursor-pointer'
                                                onClick={() => router.push('/dashboard/documentation')}
                                                suppressHydrationWarning
                                            >
                                                <Bell className="h-4 w-4" />
                                                <span>Documentation</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </>
                    )}
                </SidebarContent>

                <SidebarFooter className="p-2 mb-2" suppressHydrationWarning>
                    <SidebarFooterContent />
                </SidebarFooter>
            </Sidebar>

            <div className="flex flex-col flex-1">
                {!isFlowchartEditor && <AuthNavHead />}
                {children}
            </div>
        </SidebarProvider>
    )
}