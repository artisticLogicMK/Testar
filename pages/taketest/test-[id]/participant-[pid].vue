<script setup>
definePageMeta({
  middleware: ['test-exists-by-link','check-participant']
})

const { pid } = useRoute().params //get test link from param

const supabase = useSupabaseClient() //init spb client

const userAuth = useUser() //user Auth data

const testIsFinished = ref(false)

const testInfo = ref(null)

const participant = ref(null)

const answers = ref(null)

const questions = ref([])

const currentQuestion = ref(null)

const currentIndex = ref(0)

const isNotLastQuestion = computed(() => answers.value.current + 1 !== questions.value.length)

const completionLevel = computed(() => (currentIndex.value + 1) * (100 / questions.value.length))

const timer = ref(0)

const timeEnded = ref(false)

const nextBtn = ref(false)

const endBtn = ref(false)


//go to next question
const nextQuestion = () => {
    currentIndex.value += 1
    currentQuestion.value = questions.value[currentIndex.value]
    nextBtn.value = false

    window.scrollTo(0, 0);
}


//final question - end the test
const endTest = async (timeEnded = false) => {
    nextBtn.value = false
    endBtn.value = true
    const { data, error } = await supabase.from('participants')
        .update({
            finished: true,
            time_taken: timer.value
        })
        .eq('uuid', pid)
        .select().single()

    if (data) {
        if(!timeEnded) window.location.reload()
    } else {
        nextBtn.value = true
    }

    window.scrollTo(0, 0);
}

onMounted( async () => {
    const { data } = await supabase.from('participants')
        .select()
        .eq('uuid', pid)
        .single()

    participant.value = data
    answers.value = participant.value.answers

    //fetch test
    const { data: test } = await supabase.from('tests')
        .select('id, title, timeframe, pass_range, see_score, see_pass, specify_time, link')
        .eq('uuid', data.test_uuid)
        .single()

    if (test) testInfo.value = test

    //check if test has not been taken, unique to participant link
    if (!data.finished) {

        if (data) {
            const { data: qdata } = await supabase.from('questions')
                .select()
                .eq('test_id', data.test_uuid)
                .order('timestamp', { ascending: true })

            if (qdata.length === 1 || (participant.value.answers.current + 1 !== qdata.length)) {    

                if (qdata) {
                    questions.value = qdata.length > 0 ? qdata : []

                    currentIndex.value = data.answers.current !== null ? data.answers.current + 1 : 0
                    currentQuestion.value = questions.value[currentIndex.value]

                    if (test.specify_time) {
                        //Timer Countdown: credit goes to https://cutt.ly/J0rKiDd
                        let countdown = participant.value.countdown_time
                        setInterval(function() {
                            let now = new Date().getTime()
                            let timeleft = countdown - now

                            let hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                            let minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60))
                            let seconds = Math.floor((timeleft % (1000 * 60)) / 1000)

                            timer.value = (hours > 0 ? hours+':' : hours)+minutes+':'+seconds

                            if (timeleft < 0) {
                                timeEnded.value = true
                                timer.value = 0
                                endTest(true)
                            }
                        }, 1000)
                    }
                }

            }
            else {
                endTest()
            }
        }

        //watch for changes in participant answer and update
        watch(() => answers.value, async (newVal, oldVal) => {
            const { data, error } = await supabase.from('participants')
                .update({
                    answers: {current: currentIndex.value, data: answers.value.data}
                })
                .eq('uuid', pid)
                .select().single()

            if (data) {
                //acumulate participant score
                participant.value.score = 0

                Object.keys(answers.value.data).forEach(key => {
                    if (answers.value.data[key].correct) {
                        participant.value.score += 1
                    }
                })
            }
        }, { deep: true })


        //watch for changes in participant data n update
        watch(() => participant.value, async (newVal, oldVal) => {
        const { data, error } = await supabase.from('participants')
            .update({
                score: (100/questions.value.length) * participant.value.score,
                finished: answers.value.current + 1 === questions.value.length ? true : false
            })
            .eq('uuid', pid)
            .select().single()

        if (data) {
           
        }
    }, { deep: true })
    
    }
    else {
        testIsFinished.value = true
    }
})


//animations
const slideInUp = (el) => {
  slideInUpAnim(el, false)
}
</script>

<template>
    <Head>
        <Title>{{testInfo ? testInfo.title : ''}} | Testar</Title>
    </Head>

    <NuxtLayout name="bg-layout">
        <div v-if="!testIsFinished">
            <transition appear @enter="slideInUp">
                <div v-if="questions.length" class="max-w-3xl mx-auto my-4 px-3">
                    
                    <div>
                        <p class="text-white/90 font-semibold text-xl text-center mb-2">{{testInfo.title}}</p>

                        <div class="flex items-center justify-between">
                            <h1 class="text-white/90 font-semibold text-xl">
                                Question {{currentIndex + 1}}<span class="text-sm">/{{questions.length}}</span>
                            </h1>

                            <div class="flex items-center text-white/90 text-xl font-semibold">
                                <IconsStopwatch :color="'fill-white/90'" :size="25" :class="{'ans an-tada an-infinite': testInfo.specify_time}" />
                                {{testInfo.specify_time ? timer : 'No Time'}}
                            </div>
                        </div>

                        <div class="h-1 bg-white/30 w-full my-2">
                            <div class="h-1 bg-white/70 duration-700" :style="'width:'+completionLevel+'%'"></div>
                        </div>
                    </div>


                    <div class="bg-white h-full w-full rounded-lg shadow-xl mt-5 overflow-hidden">

                        <div v-if="!timeEnded" class="w-full">
                            <div v-if="currentQuestion" class="flex flex-col bg-neutral-100 border-b p-4 xsm:p-7">
                                <p class="text-cyan-600 font-semibold whitespace-pre-wrap sm:min-w-[400px] mx-auto">{{currentQuestion.data.text}}</p>

                                <div v-if="currentQuestion.data.image" class="grow bg-[length:100%_100%] bg-center w-[95%] xsm:w-[80%] md:max-w-md mx-auto h-fit inline-block rounded-md mt-2" :style="'background-image: url('+spbStorageUrl+currentQuestion.data.image+')'">
                                    <NuxtLink to="/"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="w-full" viewBox="0 0 10 6"></svg></NuxtLink>
                                </div>
                            </div>


                            <div class="p-4 xsm:p-5 max-w-lg mx-auto">
                                <div v-if="currentQuestion && currentQuestion.data.answer" class="relative">
                                    <div
                                        v-for="option in ['a','b','c','d']"
                                        :key="option"
                                        @click="() => {
                                            answers.data['q'+currentIndex] = {option: option, correct: option === currentQuestion.data.answer, qid: currentQuestion.id}
                                            answers.current = currentIndex
                                            nextBtn = true
                                        }"
                                        class="flex items-start group cursor-pointer mb-7"
                                    >
                                        <div
                                            class="shrink-0 flex items-center justify-center w-9 h-9 border-[3px] rounded-full text-2xl font-bold mr-2 duration-200 group-active:scale-125 capitalize"
                                            :class="answers.data['q'+currentIndex]?.option === option ? 'border-cyan-400 text-cyan-400 bg-cyan-50' : 'border-neutral-300 text-neutral-300'"
                                        >{{option.toUpperCase()}}</div>

                                        <p class="whitespace-pre-wrap mt-1.5" :class="answers.data['q'+currentIndex]?.option === option ? 'text-cyan-500' : 'text-neutral-600/90'">{{currentQuestion.data.options[option].data}}</p>
                                    </div>

                                    <div v-if="endBtn" class="absolute top-0 w-full h-full bg-transparent"></div>
                                </div>


                                <div v-else class="text-neutral-400/80 text-xl font-bold text-center p-3">
                                    Questionaire has designated no answer to this question.
                                </div>


                                <div class="text-center">
                                    <transition enter-active-class="ans an-bounceIn an-fast">
                                        <button 
                                            v-if="nextBtn"
                                            @click="isNotLastQuestion ? nextQuestion() : endTest()"
                                            class="btnEffect bg-cyan-400 border-b-[3px] border-cyan-500 active:border-cyan-300 text-white font-semibold rounded-md px-3 py-1"
                                        >
                                            {{isNotLastQuestion ? 'Next Question' : 'Finish'}}
                                        </button>
                                    </transition>
                                </div>
                            </div>
                        </div>

                        
                        <div v-else class="p-7 text-center">
                            <p class="text-xl text-cyan-600 font-semibold mb-2">The time allotted for the test has expired and your performance has been submitted.</p>
                            <button
                                @click="endTest()" class="btnEffect bg-cyan-400 border-b-[3px] border-cyan-500 active:border-cyan-300 text-white font-semibold rounded-md px-3 py-1"
                            >Finish</button>
                        </div>

                    </div>

                </div>
            </transition>

            <div class="flex items-center justify-center w-full mt-28">
                <IconsLoader v-if="!questions.length" :color="'fill-white/90'" :size="45" class="animate-spin" />
            </div>
        </div>


        <div v-if="testIsFinished">
            <DashboardTestFinished
                :pdata="{
                    id: participant.uuid,
                    score: participant.score
                }"
                :tdata="{
                    testId: participant.test_uuid,
                    testLink: testInfo.link,
                    testTitle: testInfo ? testInfo.title : '',
                    pass_range: testInfo.pass_range,
                    see_score: testInfo.see_score,
                    see_pass: testInfo.see_pass
                }"
            />
        </div>
        
        <Footer />
    </NuxtLayout>
</template>

<style>

</style>