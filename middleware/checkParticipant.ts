import { serverSupabaseClient } from '#supabase/server'

//middleware to check if participant exists
export default defineNuxtRouteMiddleware(async (to) => {
    const client = useSupabaseClient()
    
    const { data, error } = await client
        .from('participants').select()
        .eq('uuid', to.params.pid)
        .single()

    if(!data) { 
        throw createError({ statusCode: 404, message: 'Page not found!'})
    }
})