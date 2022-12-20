<script setup>
import moment from 'moment'

definePageMeta({
  middleware: ['authenticated', 'test-exists']
})

const { id } = useRoute().params //get test id ftom param
const supabase = useSupabaseClient() //init spb client

const state = store()

const participants = ref([])

const rank = ref(null)

const questionCount = ref(null)

const participantInfo = ref(null)

onBeforeMount( async () => {
    //fetch participants
    const { data, error } = await supabase.from('participants').select()
        .eq('test_uuid', id)
        .eq('finished', true)
        .order('score', { ascending: false })

        participants.value = data

        //get definite rank here
        let set = new Set(participants.value.map(s => (s.score)))
        rank.value = Array.from(set)

        //get no of questions
        const { count } = await supabase.from('questions').select('*', { count: 'exact' })
            .eq('test_id', id)
        questionCount.value = count
})
</script>

<template>
    <Head>
        <Title>Participants | Testar</Title>
    </Head>

    <NuxtLayout name="test-layout">

        <div class="bg-white border rounded-lg my-4 shadow-sm">

            <div class="xsm:flex items-center justify-between p-3">
                <div class="text-neutral-600 py-3 mr-2">
                    <p class="text-base font-semibold">Participants</p>
                    <p class="text-sm">This is a list of all the participants who have taken this test.</p>
                </div>

                
                <div class="hidden flex0 items-center bg-neutral-50 text-neutral-500 border rounded-md px-2 py-1">
                    <i class="la la-search"></i> <input type="text" class="grow w-full bg-transparent border-none text-sm p-1" placeholder="Search on participants...">
                </div>
            </div>


            <table id="patTable" class="bg-white border-collapse border-t w-full rounded-b-lg">
                <thead>
                    <tr class="bg-neutral-100 text-neutral-600 border-b">
                        <th></th>
                        <th>Date</th>
                        <th>Score</th>
                        <th>Complete</th>
                        <th>Info</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="p in participants" :key="p.id">
                        <td>
                            <div class="text-sm text-neutral-400 font-bold">{{rank.findIndex(s => s === p.score) + 1}}</div>
                        </td>
                        <td>{{moment(p.created_at).format('MMM Do YY, h:mma')}}</td>

                        <td>
                            <div class="text-sm text-neutral-500/90 font-bold">{{p.score.toFixed(1)}}%</div>
                        </td>

                        <td>
                            <span v-if="Object.keys(p.answers.data).length === questionCount" class="text-green-500 text-xs border border-green-400 rounded-full px-2">Yes</span>
                            <span v-else class="text-red-500 text-xs border border-red-400 rounded-full px-2">No</span>
                        </td>

                        <td class="relative">
                            <IconsEllipsesH @click="participantInfo = p.data" class="absolute top-2.5 active:scale-x-125 cursor-pointer" :color="'fill-neutral-500'" :size="25" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="participants.length < 1" class="text-neutral-300 text-2xl font-bold p-5 text-center">
                No participants have taken this test yet.
            </div>

        </div>
        
        <transition
            appear enter-active-class="ans an-fadeIn an-fast"
            leave-active-class="ans an-fadeOut an-faster"
        >
            <DashboardParticipantInfo
                v-if="participantInfo"
                :data="participantInfo"
                @closeInfo="participantInfo = null"
            />
        </transition>
    </NuxtLayout>
</template>

<style>
.info p{@apply text-neutral-600 text-sm first:font-semibold first:text-neutral-400}
#patTable th, #patTable td{@apply text-start text-sm px-2 xsm:px-3 py-3 }
#patTable td{@apply text-sm text-neutral-600 }
#patTable tbody tr{@apply border-b border-neutral-200/70 last:border-transparent hover:bg-neutral-50/80 last:rounded-b-lg overflow-hidden}
</style>