<script setup>
const supabase = useSupabaseClient() //init spb client

const props = defineProps({
    pdata: Object,
    tdata: Object
})

const participants = ref(null)

const rank = ref(null)

const url = ref('')

onMounted( async () => {
    //fetch participants
    const { data, error } = await supabase.from('participants')
        .select('uuid, score')
        .eq('test_uuid', props.tdata.testId)
        .eq('finished', true)
        .order('score', { ascending: false })

    participants.value = data
    let index = participants.value.findIndex(p => p.uuid == props.pdata.id)

    //get definite rank here
    let set = new Set(participants.value.map(s => (s.score)))
    rank.value = Array.from(set).findIndex(s => s === props.pdata.score)

    url.value = window.location.href

    //instantiate clipboardjs
    let clipboard = new ClipboardJS('.copybtn')
})
</script>

<template>

    <div class="max-w-3xl mx-auto my-5">
        <transition appear enter-active-class="ans an-bounceIn">
            <div class="text-center mb-9" :class="{'mt-14': !props.tdata.see_pass}">
                <NuxtLink to="/"><img src="~/assets/img/logo.svg" class="w-20 opacity-90 inline-block mb-1"></NuxtLink>
                <p class="text-white/80 text-xl font-semibold">Thanks for participating!</p>
            </div>
        </transition>

        <transition appear enter-active-class="ans an-zoomIn an-fast">
            <div v-if="participants" class="text-center text-white/90">
                <div v-if="props.tdata.see_score">
                    <h1 class="text-lg font-bold opacity-90" style="text-shadow: 0 2px 2px rgba(0,0,0,0.3)">{{props.tdata.testTitle}}</h1>
                    <p class="text-xl">Your score for this test is <span class="font-bold">{{props.pdata.score.toFixed(1)}}%</span></p>

                    <div v-if="props.tdata.see_pass">
                        <p v-if="props.pdata.score >= props.tdata.pass_range" class="text-base">Congratulations! You've successfully passed the test with a score higher than the required passing percentage of <span class="font-bold">{{props.tdata.pass_range}}%</span>.</p>
                        
                        <p v-else class="text-base">Unfortunately, you didn't meet the minimum passing requirement of <span class="font-bold">{{props.tdata.pass_range}}%</span> for the test.</p>
                    </div>

                    
                    <div class="max-w-xs mx-auto rounded-md border border-white/20 bg-white/10 text-base mt-4 px-5 py-2">
                        <p>You rank</p>
                        <div class="inline-flex items-center justify-center rounded-full w-12 h-12 border border-white/40 bg-white/30 text-2xl font-bold text-white/90 my-1">
                            {{rank+1}}
                        </div>
                        <p>Among the {{participants.length}} participants who have taken this test.</p>
                    </div>

                    <div class="text-white/90 text-sm mt-2" x-data="{result:false,test:false}">
                        <span x-on:click="result=true" class="copybtn underline cursor-pointer" :data-clipboard-text="url" x-text="result ? 'Link Copied' : 'Copy Link'"></span>
                        <span class="mx-2">|</span>
                        
                        <span v-if="false" x-on:click="test=true" class="copybtn underline cursor-pointer" :data-clipboard-text="takeTestUrl+tdata.testLink" x-text="test ? 'Link Copied' : 'Test Link'"></span>
                        <span v-if="false" class="mx-2">|</span>

                        <NuxtLink to="/" class="underline">Create your own test.</NuxtLink>
                    </div>
                </div>

                <div class="text-center">
                    <img src="~/assets/img/thumbs-up.svg" class="w-32 mt-4 inline-block">
                </div>
            </div>
        </transition>

    </div>

</template>

<style>

</style>