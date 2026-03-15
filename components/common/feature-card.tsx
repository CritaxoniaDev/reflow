import { LucideIcon } from 'lucide-react'
import { Card } from '@shadcn/card'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
      <Icon className="mb-4 h-8 w-8 text-zinc-900 dark:text-white" />
      <h4 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h4>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </Card>
  )
}