'use client'

import React from 'react'
import { ChevronLeft, Save } from 'lucide-react'
import ReactFlow, {
    Node,
    Edge,
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
import { Cursor, CursorPointer, CursorBody, CursorName } from '@/components/kibo-ui/cursor'
import { useRouter } from 'next/navigation'
import { useFlowchartEditor, CURSOR_COLORS } from '../../_ts/flowchart-id'
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
    const {
        id,
        name,
        setName,
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        remoteCursors,
        mousePosition,
        isLoading,
        reactFlowWrapper,
        updateMutation,
        onConnect,
        handleSave,
        handleNodesChange,
        handleEdgesChange,
        onDragOver,
        onDrop,
        handleNodeDoubleClick,
        handleKeyDown,
        handleMouseMove,
        teamName,              
        isTeamFlowchart,      
    } = useFlowchartEditor()

    // Convert remoteCursors to activeMembers format
    const activeMembers = Array.from(remoteCursors.values()).map((cursor) => ({
        userId: cursor.userId,
        username: cursor.username,
        color: cursor.color,
    }))

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Loading flowchart...</div>
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
                teamName={teamName}
                isTeamFlowchart={isTeamFlowchart}
                activeMembers={activeMembers}
            />

            {/* Canvas */}
            <div
                className="flex-1 relative"
                ref={reactFlowWrapper}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onKeyDown={handleKeyDown}
                onMouseMove={handleMouseMove}
                tabIndex={0}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onNodeDoubleClick={handleNodeDoubleClick}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>

                {/* Remote cursors */}
                {Array.from(remoteCursors.values()).map((cursor) => (
                    // @ts-expect-error
                    <Cursor key={cursor.userId} x={cursor.x} y={cursor.y} color={cursor.color}>
                        <CursorPointer />
                        <CursorBody />
                        <CursorName>{cursor.username}</CursorName>
                    </Cursor>
                ))}

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