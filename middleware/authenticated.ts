export default defineNuxtRouteMiddleware(() => {
    const user = useSupabaseUser()
    
    if (!user.value) {
        navigateTo('/')
    }
})