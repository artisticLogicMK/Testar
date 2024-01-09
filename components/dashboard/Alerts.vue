<script setup>
defineProps(['alertData'])
const emit = defineEmits(['closeAlert'])

const display = ref(true)

onMounted(() => {
    setTimeout(() => {
        display.value = false
        setTimeout(() => emit('closeAlert'), 1000)
    }, 4000)
})
</script>


<template>
    <transition
        appear enter-active-class="ans an-slideInDown an-faster"
        leave-active-class="ans an-slideOutUp an-faster"
    >
        <div
            v-if="display"
            class="fixed top-3 right-3 z-20 max-w-[290px] flex items-center justify-center border rounded-md bg-white p-3 shadow-lg"
        >
            <IconsCheck v-if="alertData.type === 'success'" :color="'fill-green-500'" :size="24" class="mr-2" />
            <IconsWarning v-else :color="'fill-red-500'" :size="24" class="mr-2" />
            <span class="text-neutral-600/80 text-base">{{alertData.msg}}</span>
        </div>
    </transition>
</template>