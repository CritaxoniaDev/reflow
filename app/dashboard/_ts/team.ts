import { trpc } from '@/utils/trpc'
import { gooeyToast } from 'goey-toast'
import type { Team } from '@supabase/database/types'

export const useCreateTeam = () => {
  const utils = trpc.useUtils()
  
  return trpc.teams.createTeam.useMutation({
    onSuccess: (data: Team) => {
      gooeyToast.success('Team created!', {
        description: `${data.name} team has been created successfully.`,
      })
      // Invalidate account info to reload team data
      utils.users.getCurrentUserWithTeam.invalidate()
    },
    onError: (error) => {
      gooeyToast.error('Failed to create team', {
        description: error.message,
      })
    },
  })
}

export const useGetTeam = (teamId?: string) => {
  return trpc.teams.getTeam.useQuery(
    { teamId: teamId || '' },
    { enabled: !!teamId }
  )
}

export const useDeleteTeam = () => {
  const utils = trpc.useUtils()
  
  return trpc.teams.deleteTeam.useMutation({
    onSuccess: () => {
      gooeyToast.success('Team deleted', {
        description: 'Your team has been deleted successfully.',
      })
      // Invalidate account info to reload after deletion
      utils.users.getCurrentUserWithTeam.invalidate()
    },
    onError: (error) => {
      gooeyToast.error('Failed to delete team', {
        description: error.message,
      })
    },
  })
}

export const useInviteMember = () => {
  const utils = trpc.useUtils()
  
  return trpc.teams.inviteMember.useMutation({
    onSuccess: () => {
      gooeyToast.success('Invitation sent!', {
        description: 'Your invitation has been sent successfully.',
      })
      // Invalidate both to reload team and member data
      utils.users.getCurrentUserWithTeam.invalidate()
      utils.teams.invalidate()
    },
    onError: (error) => {
      gooeyToast.error('Failed to send invitation', {
        description: error.message,
      })
    },
  })
}

export const useJoinTeamByCode = () => {
  const utils = trpc.useUtils()
  
  return trpc.teams.joinTeamByCode.useMutation({
    onSuccess: (data) => {
      gooeyToast.success('Success!', {
        description: data.message,
      })
      // Reload team data
      utils.users.getCurrentUserWithTeam.invalidate()
    },
    onError: (error) => {
      gooeyToast.error('Failed to join team', {
        description: error.message,
      })
    },
  })
}

export const useGetTeamInviteCode = (enabled = false) => {
  return trpc.teams.getTeamInviteCode.useQuery(undefined, { 
    enabled 
  })
}

export const useGetTeamMembers = (enabled = false) => {
  return trpc.teams.getTeamMembers.useQuery(undefined, { 
    enabled 
  })
}