'use client'

import { useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Start' },
    position: { x: 220, y: 0 },
    style: {
      background: '#f3f4f6',
      border: '2px solid #3b82f6',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#111827',
    },
  },
  {
    id: '2',
    data: { label: 'Process Data' },
    position: { x: 220, y: 100 },
    style: {
      background: '#dbeafe',
      border: '2px solid #0ea5e9',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#111827',
    },
  },
  {
    id: '3',
    data: { label: 'Decision' },
    position: { x: 220, y: 200 },
    style: {
      background: '#fef3c7',
      border: '2px solid #f59e0b',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#111827',
    },
  },
  {
    id: '4',
    data: { label: 'End' },
    position: { x: 220, y: 300 },
    style: {
      background: '#dcfce7',
      border: '2px solid #22c55e',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#111827',
    },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#0ea5e9', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
]

function FlowContent() {
  const { fitView } = useReactFlow()

  useEffect(() => {
    fitView({ padding: 0.2 })
  }, [fitView])

  return null
}

export function FlowDemo() {
  const [nodes] = useNodesState(initialNodes)
  const [edges] = useEdgesState(initialEdges)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="h-80 w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <ReactFlow nodes={nodes} edges={edges}>
        <FlowContent />
        <Background color="#aaa" gap={10} />
        <Controls />
      </ReactFlow>
    </div>
  )
}