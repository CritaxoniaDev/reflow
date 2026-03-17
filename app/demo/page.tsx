'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ReactFlowProvider } from 'reactflow'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui'
import { DemoFlowChart } from '@/components/demo/demo-flowchart'
import { TutorialSidebar } from '@/components/demo/tutorial-sidebar'
import { Toolbox } from '@/components/demo/toolbox'

export default function DemoPage() {
  const router = useRouter()
  const [tutorialStep, setTutorialStep] = useState(0)
  const [nodeCount, setNodeCount] = useState(0)
  const [edgeCount, setEdgeCount] = useState(0)

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen bg-background overflow-hidden">
        {/* Tutorial Sidebar */}
        <TutorialSidebar 
          currentStep={tutorialStep} 
          setCurrentStep={setTutorialStep}
          nodeCount={nodeCount}
          edgeCount={edgeCount}
        />

        {/* Flowchart Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-muted/50 border-b border-border px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create Your First Flowchart</h1>
              <p className="text-sm text-muted-foreground mt-1">Drag nodes from the toolbox and connect them</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/')}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
          
          <DemoFlowChart 
            tutorialStep={tutorialStep}
            onNodeAdded={() => setNodeCount(prev => prev + 1)}
            onConnectionMade={() => setEdgeCount(prev => prev + 1)}
          />

          {/* macOS Dock Toolbox */}
          <Toolbox />
        </div>
      </div>
    </ReactFlowProvider>
  )
}