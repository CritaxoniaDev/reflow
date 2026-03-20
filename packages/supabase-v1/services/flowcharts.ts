import { createAdminClient } from '../server'

const supabaseAdmin = createAdminClient()

export const flowchartService = {
  async createFlowchart(userId: string, name: string, teamId?: string) {
    const { data, error } = await supabaseAdmin
      .from('flowcharts')
      .insert({
        name,
        user_id: userId,
        team_id: teamId || null,
        content: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getFlowchartById(id: string, userId: string) {
    const { data, error } = await supabaseAdmin
      .from('flowcharts')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error?.code === 'PGRST116') throw new Error('Flowchart not found')
    if (error) throw error
    return data
  },

  async getUserFlowcharts(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('flowcharts')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data
  },

  async updateFlowchart(id: string, userId: string, updates: { name?: string; content?: any }) {
    const { data, error } = await supabaseAdmin
      .from('flowcharts')
      // @ts-ignore
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
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