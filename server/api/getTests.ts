import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const client = serverSupabaseClient(event)
    const user = useSupabaseUser()

    const { data, error } = await client
        .from('tests')
        .select()
        .eq('user_id', user.value.id)
    return data
})