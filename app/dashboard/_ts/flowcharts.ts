import { trpc } from '@/utils/trpc'
import { gooeyToast } from 'goey-toast'
import type { Flowchart } from '@supabase/database/types'

export const useGetFlowcharts = () => {
  return trpc.flowcharts.getUserFlowcharts.useQuery()
}

export const useGetFlowchart = (id: string) => {
  return trpc.flowcharts.getFlowchartById.useQuery(
    { id },
    { enabled: !!id }
  )
}

export const useCreateFlowchart = () => {
  const utils = trpc.useUtils()

  return trpc.flowcharts.createFlowchart.useMutation({
    onSuccess: (data: Flowchart) => {
      gooeyToast.success('Flowchart created!', {
        description: `"${data.name}" has been created successfully.`,
      })
      utils.flowcharts.getUserFlowcharts.invalidate()
    },
    onError: (error) => {
      gooeyToast.error('Failed to create flowchart', {
        description: error.message,
      })
    },
  })
}

export const useUpdateFlowchart = () => {
  const utils = trpc.useUtils()

  return trpc.flowcharts.updateFlowchart.useMutation({
    onSuccess: (data: Flowchart) => {
      gooeyToast.success('Flowchart updated!', {
        description: 'Your changes have been saved.',
      })
      utils.flowcharts.getUserFlowcharts.invalidate()
      utils.flowcharts.getFlowchartById.invalidate()
    },
    onError: (error) => {
      gooeyToast.error('Failed to update flowchart', {
        description: error.message,
      })
    },
  })
}

export const useDeleteFlowchart = () => {
  const utils = trpc.useUtils()

  return trpc.flowcharts.deleteFlowchart.useMutation({
    onSuccess: () => {
      gooeyToast.success('Flowchart deleted', {
        description: 'Your flowchart has been deleted successfully.',
      })
      utils.flowcharts.getUserFlowcharts.invalidate()
    },
    onError: (error) => {
      gooeyToast.error('Failed to delete flowchart', {
        description: error.message,
      })
    },
  })
}