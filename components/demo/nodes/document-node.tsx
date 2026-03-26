'use client'

import { Handle, Position } from 'reactflow'
import { FileStack } from 'lucide-react'
import { useState, useEffect } from 'react'

export function DocumentNode({ id, data, selected }: any) {
  const [label, setLabel] = useState(data.label)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setLabel(data.label)
  }, [data.label])

  useEffect(() => {
    setIsEditing(data.isEditing ?? false)
  }, [data.isEditing])

  const handleBlur = () => {
    console.log('[NODE] DocumentNode handleBlur:', { id, label, oldLabel: data.label })
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
          console.log('[NODE] DocumentNode double clicked:', id)
          setIsEditing(true)
        }}
        className={`px-4 py-3 rounded-lg shadow-md border-2 transition-all text-sm font-medium flex items-center gap-2 ${data.isHighlighted
            ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-105'
            : selected
              ? 'border-primary ring-2 ring-primary/50'
              : 'border-indigo-600 text-indigo-700 dark:text-indigo-300'
          }`}
        style={{
          borderBottom: '4px wavy currentColor',
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
            className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-600 rounded px-2 py-1 outline-none text-indigo-700 dark:text-indigo-300 text-sm font-medium w-28"
          />
        ) : (
          <>
            <FileStack className="size-4" />
            <span>{label}</span>
          </>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </>
  )
}