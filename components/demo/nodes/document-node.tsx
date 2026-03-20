'use client'

import { Handle, Position } from 'reactflow'
import { FileText } from 'lucide-react'
import { useState, useEffect } from 'react'

export function DocumentNode({ data, selected }: any) {
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
    <div
      onDoubleClick={() => setIsEditing(true)}
      className={`px-4 py-3 rounded-t-lg shadow-md border-2 border-b-0 transition-all text-sm font-medium flex items-center gap-2 min-w-max relative ${data.isHighlighted
        ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-105'
        : selected
          ? 'border-primary ring-2 ring-primary/50'
          : 'border-orange-500 text-orange-700 dark:text-orange-300'
        }`}
    >
      <Handle type="target" position={Position.Top} />

      {isEditing ? (
        <input
          autoFocus
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={(e) => e.stopPropagation()}
          className="bg-orange-50 dark:bg-orange-900/30 border border-orange-600 rounded px-2 py-1 outline-none text-orange-700 dark:text-orange-300 text-sm font-medium w-32"
        />
      ) : (
        <>
          <FileText className="size-4" />
          <span>{label}</span>
        </>
      )}

      {/* Wavy bottom */}
      <svg
        className="absolute -bottom-1.5 left-0 right-0 w-full"
        height="8"
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        style={{ stroke: 'currentColor', strokeWidth: 2, fill: 'none' }}
      >
        <path d="M 0 4 Q 10 0 20 4 T 40 4 T 60 4 T 80 4 T 100 4" />
      </svg>
      <div className="absolute -bottom-2 left-0 right-0 h-2" />

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}