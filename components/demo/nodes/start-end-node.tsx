'use client'

import { Handle, Position } from 'reactflow'
import { Circle } from 'lucide-react'
import { useState, useEffect } from 'react'

export function StartEndNode({ data, selected }: any) {
  const isStart = data.isStart ?? data.label === 'Start'
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
      {!isStart && <Handle type="target" position={Position.Top} />}
      
      <div
        className={`px-6 py-3 rounded-full shadow-md border-2 transition-all font-medium text-sm flex items-center gap-2 ${
          data.isHighlighted
            ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-110'
            : selected
            ? 'border-primary ring-2 ring-primary/50'
            : isStart
            ? 'border-green-500 text-green-700 dark:text-green-300'
            : 'border-red-500 text-red-700 dark:text-red-300'
        }`}
      >
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className={`bg-transparent border-b rounded px-2 py-1 outline-none text-sm font-medium w-24 ${
              isStart
                ? 'border-green-500 text-green-700 dark:text-green-300'
                : 'border-red-500 text-red-700 dark:text-red-300'
            }`}
          />
        ) : (
          <>
            <Circle className="size-4" />
            <span>{label}</span>
          </>
        )}
      </div>

      {isStart && <Handle type="source" position={Position.Bottom} />}
    </>
  )
}