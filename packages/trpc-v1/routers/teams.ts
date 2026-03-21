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

  joinTeamByCode: protectedProcedure
    .input(z.object({ code: z.string().min(16) }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User must be authenticated',
        })
      }

      try {
        // Check if user already has a team
        const user = await userService.getUserById(ctx.user.id)
        if (user?.team_id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You already have a team. Leave it first to join another.',
          })
        }

        // Find team by invite code
        const team = await teamService.getTeamByInviteCode(input.code)
        if (!team) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Invalid team code. Please check and try again.',
          })
        }

        // Add user to team
        // @ts-ignore
        await teamService.joinTeamByCode(ctx.user.id, team.id)

        return {
          success: true,
          // @ts-ignore
          message: `Joined ${team.name} successfully!`,
          team: {
            // @ts-ignore
            id: team.id,
            // @ts-ignore
            name: team.name,
          },
        }
      } catch (error: any) {
        if (error instanceof TRPCError) throw error
        console.error('Join team error:', error)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message || 'Failed to join team',
        })
      }
    }),

  getTeamInviteCode: protectedProcedure
    .query(async ({ ctx }) => {
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

        const team = await teamService.getTeamWithCode(user.team_id)
        return {
          teamId: team.id,
          teamName: team.name,
          inviteCode: team.plainCode,
        }
      } catch (error: any) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch team invite code',
        })
      }
    }),

  getTeamMembers: protectedProcedure
    .query(async ({ ctx }) => {
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

        const members = await teamService.getTeamMembers(user.team_id)
        return members
      } catch (error: any) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch team members',
        })
      }
    }),
})