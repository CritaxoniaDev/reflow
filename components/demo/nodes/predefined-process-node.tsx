'use client'

import { Handle, Position } from 'reactflow'
import { Code2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export function PredefinedProcessNode({ data, selected }: any) {
  const [label, setLabel] = useState(data.label)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setLabel(data.label)
  }, [data.label])

  useEffect(() => {
    if (data.isEditing) {
      setIsEditing(true)
    }
  }, [data.isEditing])

  const handleBlur = () => {
    if (label.trim()) {
      data.onLabelChange(data.id || 'unknown', label)
    } else {
      setLabel(data.label)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      setLabel(data.label)
      setIsEditing(false)
    }
  }

  return (
    <>
      <Handle type="target" position={Position.Top} />
      
      <div
        className={`px-4 py-3 rounded-lg shadow-md border-2 transition-all text-sm font-medium flex items-center gap-2 min-w-max relative ${
          data.isHighlighted
            ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-105'
            : selected
            ? 'border-primary ring-2 ring-primary/50'
            : 'border-cyan-500 text-cyan-700 dark:text-cyan-300'
        }`}
      >
        {/* Double vertical lines on left */}
        <div className="absolute left-0.5 top-0 bottom-0 flex flex-col justify-center gap-0.5">
          <div className="w-px h-1.5 bg-current opacity-50" />
          <div className="w-px h-1.5 bg-current opacity-50" />
        </div>
        
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-600 rounded px-2 py-1 outline-none text-cyan-700 dark:text-cyan-300 text-sm font-medium w-32"
          />
        ) : (
          <>
            <Code2 className="size-4" />
            <span>{label}</span>
          </>
        )}
        
        {/* Double vertical lines on right */}
        <div className="absolute right-0.5 top-0 bottom-0 flex flex-col justify-center gap-0.5">
          <div className="w-px h-1.5 bg-current opacity-50" />
          <div className="w-px h-1.5 bg-current opacity-50" />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </>
  )
}