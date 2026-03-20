'use client'

import { Handle, Position } from 'reactflow'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

export function IONode({ data, selected }: any) {
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
      : '#a855f7'

  const handleBlur = () => {
    if (label.trim()) {
      data.onLabelChange(data.id, label)
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
      style={{ width: '160px', height: '80px' }}>
      <svg
        width="160"
        height="80"
        viewBox="0 0 160 80"
        className={`absolute transition-all ${isHighlighted ? 'scale-105' : selected ? 'scale-100' : 'scale-100'
          }`}
        style={{
          filter: isHighlighted ? 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.5))' : 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.1))',
        }}
      >
        <path
          d="M 30 0 L 150 0 L 130 80 L 10 80 Z"
          fill="transparent"
          stroke={borderColor}
          strokeWidth="2"
        />
      </svg>

      <Handle
        type="target"
        position={Position.Top}
        style={{ top: '-3px', left: '50%', transform: 'translateX(-50%)' }}
      />

      <div className="relative z-10 flex items-center gap-2 font-medium text-sm">
        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="bg-purple-50 dark:bg-purple-900/30 border border-purple-600 rounded px-2 py-1 outline-none text-purple-700 dark:text-purple-300 text-sm font-medium w-28"
          />
        ) : (
          <>
            <ArrowRight className={`size-4 ${isHighlighted
              ? 'text-yellow-400'
              : selected
                ? 'text-primary'
                : 'text-purple-700 dark:text-purple-300'
              }`} />
            <span className={
              isHighlighted
                ? 'text-yellow-400'
                : selected
                  ? 'text-primary'
                  : 'text-purple-700 dark:text-purple-300'
            }>
              {label}
            </span>
          </>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ bottom: '-3px', left: '50%', transform: 'translateX(-50%)' }}
      />
    </div>
  )
}