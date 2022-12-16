import { serverSupabaseClient } from '#supabase/server'

export default defineNuxtRouteMiddleware(async (to) => {
    const client = useSupabaseClient()
    const { data, error } = await client
        .from('tests')
        .select()
        .eq('id', to.params.id)
        .single()

    if(!data) { 
        throw createError({ statusCode: 404, message: 'Page not found!'})
    }
})