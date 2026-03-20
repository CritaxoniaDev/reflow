'use client'

import { Handle, Position } from 'reactflow'
import { FileText } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ProcessNode({ data, selected }: any) {
  const [label, setLabel] = useState(data.label)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setLabel(data.label)
  }, [data.label])

  useEffect(() => {
    setIsEditing(data.isEditing ?? false)
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
        onDoubleClick={() => setIsEditing(true)}
        className={`px-4 py-3 rounded-lg shadow-md border-2 transition-all text-sm font-medium flex items-center gap-2 ${data.isHighlighted
            ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-105'
            : selected
              ? 'border-primary ring-2 ring-primary/50'
              : 'border-blue-600 text-blue-700 dark:text-blue-300'
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
            className="bg-blue-50 dark:bg-blue-900/30 border border-blue-600 rounded px-2 py-1 outline-none text-blue-700 dark:text-blue-300 text-sm font-medium w-32"
          />
        ) : (
          <>
            <FileText className="size-4" />
            <span>{label}</span>
          </>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </>
  )
}