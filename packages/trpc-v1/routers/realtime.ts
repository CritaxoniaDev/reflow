import { protectedProcedure, router } from '../index'
import { realtimeService } from '@supabase/services'
import { flowchartService } from '@supabase/services'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const realtimeRouter = router({
  broadcastFlowchartChange: protectedProcedure
    .input(z.object({
      flowchartId: z.string(),
      type: z.enum(['node_add', 'node_move', 'node_update', 'edge_add', 'edge_remove', 'node_remove']),
      username: z.string(),
      node: z.any().optional(),
      edge: z.any().optional(),
      nodes: z.any().optional(),
      edges: z.any().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }

      const userId = ctx.user.id

      try {
        // Broadcast immediately (fire-and-forget)
        realtimeService.broadcastFlowchartChanges(
          input.flowchartId,
          userId,
          input.username,
          {
            type: input.type,
            node: input.node,
            edge: input.edge,
            nodes: input.nodes,
            edges: input.edges,
          }
        ).catch((err) => console.error('Broadcast failed:', err))

        // Handle synchronous operations
        if (['node_add', 'edge_add', 'edge_remove', 'node_remove', 'node_update'].includes(input.type)) {
          const currentFlowchart = await flowchartService.getFlowchartById(input.flowchartId, userId)

          // @ts-ignore - content can be string or object, we normalize it to object
          const content = typeof currentFlowchart.content === 'string'
            
            ? JSON.parse(currentFlowchart.content)
            : currentFlowchart.content

          if (input.type === 'node_add' && input.node) {
            content.nodes = content.nodes || []
            content.nodes.push(input.node)
            console.log('Added node:', { nodeId: input.node.id, label: input.node.data.label })
          } else if (input.type === 'edge_add' && input.edge) {
            content.edges = content.edges || []
            content.edges.push(input.edge)
            console.log('Added edge:', { edgeId: input.edge.id })
          } else if (input.type === 'edge_remove' && input.edge) {
            content.edges = content.edges?.filter((e: any) => e.id !== input.edge.id) || []
            console.log('Removed edge:', { edgeId: input.edge.id })
          } else if (input.type === 'node_remove' && input.node) {
            content.nodes = content.nodes?.filter((n: any) => n.id !== input.node.id) || []
            console.log('Removed node:', { nodeId: input.node.id })
          } else if (input.type === 'node_update' && input.node) {
            // Handle label updates - find node and update its data
            content.nodes = content.nodes || []
            const nodeIndex = content.nodes.findIndex((n: any) => n.id === input.node.id)
            if (nodeIndex >= 0) {
              content.nodes[nodeIndex].data = {
                ...content.nodes[nodeIndex].data,
                ...input.node.data,
              }
              console.log('Updated node label:', { 
                nodeId: input.node.id, 
                label: input.node.data.label,
                updatedNode: content.nodes[nodeIndex]
              })
            }
          }

          // Persist to database
          await flowchartService.updateFlowchart(input.flowchartId, userId, {
            content,
          })
        } else if (input.type === 'node_move' && input.node) {
          // Handle position updates asynchronously (doesn't block response)
          flowchartService.getFlowchartById(input.flowchartId, userId)
            .then((currentFlowchart) => {
              // @ts-ignore
              const content = typeof currentFlowchart.content === 'string'
                // @ts-ignore
                ? JSON.parse(currentFlowchart.content)
                // @ts-ignore
                : currentFlowchart.content

              content.nodes = content.nodes || []
              const nodeIndex = content.nodes.findIndex((n: any) => n.id === input.node.id)
              if (nodeIndex >= 0) {
                content.nodes[nodeIndex].position = input.node.position
              }

              return flowchartService.updateFlowchart(input.flowchartId, userId, { content })
            })
            .catch((err) => console.error('Async position update failed:', err))
        }

        return { success: true }
      } catch (error: any) {
        console.error('Broadcast flowchart change error:', {
          message: error?.message,
          code: error?.code,
          status: error?.status,
        })
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to broadcast flowchart change: ${error?.message || 'Unknown error'}`,
        })
      }
    }),
})