'use client'

import { useRouter } from 'next/navigation'
import {
  Bell,
  Plus,
  MoreHorizontal,
  Zap,
  Workflow,
  Loader2,
} from 'lucide-react'
import {
  SidebarInset,
} from '@/packages/shadcn-v1/sidebar'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
} from '@/components/ui'
import { useState, useEffect } from 'react'
import { toolsData, categoriesData, useDashboardData } from './_ts/dashboard'

// Skeleton Components
const StatsSkeleton = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardContent>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16 mt-2" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    ))}
  </>
)

const RecentFlowchartsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <div className="pt-4 border-t border-border">
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const ToolsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {[...Array(8)].map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const WelcomeSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-10 w-72" />
    <Skeleton className="h-5 w-96" />
  </div>
)

export default function DashboardPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoadingTools, setIsLoadingTools] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  // Fetch all dashboard data using custom hook
  const {
    recentFlowcharts,
    stats,
    isLoadingFlowcharts,
    currentUser,
  } = useDashboardData()

  // Simulate tools loading delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingTools(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Simulate stats loading delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingStats(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredTools = selectedCategory === 'all'
    ? toolsData
    : toolsData.filter(tool => tool.category === selectedCategory)

  const handleToolClick = (route: string) => {
    router.push(route)
  }

  // Handle open flowchart
  const handleFlowchartClick = (id: string) => {
    router.push(`/dashboard/flowcharts/${id}`)
  }

  return (
    <SidebarInset>
      <div className="flex-1 space-y-8 p-6 md:p-8">
        {/* Welcome Section */}
        {isLoadingStats ? (
          <WelcomeSkeleton />
        ) : (
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight">
              Welcome back, <span className="text-blue-600 uppercase font-mono">{currentUser?.username || 'User'}</span>!
            </h2>
            <p className="text-muted-foreground">
              Create, collaborate, and share flowcharts with your team in real-time.
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoadingStats ? (
            <StatsSkeleton />
          ) : stats && stats.length > 0 ? (
            stats.map((stat) => (
              <Card key={stat.title} className="hover:shadow-md transition-shadow">
                <CardContent>
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
                </CardContent>
              </Card>
            ))
          ) : null}
        </div>

        {/* Recent Flowcharts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent Flowcharts</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          {isLoadingFlowcharts ? (
            <RecentFlowchartsSkeleton />
          ) : recentFlowcharts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* @ts-ignore */}
              {recentFlowcharts.map((flowchart) => (
                <Card
                  key={flowchart.id}
                  className="group hover:shadow-md transition-all hover:border-blue-500/50 cursor-pointer"
                  onClick={() => handleFlowchartClick(flowchart.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Workflow className="h-8 w-8 text-blue-600" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardTitle className="text-base group-hover:text-blue-600 transition-colors">
                      {flowchart.title}
                    </CardTitle>
                    <CardDescription>
                      Updated {flowchart.updated}
                    </CardDescription>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(flowchart.collaborators, 3))].map((_, i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white border-2 border-background"
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                        {flowchart.collaborators > 3 && (
                          <div className="h-6 w-6 rounded-full bg-slate-400 flex items-center justify-center text-xs font-bold text-white border-2 border-background">
                            +{flowchart.collaborators - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {flowchart.collaborators} collaborator{flowchart.collaborators !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <Workflow className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">No flowcharts yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Create your first flowchart to get started</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Developer Tools Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Developer Tools & Libraries</h3>
            <Button variant="outline" size="sm">
              Browse All
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categoriesData.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className={`cursor-pointer px-3 py-1.5 text-xs font-medium transition-all ${selectedCategory === category.id ? 'bg-blue-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </Badge>
            ))}
          </div>

          {/* Tools Grid */}
          {isLoadingTools ? (
            <ToolsSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTools.map((tool) => (
                <Card
                  key={tool.id}
                  className="group hover:shadow-md transition-all hover:border-blue-500/50 cursor-pointer"
                  onClick={() => handleToolClick(tool.route)}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-2 rounded-lg ${tool.color}`}>
                        <tool.icon className={`h-5 w-5 ${tool.textColor}`} />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToolClick(tool.route)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {tool.name}
                      </h4>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoadingTools && filteredTools.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No tools found in this category</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: Plus, label: 'Create New', color: 'bg-blue-500/10', route: '/dashboard/create' },
                { icon: Workflow, label: 'Browse Templates', color: 'bg-purple-500/10', route: '/dashboard/templates' },
                { icon: Zap, label: 'Invite Team', color: 'bg-amber-500/10', route: '/dashboard/team' },
                { icon: Bell, label: 'Settings', color: 'bg-emerald-500/10', route: '/dashboard/settings' },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto flex-col gap-2 py-4"
                  onClick={() => router.push(action.route)}
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}