import { createAdminClient } from '../server'

const supabaseAdmin = createAdminClient()

export const flowchartService = {
  async createFlowchart(userId: string, name: string, teamId?: string) {
    const adm = createAdminClient()

    const { data, error } = await adm
      .from('flowcharts')
      .insert({
        user_id: userId,
        team_id: teamId || null,
        name,
        content: JSON.stringify({ nodes: [], edges: [] }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getFlowchartById(id: string, userId: string) {
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('team_id')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    // Fetch flowchart with team join
    const { data, error } = await supabaseAdmin
      .from('flowcharts')
      .select(`
        *,
        teams(id, name)
      `)
      .eq('id', id)
      .single()

    if (error?.code === 'PGRST116') throw new Error('Flowchart not found')
    if (error) throw error

    // Check access: user is creator OR flowchart belongs to user's team
    // @ts-ignore
    const isCreator = data.user_id === userId
    // @ts-ignore
    const isTeamMember = user?.team_id && data.team_id === user.team_id

    if (!isCreator && !isTeamMember) {
      throw new Error('Flowchart not found or access denied')
    }

    // Flatten team data into flowchart
    const flowchartWithTeam = {
      // @ts-ignore
      ...data,
      // @ts-ignore
      team_name: data.teams?.name || null,
    }

    return flowchartWithTeam
  },

  async getUserFlowcharts(userId: string) {
    const adm = createAdminClient()

    // Get user's team
    const { data: user, error: userError } = await adm
      .from('users')
      .select('team_id')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    // Get personal flowcharts
    const { data: personalFlowcharts, error: personalError } = await adm
      .from('flowcharts')
      .select('*')
      .eq('user_id', userId)
      .is('team_id', null)

    if (personalError) throw personalError

    // Get team flowcharts if user has a team
    let teamFlowcharts: any[] = []
    // @ts-ignore
    if (user?.team_id) {
      const { data: team, error: teamError } = await adm
        .from('flowcharts')
        .select('*')
        // @ts-ignore
        .eq('team_id', user.team_id)

      if (teamError) throw teamError
      teamFlowcharts = team || []
    }

    return {
      personal: personalFlowcharts || [],
      team: teamFlowcharts,
    }
  },

  async getTeamFlowcharts(teamId: string) {
    const adm = createAdminClient()

    const { data, error } = await adm
      .from('flowcharts')
      .select('*')
      .eq('team_id', teamId)

    if (error) throw error
    return data || []
  },

  async updateFlowchart(id: string, userId: string, updates: { name?: string; content?: any }) {
    // First, fetch the user's team
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('team_id')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    // Fetch the flowchart to check permissions
    const { data: flowchart, error: fetchError } = await supabaseAdmin
      .from('flowcharts')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    // Check access: user is creator OR flowchart belongs to user's team
    // @ts-ignore
    const isCreator = flowchart.user_id === userId
    // @ts-ignore
    const isTeamMember = user?.team_id && flowchart.team_id === user.team_id

    if (!isCreator && !isTeamMember) {
      throw new Error('You do not have permission to update this flowchart')
    }

    // Update the flowchart
    const { data, error } = await supabaseAdmin
      .from('flowcharts')
      // @ts-ignore
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteFlowchart(id: string, userId: string) {
    const { error } = await supabaseAdmin
      .from('flowcharts')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
  },
}