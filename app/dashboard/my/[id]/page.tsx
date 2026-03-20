'use client'

import React, { useState, useCallback, useRef } from 'react'
import { ChevronLeft, Save } from 'lucide-react'
import ReactFlow, {
    Node,
    Edge,
    addEdge,
    useNodesState,
    useEdgesState,
    Connection,
    Background,
    Controls,
    useReactFlow,
    ReactFlowProvider,
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { AuthNavHead } from '@/components/common/auth-nav-head'
import { SidebarInset } from '@/packages/shadcn-v1/sidebar'
import { useRouter, useParams } from 'next/navigation'
import { useGetFlowchart, useUpdateFlowchart } from '../../_ts/flowcharts'
import type { Flowchart } from '@supabase/database/types'
import { Toolbox } from '@/components/demo/toolbox'
import { ProcessNode } from '@/components/demo/nodes/process-node'
import { StartEndNode } from '@/components/demo/nodes/start-end-node'
import { DecisionNode } from '@/components/demo/nodes/decision-node'
import { IONode } from '@/components/demo/nodes/io-node'
import { PredefinedProcessNode } from '@/components/demo/nodes/predefined-process-node'
import { DocumentNode } from '@/components/demo/nodes/document-node'
import { DatabaseNode } from '@/components/demo/nodes/database-node'

// Animated edge component
function SineEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
}: any) {
    const centerX = (targetX - sourceX) / 2 + sourceX
    const centerY = (targetY - sourceY) / 2 + sourceY

    const edgePath = `
  M ${sourceX} ${sourceY} 
  Q ${(targetX - sourceX) * 0.2 + sourceX} ${targetY * 1.1} ${centerX} ${centerY}
  Q ${(targetX - sourceX) * 0.8 + sourceX} ${sourceY * 0.9} ${targetX} ${targetY}
  `

    return (
        <>
            <style>{`
        @keyframes animateEdge {
          to {
            stroke-dashoffset: -10;
          }
        }
        #${id} {
          stroke-dasharray: 5, 5;
          animation: animateEdge 0.7s linear infinite;
        }
      `}</style>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{
                    stroke: '#94a3b8',
                    strokeWidth: 2,
                }}
            />
        </>
    )
}

// Animated smooth edge component
function AnimatedEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
}: any) {
    const [edgePath] = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

    return (
        <>
            <style>{`
        @keyframes animateEdge {
          to {
            stroke-dashoffset: -10;
          }
        }
        #${id} {
          stroke-dasharray: 5, 5;
          animation: animateEdge 0.7s linear infinite;
        }
      `}</style>
            <BaseEdge
                id={id}
                path={edgePath}
                style={{
                    stroke: '#94a3b8',
                    strokeWidth: 2,
                }}
            />
        </>
    )
}

const nodeTypes = {
    process: ProcessNode,
    startEnd: StartEndNode,
    decision: DecisionNode,
    io: IONode,
    predefinedProcess: PredefinedProcessNode,
    document: DocumentNode,
    database: DatabaseNode,
}

const edgeTypes = {
    animated: AnimatedEdge,
    sine: SineEdge,
}

function FlowchartEditor() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const reactFlowInstance = useReactFlow()
    const reactFlowWrapper = useRef(null)

    const [name, setName] = useState('')
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const { data: flowchart, isLoading } = useGetFlowchart(id) as { data: Flowchart | undefined; isLoading: boolean }
    const updateMutation = useUpdateFlowchart()

    React.useEffect(() => {
        if (flowchart) {
            setName(flowchart.name)
            if (flowchart.content?.nodes) {
                // Add onLabelChange to all loaded nodes
                const nodesWithCallbacks = flowchart.content.nodes.map((node: Node) => ({
                    ...node,
                    data: {
                        ...node.data,
                        isEditing: false,  // ← ADD THIS
                        onLabelChange: (nodeId: string, newLabel: string) => {
                            setNodes((nds) =>
                                nds.map((n) =>
                                    n.id === nodeId
                                        ? { ...n, data: { ...n.data, label: newLabel, isEditing: false } }
                                        : n
                                )
                            )
                        },
                    },
                }))
                setNodes(nodesWithCallbacks)
            }
            if (flowchart.content?.edges) {
                setEdges(flowchart.content.edges)
            }
        }
    }, [flowchart, setNodes, setEdges])

    const onConnect = useCallback(
        (connection: Connection) =>
            setEdges((eds) =>
                addEdge({ ...connection, type: 'animated' }, eds)
            ),
        [setEdges],
    )

    const handleSave = async () => {
        if (!name.trim()) return
        await updateMutation.mutateAsync({
            id,
            name,
            content: { nodes, edges },
        })
    }

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault()

            const reactFlowBounds = (reactFlowWrapper.current as any)?.getBoundingClientRect()
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'))

            if (typeof appData === 'undefined' || !appData) {
                return
            }

            const position = reactFlowInstance?.project({
                x: event.clientX - (reactFlowBounds?.left || 0),
                y: event.clientY - (reactFlowBounds?.top || 0),
            })

            const newNode: Node = {
                id: `node-${Date.now()}`,
                type: appData.nodeType,
                data: {
                    label: appData.label,
                    isEditing: false,  // ← ADD THIS
                    onLabelChange: (nodeId: string, newLabel: string) => {
                        setNodes((nds) =>
                            nds.map((node) =>
                                node.id === nodeId
                                    ? { ...node, data: { ...node.data, label: newLabel, isEditing: false } }
                                    : node
                            )
                        )
                    },
                },
                position: position || { x: 0, y: 0 },
            }

            setNodes((nds) => [...nds, newNode])
        },
        [reactFlowInstance, setNodes]
    )

    const handleNodeDoubleClick = useCallback(
        (event: React.MouseEvent, node: Node) => {
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === node.id ? { ...n, data: { ...n.data, isEditing: true } } : n
                )
            )
        },
        [setNodes]
    )

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (event.key === 'Delete') {
                setNodes((nds) => nds.filter((node) => !node.selected))
                setEdges((eds) => eds.filter((edge) => !edge.selected))
            }
        },
        [setNodes, setEdges]
    )

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-muted-foreground">Loading flowchart...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            <AuthNavHead
                showFlowchartEditor
                flowchartName={name}
                onFlowchartNameChange={setName}
                onBack={() => router.back()}
                onSave={handleSave}
                isSaving={updateMutation.isPending}
            />

            {/* Canvas */}
            <div
                className="flex-1 relative"
                ref={reactFlowWrapper}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onKeyDown={handleKeyDown}
                tabIndex={0}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeDoubleClick={handleNodeDoubleClick}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>
                <Toolbox />
            </div>
        </div>
    )
}

export default function FlowchartDetailPage() {
    return (
        <SidebarInset>
            <ReactFlowProvider>
                <FlowchartEditor />
            </ReactFlowProvider>
        </SidebarInset>
    )
}