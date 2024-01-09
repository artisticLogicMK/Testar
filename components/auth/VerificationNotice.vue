<script setup>
defineProps(['email'])
</script>

<template>
  <div>
        <h1 class="text-3xl font-bold text-cyan-500">
            <Icon name="emojione-v1:party-popper" size="1.3em" color="red" />
            Almost there!
        </h1>

        <div class="text-dark-200/75 text-sm text-center mt-1">
            <p>We've sent you a verification link at</p>
            <p class="text-dark-200">{{email}}</p>
            <p class="mt-3">Click on the link to complete your account setup.</p>
        </div>
    </div>
</template>