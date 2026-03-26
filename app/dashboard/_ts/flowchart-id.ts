'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Node, Edge, addEdge, useNodesState, useEdgesState, Connection, useReactFlow } from 'reactflow'
import { useRouter, useParams } from 'next/navigation'
import { useGetFlowchart, useUpdateFlowchart, useBroadcastFlowchartChange } from './flowcharts'
import type { Flowchart } from '@supabase/database/types'
import { useAccountInfo } from './account'

export const CURSOR_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

export type RemoteCursor = {
    userId: string
    username: string
    x: number
    y: number
    color: string
}

export const cleanNodeForBroadcast = (node: Node) => ({
    id: node.id,
    data: {
        label: node.data.label,
        isEditing: node.data.isEditing || false,
        // Preserve isStart for StartEnd nodes
        isStart: node.data.isStart !== undefined ? node.data.isStart : undefined,
    },
    type: node.type,
    position: node.position,
})

export const cleanNodeDataOnly = (node: Node) => ({
    id: node.id,
    data: {
        label: node.data.label,
        isEditing: node.data.isEditing || false,
        // Preserve isStart when broadcasting label changes
        isStart: node.data.isStart !== undefined ? node.data.isStart : undefined,
    },
})

export function useFlowchartEditor() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string
    const { username: currentUsername } = useAccountInfo()
    const reactFlowInstance = useReactFlow()
    const reactFlowWrapper = useRef(null)

    const [name, setName] = useState('')
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map())
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const edgeCounterRef = useRef(0)

    const { data: flowchart, isLoading } = useGetFlowchart(id) as { data: Flowchart | undefined; isLoading: boolean }
    const updateMutation = useUpdateFlowchart()
    const cursorBroadcastTimeoutRef = useRef<number | null>(null)
    const broadcastChangeMutation = useBroadcastFlowchartChange()
    const broadcastRef = useRef(useBroadcastFlowchartChange())
    const idRef = useRef(id)
    const usernameRef = useRef(currentUsername)

    const supabaseRef = useRef<any>(null)
    const cursorChannelRef = useRef<any>(null)

    useEffect(() => {
        idRef.current = id
    }, [id])

    useEffect(() => {
        usernameRef.current = currentUsername
    }, [currentUsername])

    useEffect(() => {
        return () => {
            if (cursorBroadcastTimeoutRef.current) {
                clearTimeout(cursorBroadcastTimeoutRef.current)
            }
        }
    }, [])

    // Subscribe to realtime updates
    useEffect(() => {
        if (!id || !currentUsername) return

        console.log('[HOOK] Setting up Supabase subscriptions for flowchart:', id)

        const { createClient } = require('@supabase/supabase-js')
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )

        supabaseRef.current = supabase

        // Subscribe to flowchart live changes
        const changesChannel = supabase
            .channel(`flowchart:${id}:changes`)
            .on('broadcast', { event: 'flowchart_update' }, (payload: any) => {
                console.log('[HOOK] Received flowchart broadcast:', {
                    type: payload.payload?.type,
                    nodeId: payload.payload?.node?.id,
                    nodeLabel: payload.payload?.node?.data?.label,
                    userId: payload.payload?.userId,
                    currentUsername,
                })
                const { userId, type, node, edge, nodes: updatedNodes, edges: updatedEdges } = payload.payload

                // Don't apply changes from current user
                if (userId === currentUsername) {
                    console.log('[HOOK] Filtering out self-update')
                    return
                }

                console.log('[HOOK] Applying remote change - type:', type)

                if (type === 'node_move' && node) {
                    console.log('[HOOK] Updating node position')
                    setNodes((nds) =>
                        nds.map((n) =>
                            n.id === node.id ? { ...n, position: node.position } : n
                        )
                    )
                } else if (type === 'node_add' && node) {
                    console.log('[HOOK] Adding remote node:', node.id)
                    setNodes((nds) => [...nds, node])
                } else if (type === 'node_remove' && node) {
                    console.log('[HOOK] Removing remote node:', node.id)
                    setNodes((nds) => nds.filter((n) => n.id !== node.id))
                } else if (type === 'edge_add' && edge) {
                    console.log('[HOOK] Adding remote edge:', edge.id)
                    setEdges((eds) => [...eds, edge])
                } else if (type === 'edge_remove' && edge) {
                    console.log('[HOOK] Removing remote edge:', edge.id)
                    setEdges((eds) => eds.filter((e) => e.id !== edge.id))
                } else if (type === 'node_update' && node) {
                    console.log('[HOOK] Updating remote node label:', {
                        nodeId: node.id,
                        newLabel: node.data.label,
                    })
                    setNodes((nds) => {
                        const updated = nds.map((n) => {
                            if (n.id === node.id) {
                                console.log('[HOOK] Merged node data:', {
                                    id: n.id,
                                    oldLabel: n.data.label,
                                    newLabel: node.data.label,
                                })
                                return {
                                    ...n,
                                    data: { ...n.data, ...node.data }
                                }
                            }
                            return n
                        })
                        return updated
                    })
                }
            })
            .subscribe((status: string) => {
                console.log('[HOOK] Changes channel subscription status:', status)
            })

        // Subscribe to cursor movements
        const cursorChannel = supabase
            .channel(`flowchart:${id}:cursors`)
            .on('broadcast', { event: 'cursor_move' }, (payload: any) => {
                const { userId, username, x, y, color } = payload.payload
                setRemoteCursors((prev) => {
                    const updated = new Map(prev)
                    updated.set(userId, { userId, username, x, y, color })
                    return updated
                })
            })
            .subscribe((status: string) => {
                console.log('[HOOK] Cursor channel subscription status:', status)
            })

        cursorChannelRef.current = cursorChannel

        return () => {
            console.log('[HOOK] Cleaning up subscriptions')
            supabase.removeChannel(changesChannel)
            supabase.removeChannel(cursorChannel)
        }
    }, [id, currentUsername])

    // Load flowchart
    useEffect(() => {
        if (flowchart) {
            console.log('[HOOK] Flowchart loaded:', { id: flowchart.id, nodeCount: flowchart.content?.nodes?.length })
            setName(flowchart.name)
            if (flowchart.content?.nodes) {
                const nodesWithCallbacks = flowchart.content.nodes.map((node: Node) => {
                    console.log('[HOOK] Adding onLabelChange callback to node:', node.id)
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            isEditing: false,
                            // Preserve isStart for StartEnd nodes
                            isStart: node.data.isStart,
                            onLabelChange: (nodeId: string, newLabel: string) => {
                                console.log('[HOOK] onLabelChange CALLED:', { nodeId, newLabel })
                                setNodes((nds) => {
                                    const updated = nds.map((n) =>
                                        n.id === nodeId
                                            ? {
                                                ...n,
                                                data: {
                                                    ...n.data,
                                                    label: newLabel,
                                                    isEditing: false,
                                                    // Preserve isStart
                                                    isStart: n.data.isStart,
                                                }
                                            }
                                            : n
                                    )

                                    const updatedNode = updated.find(n => n.id === nodeId)
                                    if (updatedNode) {
                                        console.log('[HOOK] Broadcasting label change:', {
                                            nodeId,
                                            newLabel,
                                            node: updatedNode,
                                        })
                                        broadcastRef.current.mutate({
                                            flowchartId: idRef.current,
                                            type: 'node_update',
                                            node: cleanNodeDataOnly(updatedNode),
                                            username: usernameRef.current,
                                        })
                                    }

                                    return updated
                                })
                            },
                        },
                    }
                })
                setNodes(nodesWithCallbacks)
            }
            if (flowchart.content?.edges) {
                setEdges(flowchart.content.edges)
            }
        }
    }, [flowchart, setNodes, setEdges])

    const onConnect = useCallback(
        (connection: Connection) => {
            const edgeId = `edge-${id}-${++edgeCounterRef.current}`
            const newEdge = { ...connection, id: edgeId, type: 'animated' }
            setEdges((eds) => addEdge(newEdge, eds))

            broadcastChangeMutation.mutate({
                flowchartId: id,
                type: 'edge_add',
                edge: newEdge,
                username: currentUsername,
            })
        },
        [setEdges, id, broadcastChangeMutation, currentUsername],
    )

    const handleSave = async () => {
        if (!name.trim()) return

        const cleanNodes = nodes.map(node => ({
            ...node,
            data: {
                ...node.data,
                onLabelChange: undefined,
            },
        })).map(({ data, ...rest }) => ({
            ...rest,
            data: Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== undefined)
            ),
        }))

        console.log('[HOOK] Saving flowchart with nodes:', cleanNodes.length, 'edges:', edges.length)

        try {
            await updateMutation.mutateAsync({
                id,
                name,
                content: { nodes: cleanNodes, edges },
            })
            console.log('[HOOK] Save successful!')
        } catch (error) {
            console.error('[HOOK] Save failed:', error)
        }
    }

    const handleNodesChange = useCallback((changes: any) => {
        onNodesChange(changes)

        changes.forEach((change: any) => {
            if (change.type === 'position' && change.position) {
                console.log('[HOOK] Broadcasting node move:', { nodeId: change.id, position: change.position })
                broadcastChangeMutation.mutate({
                    flowchartId: id,
                    type: 'node_move',
                    node: { id: change.id, position: change.position },
                    username: currentUsername,
                })
            }
        })
    }, [onNodesChange, id, broadcastChangeMutation, currentUsername])

    const handleEdgesChange = useCallback((changes: any) => {
        onEdgesChange(changes)
    }, [onEdgesChange])

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

            // Determine if this is a start node
            // For startEnd nodes, default to true (green/start node)
            let isStart = undefined
            if (appData.nodeType === 'startEnd') {
                isStart = appData.isStart === false ? false : true // Default to true
            }

            const newNode: Node = {
                id: `node-${Date.now()}`,
                type: appData.nodeType,
                data: {
                    label: appData.label,
                    isEditing: false,
                    // Set isStart for startEnd nodes (always true for new nodes)
                    isStart: isStart,
                    onLabelChange: (nodeId: string, newLabel: string) => {
                        console.log('[HOOK] onLabelChange CALLED (from new node):', { nodeId, newLabel })
                        setNodes((nds) => {
                            const updated = nds.map((node) =>
                                node.id === nodeId
                                    ? {
                                        ...node,
                                        data: {
                                            ...node.data,
                                            label: newLabel,
                                            isEditing: false,
                                            // Preserve isStart when updating label
                                            isStart: node.data.isStart,
                                        }
                                    }
                                    : node
                            )

                            const updatedNode = updated.find(n => n.id === nodeId)
                            if (updatedNode) {
                                console.log('[HOOK] Broadcasting label change (from new node):', {
                                    nodeId,
                                    newLabel,
                                })
                                broadcastRef.current.mutate({
                                    flowchartId: idRef.current,
                                    type: 'node_update',
                                    node: cleanNodeDataOnly(updatedNode),
                                    username: usernameRef.current,
                                })
                            }

                            return updated
                        })
                    },
                },
                position: position || { x: 0, y: 0 },
            }

            console.log('[HOOK] New node created:', {
                nodeId: newNode.id,
                nodeType: newNode.type,
                isStart: newNode.data.isStart
            })

            setNodes((nds) => [...nds, newNode])

            broadcastRef.current.mutate({
                flowchartId: idRef.current,
                type: 'node_add',
                node: cleanNodeForBroadcast(newNode),
                username: usernameRef.current,
            })
        },
        [reactFlowInstance, setNodes]
    )

    const handleNodeDoubleClick = useCallback(
        (event: React.MouseEvent, node: Node) => {
            console.log('[HOOK] Node double clicked:', node.id)
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
                const nodesToDelete = nodes.filter((n) => n.selected)
                const edgesToDelete = edges.filter((e) => e.selected)

                setNodes((nds) => nds.filter((node) => !node.selected))
                setEdges((eds) => eds.filter((edge) => !edge.selected))

                nodesToDelete.forEach((node) => {
                    broadcastChangeMutation.mutate({
                        flowchartId: id,
                        type: 'node_remove',
                        node,
                        username: currentUsername,
                    })
                })
                edgesToDelete.forEach((edge) => {
                    broadcastChangeMutation.mutate({
                        flowchartId: id,
                        type: 'edge_remove',
                        edge,
                        username: currentUsername,
                    })
                })
            }
        },
        [setNodes, setEdges, nodes, edges, id, broadcastChangeMutation, currentUsername]
    )

    const handleMouseMove = useCallback(
        (event: React.MouseEvent) => {
            const rect = (reactFlowWrapper.current as any)?.getBoundingClientRect()
            if (rect) {
                const x = event.clientX - rect.left
                const y = event.clientY - rect.top
                setMousePosition({ x, y })

                if (cursorBroadcastTimeoutRef.current) {
                    clearTimeout(cursorBroadcastTimeoutRef.current)
                }

                cursorBroadcastTimeoutRef.current = window.setTimeout(async () => {
                    try {
                        if (cursorChannelRef.current) {
                            await cursorChannelRef.current.send('broadcast', {
                                event: 'cursor_move',
                                payload: {
                                    userId: currentUsername,
                                    username: currentUsername,
                                    x,
                                    y,
                                    color: CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)],
                                },
                            })
                        }
                    } catch (err) {
                        // Silently fail
                    }
                }, 25)
            }
        },
        [currentUsername]
    )

    return {
        id,
        name,
        setName,
        nodes,
        setNodes,
        edges,
        setEdges,
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
        // Team info - use generic fallback if team_id exists
        // @ts-expect-error
        teamName: flowchart?.team_name || (flowchart?.team_id ? 'Team Flowchart' : ''),
        isTeamFlowchart: !!flowchart?.team_id,
    }
}