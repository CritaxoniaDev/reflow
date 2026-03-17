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
  NodeTypes,
  MarkerType,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ProcessNode } from '@/components/demo/nodes/process-node'
import { DecisionNode } from '@/components/demo/nodes/decision-node'
import { StartEndNode } from '@/components/demo/nodes/start-end-node'
import { IONode } from '@/components/demo/nodes/io-node'
import { DatabaseNode } from '@/components/demo/nodes/database-node'

const nodeTypes: NodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  startEnd: StartEndNode,
  io: IONode,
  database: DatabaseNode,
}

const initialNodes: Node[] = [
  {
    id: '1',
    data: { label: 'Start' },
    position: { x: 300, y: 20 },
    type: 'startEnd',
  },
  {
    id: '2',
    data: { label: 'Receive Input' },
    position: { x: 280, y: 100 },
    type: 'io',
  },
  {
    id: '3',
    data: { label: 'Validate Data' },
    position: { x: 290, y: 200 },
    type: 'process',
  },
  {
    id: '4',
    data: { label: 'Valid?' },
    position: { x: 310, y: 330 },
    type: 'decision',
  },
  {
    id: '5',
    data: { label: 'Save to DB' },
    position: { x: 480, y: 360 },
    type: 'process',
  },
  {
    id: '6',
    data: { label: 'Database' },
    position: { x: 480, y: 500 },
    type: 'database',
  },
  {
    id: '7',
    data: { label: 'Return Error' },
    position: { x: 100, y: 360 },
    type: 'io',
  },
  {
    id: '8',
    data: { label: 'Return Success' },
    position: { x: 480, y: 620 },
    type: 'io',
  },
  {
    id: '9',
    data: { label: 'End' },
    position: { x: 300, y: 720 },
    type: 'startEnd',
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e2-3', source: '2', target: '3', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e3-4', source: '3', target: '4', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-5', source: '4', target: '5', label: 'Yes', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e5-6', source: '5', target: '6', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e6-8', source: '6', target: '8', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e4-7', source: '4', target: '7', label: 'No', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e7-9', source: '7', target: '9', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e8-9', source: '8', target: '9', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
]

function FlowContent() {
  const { fitView } = useReactFlow()

  useEffect(() => {
    fitView({ padding: 0.2 })
  }, [fitView])

  return null
}

function FlowDemoContent() {
  const [nodes] = useNodesState(initialNodes)
  const [edges] = useEdgesState(initialEdges)

  return (
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
      <FlowContent />
      <Background color="#aaa" gap={16} />
      <Controls />
    </ReactFlow>
  )
}

export function FlowDemo() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="h-100 w-full rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
      <ReactFlowProvider>
        <FlowDemoContent />
      </ReactFlowProvider>
    </div>
  )
}