<script setup>
defineProps(['error'])

const clear = () => {
    window.location = '/'
}
</script>

<template>
    <NuxtLayout name="bg-layout">
        <div class="flex flex-col items-center justify-center h-full px-3">
            <h1 class="text-white/80 text-7xl font-bold">{{error.statusCode}}!</h1>
            
            <div class="flex flex-col items-center mt-3">
                <p class="text-white/80 text-base mr-2">{{error.message}}</p>
                <button @click="clear" class="btnEffect bg-white/10 border border-white/20 rounded-md text-sm font-semibold text-white/80 px-3 py-1 mt-1.5 w-fit">Go Home</button>
            </div>

            <Icon name="fluent-emoji:flying-saucer" size="10em" />
        </div>
    </NuxtLayout>
</template>