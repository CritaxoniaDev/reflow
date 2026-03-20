'use client'

import {
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  Zap,
  Workflow,
} from 'lucide-react'
import {
  SidebarInset,
  SidebarTrigger,
} from '@/packages/shadcn-v1/sidebar'
import { Button, Input, Kbd } from '@/components/ui'

export default function DashboardPage() {
  const recentFlowcharts = [
    {
      id: 1,
      title: 'User Onboarding Flow',
      updated: '2 hours ago',
      collaborators: 3,
    },
    {
      id: 2,
      title: 'Payment Processing',
      updated: '1 day ago',
      collaborators: 2,
    },
    {
      id: 3,
      title: 'Customer Support Flow',
      updated: '3 days ago',
      collaborators: 5,
    },
  ]

  const stats = [
    {
      title: 'Total Flowcharts',
      value: '12',
      icon: Workflow,
      color: 'bg-blue-500/10',
      textColor: 'text-blue-600',
    },
    {
      title: 'Team Members',
      value: '8',
      icon: Zap,
      color: 'bg-purple-500/10',
      textColor: 'text-purple-600',
    },
    {
      title: 'Total Collaborators',
      value: '24',
      icon: Zap,
      color: 'bg-amber-500/10',
      textColor: 'text-amber-600',
    },
  ]

  return (
    <SidebarInset>
      {/* Main Content */}
      <div className="flex-1 space-y-8 p-6 md:p-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight" style={{ fontFamily: '"Aloja Extended", sans-serif' }}>Welcome back!</h2>
          <p className="text-muted-foreground">
            Create, collaborate, and share flowcharts with your team in real-time.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-lg border border-border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Flowcharts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Flowcharts</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentFlowcharts.map((flowchart) => (
              <div
                key={flowchart.id}
                className="group rounded-lg border border-border bg-card p-6 hover:shadow-md transition-all hover:border-blue-500/50 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <Workflow className="h-8 w-8 text-blue-600" />
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <h4 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {flowchart.title}
                </h4>

                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Updated {flowchart.updated}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex -space-x-2">
                      {[...Array(flowchart.collaborators)].map((_, i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white border-2 border-background"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {flowchart.collaborators} collaborators
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h3 className="text-lg font-bold">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Plus, label: 'Create New', color: 'bg-blue-500/10' },
              { icon: Workflow, label: 'Browse Templates', color: 'bg-purple-500/10' },
              { icon: Zap, label: 'Invite Team', color: 'bg-amber-500/10' },
              { icon: Bell, label: 'Settings', color: 'bg-emerald-500/10' },
            ].map((action) => (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto flex-col gap-2 py-4"
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}