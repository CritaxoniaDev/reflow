'use client'

import { Bell, Search, Plus, ChevronLeft, Save, Users } from 'lucide-react'
import { Button, Input, Kbd } from '@/components/ui'
import { AnimatedThemeToggler } from './animated-theme-toggler'
import { Badge } from '@/packages/shadcn-v1/badge'

interface ActiveMember {
  userId: string
  username: string
  color: string
}

interface AuthNavHeadProps {
  showFlowchartEditor?: boolean
  flowchartName?: string
  onFlowchartNameChange?: (name: string) => void
  onBack?: () => void
  onSave?: () => void
  isSaving?: boolean
  teamName?: string
  isTeamFlowchart?: boolean
  activeMembers?: ActiveMember[]
}

export function AuthNavHead({
  showFlowchartEditor = false,
  flowchartName = '',
  onFlowchartNameChange,
  onBack,
  onSave,
  isSaving = false,
  teamName = '',
  isTeamFlowchart = false,
  activeMembers = [],
}: AuthNavHeadProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-17 items-center justify-between px-6 gap-4">
        <div className="flex items-center gap-4 flex-1">
          {showFlowchartEditor ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="shrink-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Flowchart name and team name */}
              <div className="flex flex-col">
                <div className="text-xl font-bold truncate">
                  {flowchartName}
                </div>
                {isTeamFlowchart && (
                  <div className="text-sm text-muted-foreground truncate">
                    {teamName || 'Team Flowchart'}
                  </div>
                )}
              </div>

              {/* Team badge and active members - show if it's a team flowchart */}
              {isTeamFlowchart && (
                <div className="flex items-center gap-3 ml-auto">
                  {/* Team info badge */}
                  <Badge variant="secondary" className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {teamName || 'Team Flowchart'}
                  </Badge>

                  {/* Active members */}
                  {activeMembers.length > 0 && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/50 border border-accent">
                      <div className="flex items-center gap-1">
                        {activeMembers.slice(0, 3).map((member) => (
                          <div
                            key={member.userId}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border border-background"
                            style={{ backgroundColor: member.color }}
                            title={member.username}
                          >
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {activeMembers.length > 3 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            +{activeMembers.length - 3}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {activeMembers.length} editing
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
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
          )}
        </div>

        <div className="flex items-center gap-4">
          {showFlowchartEditor && (
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          )}

          <AnimatedThemeToggler suppressHydrationWarning />

          <Button variant="ghost" size="icon" suppressHydrationWarning>
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}