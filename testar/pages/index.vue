<script setup lang="ts">
definePageMeta({
    middleware: ['auth']
})

//get user data
const user = useSupabaseUser()

onMounted(() => {
    watchEffect(() => {
        if (user.value) navigateTo('/dashboard')
    })
})

const { data: p } = await useFetch('/api/getUser', {
  headers: useRequestHeaders(['cookie'])
})
</script>

<template>
    <NuxtLayout name="bg-layout">

        <HomeContent />

    </NuxtLayout>
</template>

<style>
.authBtns { @apply w-fit relative mr-3 }
.authBtns .ovl { @apply absolute  w-full h-full -skew-x-[32deg] -ml-1 border border-white/75 scale-0 origin-bottom-left }
.authBtns button { @apply bg-gradient-to-tr from-white/5 to-white/30 -skew-x-[32deg] text-sm px-3 py-1.5 font-bold }
.authBtns button.dark { @apply bg-gradient-to-tr from-white/5 to-dark-200 }
.authBtns button span { @apply block skew-x-[32deg] }
</style>