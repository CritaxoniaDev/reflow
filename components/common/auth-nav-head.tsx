'use client'

import { Bell, Search, Plus } from 'lucide-react'
import { Button, Input, Kbd } from '@/components/ui'
import { AnimatedThemeToggler } from './animated-theme-toggler'

export function AuthNavHead() {
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-17 items-center justify-between px-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search flowcharts..."
              className="pl-10 pr-12 bg-muted/50 border-0"
              suppressHydrationWarning
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5 pointer-events-none">
              <Kbd className="text-xs">⌘</Kbd>
              <Kbd className="text-xs">K</Kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AnimatedThemeToggler suppressHydrationWarning />
          
          <Button variant="ghost" size="icon" suppressHydrationWarning>
            <Bell className="h-5 w-5" />
          </Button>

          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" suppressHydrationWarning>
            <Plus className="h-4 w-4 mr-2" />
            New Flowchart
          </Button>
        </div>
      </div>
    </div>
  )
}