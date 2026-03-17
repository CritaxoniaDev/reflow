'use client'

import React from 'react'
import { Button } from '@/components/ui'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const tutorialSteps = [
  {
    title: 'Welcome to Reflow',
    description: 'Learn how to create collaborative flowcharts in real-time with your team members.',
  },
  {
    title: 'Start Your Process',
    description: 'Every flowchart begins with a start node. This marks the beginning of your process flow.',
  },
  {
    title: 'Add Process Steps',
    description: 'Add rectangular process nodes to represent actions or operations in your workflow.',
  },
  {
    title: 'Make Decisions',
    description: 'Use diamond-shaped nodes for decision points where the flow branches into different paths.',
  },
  {
    title: 'Invite Collaborators',
    description: 'Share your flowchart with team members using collaboration links. They\'ll see changes in real-time.',
  },
  {
    title: 'Complete!',
    description: 'You\'ve learned the basics! Start creating your own flowcharts and collaborate with your team.',
  },
]

interface TutorialSidebarProps {
  currentStep: number
  setCurrentStep: (step: number) => void
  nodeCount?: number
  edgeCount?: number
}

export function TutorialSidebar({ currentStep, setCurrentStep }: TutorialSidebarProps) {
  const step = tutorialSteps[currentStep]

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="bg-muted/50 border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">Tutorial</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Step {currentStep + 1} of {tutorialSteps.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-3">
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto">
        <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{step.description}</p>

        {/* Step-specific tips */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">In this step:</h4>
          <ul className="text-xs text-muted-foreground space-y-2">
            {currentStep === 0 && (
              <>
                <li>✓ Understand flowchart basics</li>
                <li>✓ Learn about collaboration</li>
                <li>✓ Get familiar with the interface</li>
              </>
            )}
            {currentStep === 1 && (
              <>
                <li>✓ Identify the start node (green)</li>
                <li>✓ Understand process initiation</li>
              </>
            )}
            {currentStep === 2 && (
              <>
                <li>✓ Recognize process nodes (blue)</li>
                <li>✓ Drag to move nodes around</li>
                <li>✓ These represent your actions</li>
              </>
            )}
            {currentStep === 3 && (
              <>
                <li>✓ Diamond shapes = decisions</li>
                <li>✓ Create two paths: Yes/No</li>
                <li>✓ Branch your workflow</li>
              </>
            )}
            {currentStep === 4 && (
              <>
                <li>✓ Share flowchart with team</li>
                <li>✓ Real-time collaboration</li>
                <li>✓ See changes instantly</li>
              </>
            )}
            {currentStep === 5 && (
              <>
                <li>✓ You're ready to create</li>
                <li>✓ Start from your dashboard</li>
                <li>✓ Invite your team members</li>
              </>
            )}
          </ul>
        </div>

        {/* Hotkeys info */}
        {currentStep > 0 && currentStep < 4 && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">💡 Pro Tip:</p>
            <p className="text-xs text-muted-foreground mt-1">
              {currentStep === 1 && 'Try dragging the green node around to see how the canvas works!'}
              {currentStep === 2 && 'Hover over a node and drag from the small circles (handles) to connect to other nodes.'}
              {currentStep === 3 && 'Notice the Yes/No labels on the edges coming from the decision node.'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="border-t border-border p-6 space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex-1"
          >
            <ChevronLeft className="size-4 mr-1" />
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => setCurrentStep(Math.min(tutorialSteps.length - 1, currentStep + 1))}
            disabled={currentStep === tutorialSteps.length - 1}
            className="flex-1"
          >
            Next
            <ChevronRight className="size-4 ml-1" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentStep(0)}
          className="w-full"
        >
          Restart Tutorial
        </Button>
      </div>
    </div>
  )
}