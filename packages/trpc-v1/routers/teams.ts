import { z } from 'zod'
import { publicProcedure, router } from '../index'
import { teamService, userService } from '@supabase/index'
import { TRPCError } from '@trpc/server'

const protectedProcedure = publicProcedure.use(async (opts) => {
  if (!opts.ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'User must be authenticated',
    })
  }
  return opts.next({
    ctx: {
      ...opts.ctx,
      user: opts.ctx.user,
    },
  })
})

export const teamsRouter = router({
  createTeam: protectedProcedure
    .input(z.object({ name: z.string().min(1).max(50) }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }

      try {
        const result = await teamService.createTeam(ctx.user.id, input.name)
        return result.team
      } catch (error: any) {
        console.error('Failed to create team:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to create team',
        })
      }
    }),

  getTeam: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        const team = await teamService.getTeamById(input.teamId)
        return team
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch team',
        })
      }
    }),

  updateTeamName: protectedProcedure
    .input(z.object({ teamId: z.string().uuid(), name: z.string().min(1).max(50) }))
    .mutation(async ({ input }) => {
      try {
        const team = await teamService.updateTeamName(input.teamId, input.name)
        return team
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update team',
        })
      }
    }),

  deleteTeam: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }

      try {
        const user = await userService.getUserById(ctx.user.id)
        if (!user?.team_id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No team found to delete',
          })
        }

        return await teamService.deleteTeam(user.team_id, ctx.user.id)
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete team',
        })
      }
    }),

  inviteMember: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }

      try {
        const user = await userService.getUserById(ctx.user.id)
        if (!user?.team_id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No team found',
          })
        }

        const result = await teamService.inviteMember(user.team_id, input.email)
        return result
      } catch (error: any) {
        console.error('Failed to invite member:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to send invitation',
        })
      }
    }),
})