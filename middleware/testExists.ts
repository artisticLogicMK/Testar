import { serverSupabaseClient } from '#supabase/server'

// middleware to check if test exists
export default defineNuxtRouteMiddleware(async (to) => {
    const client = useSupabaseClient()
    
    const { data, error } = await client.from('tests').select()
        .eq('uuid', to.params.id)
        .single()

    if(!data) { 
        throw createError({ statusCode: 404, message: 'Page not found!'})
    }
})