'use client'

import { Handle, Position } from 'reactflow'
import { Box } from 'lucide-react'
import { useState, useEffect } from 'react'

export function PredefinedProcessNode({ id, data, selected }: any) {
  const [label, setLabel] = useState(data.label)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setLabel(data.label)
  }, [data.label])

  useEffect(() => {
    setIsEditing(data.isEditing ?? false)
  }, [data.isEditing])

  const handleBlur = () => {
    console.log('[NODE] PredefinedProcessNode handleBlur:', { id, label, oldLabel: data.label })
    if (label.trim()) {
      console.log('[NODE] Calling onLabelChange:', { id, label })
      data.onLabelChange?.(id, label)
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
        onDoubleClick={() => {
          console.log('[NODE] PredefinedProcessNode double clicked:', id)
          setIsEditing(true)
        }}
        className={`px-4 py-3 rounded-md shadow-md border-2 transition-all text-sm font-medium flex items-center gap-2 ${data.isHighlighted
            ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-105'
            : selected
              ? 'border-primary ring-2 ring-primary/50'
              : 'border-orange-600 text-orange-700 dark:text-orange-300'
          }`}
        style={{
          borderTop: '4px solid currentColor',
          borderBottom: '4px solid currentColor',
        }}
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
            className="bg-orange-50 dark:bg-orange-900/30 border border-orange-600 rounded px-2 py-1 outline-none text-orange-700 dark:text-orange-300 text-sm font-medium w-28"
          />
        ) : (
          <>
            <Box className="size-4" />
            <span>{label}</span>
          </>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </>
  )
}