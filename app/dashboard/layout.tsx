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
} from '@/components/ui'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui'

function SidebarHeaderContent() {
    const { state } = useSidebar()

    if (state === 'collapsed') return null

    return (
        <div className="flex px-2 py-3">
            <span className="text-xl font-bold" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>
                Reflow
            </span>
        </div>
    )
}

function SidebarHeaderWrapper() {
    const { state } = useSidebar()

    return (
        <SidebarHeader className={`border-b border-sidebar-border ${state === 'collapsed' ? 'py-5 items-center' : ''}`}>
            <div className="flex justify-between items-center">
                <SidebarHeaderContent />
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
    
    // Enable realtime sync for all dashboard pages
    useSupabaseRealtime()

    // Don't show global header on flowchart editor pages
    const isFlowchartEditor = pathname.match(/^\/dashboard\/my\/[^/]+$/)

    return (
        <SidebarProvider defaultOpen={true} suppressHydrationWarning>
            <Sidebar collapsible="icon">
                <SidebarHeaderWrapper />

                <SidebarContent suppressHydrationWarning>
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
                </SidebarContent>

                <SidebarFooter className="p-0 pb-2 px-2" suppressHydrationWarning>
                    <DropdownMenu>
                        <DropdownMenuTrigger suppressHydrationWarning>
                            <div className="w-full cursor-pointer" suppressHydrationWarning>
                                <div className="peer/menu-button group/menu-button w-full overflow-hidden rounded-md px-4 py-3 text-sm outline-none ring-ring hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 flex items-center gap-2" suppressHydrationWarning>
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-400 to-blue-600">
                                        <span className="text-xs font-bold text-white">{username.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="flex flex-col text-left min-w-0">
                                        <span className="font-medium truncate">{username}</span>
                                        <span className="text-xs text-muted-foreground">{teamName}</span>
                                    </div>
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
                </SidebarFooter>
            </Sidebar>

            <div className="flex flex-col flex-1">
                {!isFlowchartEditor && <AuthNavHead />}
                {children}
            </div>
        </SidebarProvider>
    )
}