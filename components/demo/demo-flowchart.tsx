'use client'

import React, { useCallback, useRef, useEffect, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  Panel,
  MarkerType,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ProcessNode } from './nodes/process-node'
import { DecisionNode } from './nodes/decision-node'
import { StartEndNode } from './nodes/start-end-node'
import { IONode } from './nodes/io-node'
import { PredefinedProcessNode } from './nodes/predefined-process-node'
import { DocumentNode } from './nodes/document-node'
import { DatabaseNode } from './nodes/database-node'

const nodeTypes: NodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  startEnd: StartEndNode,
  io: IONode,
  predefinedProcess: PredefinedProcessNode,
  document: DocumentNode,
  database: DatabaseNode,
}

interface DemoFlowChartProps {
  tutorialStep: number
  onNodeAdded: () => void
  onConnectionMade: () => void
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export function DemoFlowChart({ tutorialStep, onNodeAdded, onConnectionMade }: DemoFlowChartProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [nodeCount, setNodeCount] = useState(0)
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null)
  const lastClickRef = useRef<{ id: string; time: number } | null>(null)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { project } = useReactFlow()

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        markerEnd: { type: MarkerType.ArrowClosed },
      }
      setEdges((eds) => addEdge(newEdge, eds))
      onConnectionMade()
    },
    [setEdges, onConnectionMade]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'))

      const position = project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      const newNode: Node = {
        id: `node-${nodeCount + 1}`,
        data: {
          label: appData.label,
          isStart: appData.label === 'Start'
        },
        position,
        type: appData.nodeType,
        style: getNodeStyle(appData.nodeType),
      }

      setNodes((nds) => [...nds, newNode])
      setNodeCount((count) => count + 1)
      onNodeAdded()
    },
    [nodeCount, setNodes, project, onNodeAdded]
  )

  const handleNodeClick = (event: React.MouseEvent, nodeId: string) => {
    const now = Date.now()

    if (lastClickRef.current?.id === nodeId && now - lastClickRef.current.time < 300) {
      // Double click detected
      setEditingNodeId(nodeId)
      lastClickRef.current = null
    } else {
      lastClickRef.current = { id: nodeId, time: now }
    }
  }

  const handleLabelChange = (nodeId: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    )
    setEditingNodeId(null)
  }

  return (
    <div className="flex-1 relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: {
            ...node.data,
            id: node.id,
            isEditing: editingNodeId === node.id,
            onLabelChange: handleLabelChange,
            onEditingChange: setEditingNodeId,
          },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={(event, node) => handleNodeClick(event as React.MouseEvent, node.id)}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={['Delete', 'Backspace']}
      >
        <Background />
        <Controls />
        <MiniMap />

        {/* Helper Text */}
        {tutorialStep > 0 && tutorialStep < 5 && (
          <Panel position="top-center" className="bg-card border border-border rounded-lg shadow-lg p-4 text-center">
            <p className="text-sm font-medium text-foreground">
              👆 Drag nodes from the toolbox to the canvas
            </p>
          </Panel>
        )}

        <Panel position="top-right" className="bg-card border border-border rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-sm mb-2">Controls:</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Double-click to edit label</li>
            <li>• Delete with Delete key</li>
            <li>• Drag nodes to move</li>
            <li>• Connect via handles</li>
            <li>• Scroll to zoom</li>
          </ul>
        </Panel>
      </ReactFlow>
    </div>
  )
}

function getNodeStyle(type: string) {
  switch (type) {
    case 'startEnd':
      return { borderRadius: '50px', padding: '10px 20px' }
    case 'process':
      return { width: '150px' }
    case 'decision':
      return { width: '120px', height: '120px' }
    case 'io':
      return { width: '140px' }
    case 'predefinedProcess':
      return { width: '160px' }
    case 'document':
      return { width: '150px', paddingBottom: '20px' }
    case 'database':
      return { width: '120px', height: '90px' }
    default:
      return {}
  }
}