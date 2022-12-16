<script setup>
defineProps(['authMode'])
</script>

<template>
    <div class="grid grid-cols-4 gap-3 justify-between mb-3">
        <div class="socials">
            <Icon name="logos:google-icon" size="1.3em" />
        </div>
        <div class="socials">
            <Icon name="logos:twitter" size="1.3em" />
        </div>
        <div class="socials" @click="$emit('signInWithLinkedIn')">
            <Icon name="logos:linkedin-icon" size="1.3em" />
        </div>
        <div class="socials" @click="$emit('signInWithGitHub')">
            <Icon name="logos:github-icon" size="1.3em" />
        </div>
    </div>
</template>

<style>
.socials{ @apply rounded-lg flex justify-center items-center border border-neutral-300/80 hover:bg-neutral-300/20 hover:shadow-md px-2 py-2 cursor-pointer }
.socials i{ @apply text-2xl }
</style>