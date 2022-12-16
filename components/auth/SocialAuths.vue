<script setup>
defineProps(['authMode'])
</script>

<template>
    <div class="grid grid-cols-4 gap-3 mb-3">
        <div class="socials hidden">
            <Icon name="logos:google-icon" size="1.5em" />
        </div>
        <div class="socials" @click="$emit('signInWithTwitter')">
            <Icon name="logos:twitter" size="1.5em" />
        </div>
        <div class="socials" @click="$emit('signInWithLinkedIn')">
            <Icon name="logos:linkedin-icon" size="1.5em" />
        </div>
        <div class="socials" @click="$emit('signInWithDiscord')">
            <Icon name="logos:discord-icon" size="1.5em" />
        </div>
        <div class="socials" @click="$emit('signInWithGitHub')">
            <Icon name="logos:github-icon" size="1.5em" />
        </div>
    </div>
</template>

<style>
.socials{ @apply cursor-pointer text-center duration-200 hover:scale-125 active:scale-100 }
</style>