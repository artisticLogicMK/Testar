<script setup>
const prop = defineProps({testId: Number})

const supabase = useSupabaseClient() // init spb client

const publishing = ref(false)

const publish = async () => {
    publishing.value = true
    const { data, error } = await supabase.from('tests')
        .update({published: true})
        .eq('id', prop.testId)
        .select().single()

    if (data) {
        publishing.value = false
        navigateTo('/dashboard')
    }
}

let pubAnimation

const closePubModal = () => {
    pubAnimation.reverse().timeScale(-1.6)
}

onMounted(() => {
    pubAnimation = modalAnimation()
})
</script>


<template>
    <div id="authOverlay" class="fixed z-30 left-0 top-0 h-full w-full flex items-end xsm:items-center justify-center py-3 px-2 overflow-y-auto bg-white/80 backdrop-blur-sm scale-y-0 -translate-x-full opacity-0 origin-center">
        <div id="fourth" class="bg-white/0 w-full xsm:max-w-md m-auto mb-0 sm:mb-auto p-2 xsm:p-3 border border-white/0 rounded-2xl shadow-sm">
            <div id="second" class="bg-white p-4 sm:p-8 w-full rounded-xl shadow-sm scale-y-0 opacity-0">

                <div class="absolute left-0 top-0 z-10 w-full text-end px-4 pt-2">
                    <div
                        class="inline-block rounded-full hover:bg-neutral-100 p-0.5 cursor-pointer"
                        @click="() => {
                            closePubModal()
                            $emit('closePublish')
                        }"
                    >
                        <IconsClose :color="'fill-neutral-400/80'" :size="30" />
                    </div>
                </div>

                <div id="third" class="relative scale-y-0 opacity-0 text-center p-5">

                    <IconsWarning :color="'fill-neutral-300/60'" :size="45" />

                    <p class="text-neutral-500/90 text-sm sm:text-base py-3">Keep in mind that once a test is published, it cannot be modified after that point; you can only make a new copy of it. Please double-check that this test is okay before proceeding.</p>

                    <button
                        @click="publish"
                        class="btnEffect bg-cyan-400 text-base text-white font-semibold border-b-[3px] border-cyan-500 rounded-md px-3 py-1 mr-1 mt-2"
                        :disabled="publishing"
                    >
                        All Good <i v-if="publishing" class="la la-spinner la-pulse"></i>
                    </button>

                </div>
            </div>
        </div>
    </div>
</template>