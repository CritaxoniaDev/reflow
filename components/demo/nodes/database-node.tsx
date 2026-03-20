'use client'

import { Handle, Position } from 'reactflow'
import { Database } from 'lucide-react'
import { useState, useEffect } from 'react'

export function DatabaseNode({ data, selected }: any) {
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
      className={`flex flex-col items-center justify-center shadow-md border-2 border-t-2 transition-all cursor-pointer relative ${data.isHighlighted
        ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-105'
        : selected
          ? 'border-primary ring-2 ring-primary/50'
          : 'border-indigo-500 text-indigo-700 dark:text-indigo-300'
        }`}
      style={{
        width: '120px',
        height: '90px',
      }}
    >
      <Handle type="target" position={Position.Top} />

      {/* Top ellipse */}
      <div className="w-full h-6 border-2 border-current rounded-t-full flex items-center justify-center relative -mb-2">
        <Database className="size-4" />
      </div>

      {/* Middle section */}
      <div className="w-full flex-1 border-l-2 border-r-2 border-current flex items-center justify-center text-xs text-center px-2 font-medium">
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-600 rounded px-1 py-0.5 outline-none text-indigo-700 dark:text-indigo-300 text-xs font-medium w-20"
          />
        ) : (
          <span>{label}</span>
        )}
      </div>

      {/* Bottom ellipse */}
      <div className="w-full h-5 border-2 border-current rounded-b-full" />

      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}