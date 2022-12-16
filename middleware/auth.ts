export default defineNuxtRouteMiddleware((to, from) => {
    const user = useSupabaseUser()
    
    if (user.value && to.path === '/')
        navigateTo('/dashboard')
    else if (!user.value && to.path === '/dashboard')
        navigateTo('/')
})