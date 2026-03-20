'use client'

import { Handle, Position } from 'reactflow'
import { GitBranch } from 'lucide-react'
import { useState, useEffect } from 'react'

export function DecisionNode({ data, selected }: any) {
  const [label, setLabel] = useState(data.label)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setLabel(data.label)
  }, [data.label])

  useEffect(() => {
    setIsEditing(data.isEditing ?? false)
  }, [data.isEditing])

  const isHighlighted = data.isHighlighted
  const borderColor = isHighlighted
    ? '#facc15'
    : selected
      ? 'var(--color-primary)'
      : '#b45309'

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
      className="relative flex items-center justify-center"
      style={{ width: '128px', height: '128px' }}>
      <svg
        width="128"
        height="128"
        viewBox="0 0 128 128"
        className={`absolute transition-all ${isHighlighted ? 'scale-105' : selected ? 'scale-100' : 'scale-100'
          }`}
        style={{
          filter: isHighlighted ? 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.5))' : 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.1))',
        }}
      >
        <path
          d="M 64 0 L 128 64 L 64 128 L 0 64 Z"
          fill="transparent"
          stroke={borderColor}
          strokeWidth="2"
        />
      </svg>

      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Left} />

      <div className="relative z-10 flex flex-col items-center gap-1">
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="bg-amber-100 dark:bg-amber-900/30 border border-amber-600 rounded px-2 py-1 outline-none text-amber-700 dark:text-amber-300 text-sm font-medium text-center w-20"
          />
        ) : (
          <>
            <GitBranch className={`size-5 ${isHighlighted
              ? 'text-yellow-400'
              : selected
                ? 'text-primary'
                : 'text-amber-700 dark:text-amber-300'
              }`} />
            <span className={`text-center text-xs ${isHighlighted
              ? 'text-yellow-400'
              : selected
                ? 'text-primary'
                : 'text-amber-700 dark:text-amber-300'
              }`}>{label}</span>
          </>
        )}
      </div>

      <Handle type="source" position={Position.Right} id="yes" />
      <Handle type="source" position={Position.Bottom} id="no" />
    </div>
  )
}