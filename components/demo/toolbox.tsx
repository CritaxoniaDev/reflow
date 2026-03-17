'use client'

import React from 'react'
import { Box, GitBranch, Circle, Database, Code2, FileText, HardDrive } from 'lucide-react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui'

export function Toolbox() {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    const appData = { nodeType, label }
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData))
  }

  const nodeTypes = [
    { type: 'startEnd', label: 'Start', icon: Circle, color: 'bg-green-500', description: 'Start Node' },
    { type: 'startEnd', label: 'End', icon: Circle, color: 'bg-red-500', description: 'End Node' },
    { type: 'process', label: 'Process', icon: Box, color: 'bg-blue-500', description: 'Process Step' },
    { type: 'decision', label: 'Decision', icon: GitBranch, color: 'bg-amber-500', description: 'Decision' },
    { type: 'io', label: 'Input/Output', icon: Database, color: 'bg-purple-500', description: 'Input/Output' },
    { type: 'predefinedProcess', label: 'Function', icon: Code2, color: 'bg-cyan-500', description: 'Predefined Process' },
    { type: 'document', label: 'Document', icon: FileText, color: 'bg-orange-500', description: 'Document' },
    { type: 'database', label: 'Database', icon: HardDrive, color: 'bg-indigo-500', description: 'Database' },
  ]

  return (
    <TooltipProvider>
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        {/* Dock Container */}
        <div className="bg-black/40 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
          <div className="flex items-end justify-center gap-2">
            {nodeTypes.map((node, index) => {
              const Icon = node.icon

              return (
                <Tooltip key={`${node.type}-${node.label}-${index}`}>
                  <TooltipTrigger>
                    <div
                      draggable
                      onDragStart={(e) => onDragStart(e, node.type, node.label)}
                      className="cursor-grab active:cursor-grabbing transition-all hover:scale-110"
                      style={{
                        transformOrigin: 'bottom center',
                      }}
                    >
                      {/* Icon Button */}
                      <div className={`${node.color} p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200`}>
                        <Icon className="size-6 text-white" />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {node.description}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>

          {/* Dock Label */}
          <div className="text-center mt-2 text-xs text-white font-medium">
            Drag to canvas • Double-click to edit • Delete key to remove
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}