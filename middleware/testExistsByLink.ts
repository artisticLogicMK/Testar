import { serverSupabaseClient } from '#supabase/server'

//middleware to check if test exists by link uuid
export default defineNuxtRouteMiddleware(async (to) => {
    const client = useSupabaseClient()
    const { data, error } = await client.from('tests').select()
        .eq('link', to.params.id)
        .eq('published', true)

    if(error || data.length < 1) { 
        throw createError({ statusCode: 404, message: 'Page not found!'})
    }
})