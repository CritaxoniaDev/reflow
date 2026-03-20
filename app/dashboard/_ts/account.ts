import { trpc } from '@/utils/trpc'

export function useAccountInfo() {
  const { data: accountInfo, isLoading } = trpc.users.getCurrentUserWithTeam.useQuery()

  return {
    userId: accountInfo?.id,
    username: accountInfo?.username || 'User',
    teamName: accountInfo?.team?.name || 'Personal',
    teamId: accountInfo?.team?.id || null,
    isLoading,
  }
}