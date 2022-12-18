<script setup>
definePageMeta({
  middleware: ['test-exists-by-link']
})

const { id: testlink } = useRoute().params //get test link from param

const supabase = useSupabaseClient() //init spb client

const userAuth = useUser() //user Auth data

const testInfo = ref(null)

const isNotClosed = computed(() => {
    if (testInfo.value.allow_close) {
        return testInfo.value.close_time > Date.now()
    } else {
        return true
    }
})

const questionsCount = ref('')

const infos = ref({})

const bookFlip = ref(false)

const prefix = '/taketest/test-'+testlink+'/participant-'

//create timestamp from test countdown time
const makeCountdownTime = () => {
    let hour = testInfo.value.timeframe.hour ? (testInfo.value.timeframe.hour * 3600) * 1000 : 0
    let min = testInfo.value.timeframe.min ? (testInfo.value.timeframe.min * 60) * 1000 : 0
    return Date.now() + (hour+min) + 8000
}

//submit participant
const submit = async () => {
    const { data, error } = await supabase.from('participants')
        .insert({
            test_uuid: testInfo.value.uuid,
            data: infos.value,
            countdown_time: makeCountdownTime()
        })
        .select().single()

    if (data) {
        localStorage.setItem('test-'+data.test_uuid, ''+data.test_uuid+'')
        localStorage.setItem('parti-'+data.test_uuid, ''+data.uuid+'')
        navigateTo(prefix+data.uuid)
    }
}

onMounted( async () => {
    
    //fetch test info
    const { data: result, error } = await supabase.from('tests').select()
        .eq('link', testlink)
        .single()

    if (result) {
        const loTest = localStorage.getItem("test-"+result.uuid)
        const loParti = localStorage.getItem("parti-"+result.uuid)

        if (loTest === null) {
            testInfo.value = result

            infos.value = {...result.infos}
            let getInfos = Object.keys(result.infos)
            getInfos.forEach((info) => infos.value[info] = null)


            //get no of questions
            const { count, error:ce } = await supabase.from('questions').select('*', { count: 'exact' })
                .eq('test_id', testInfo.value.uuid)
            questionsCount.value = count > 0 ? count : 0
        }
        else if (loTest !== null) {
            navigateTo(prefix+loParti)
        }
    }


    setInterval(() => bookFlip.value = !bookFlip.value, 500)
})

const slideInUp = (el) => {
  slideInUpAnim(el, true)
}
</script>

<template>
<Head>
    <Title>{{testInfo && testInfo.title ? testInfo.title : ''}} | Testar</Title>
</Head>

<NuxtLayout name="bg-layout">
    <div class="text-center w-full py-3 mb-1">
        <NuxtLink to="/"><img src="~/assets/img/logo.svg" class="w-24 sm:w-24 opacity-90 inline-block"></NuxtLink>
    </div>


    <div v-if="testInfo" class="px-2 sm:px-3">

        <transition appear @enter="slideInUp">
            <div v-if="isNotClosed" class="bg-white h-full w-full max-w-4xl mx-auto rounded-lg shadow-xl overflow-hidden">

                <div class="flex flex-col md:flex-row items-center w-full pads">
                    <div
                        class="mr-2 w-full"
                        :class="{'md:max-w-[400px] md2:max-w-[450px] lg:max-w-[500px]': testInfo.cover}"
                    >
                        <h1 class="text-dark-100/80 font-bold text-lg sm:text-2xl mb-2">{{testInfo.title}}</h1>
                        <p class="text-neutral-600/90 text-base whitespace-pre-wrap">{{testInfo.description}}</p>
                        <div class="flex flex-wrap mt-2">

                            <div
                                v-if="testInfo.specify_time"
                                class="overview"
                            >
                                <h1>Time Allowed</h1>
                                <p>{{testInfo.timeframe.hour ? testInfo.timeframe.hour+(testInfo.timeframe.min ? ':'+testInfo.timeframe.min : '')+' hr' : testInfo.timeframe.min+' min'}}</p>
                            </div>

                            <div class="overview">
                                <h1>Questions</h1>
                                <p>{{questionsCount}}</p>
                            </div>

                            <div v-if="testInfo.see_pass" class="overview">
                                <h1>Pass Score</h1>
                                <p>{{testInfo.pass_range}}%</p>
                            </div>

                            <div class="overview">
                                <h1>Format</h1>
                                <p>Multiple Options</p>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="testInfo.cover"
                        class="grow bg-[length:100%_100%] bg-center w-[90%] xsm:w-[80%] md:w-auto h-fit inline-block rounded-md mt-2"
                        :style="'background: url('+spbStorageUrl+testInfo.cover+')'"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="w-full" viewBox="0 0 10 6"></svg>
                    </div>
                </div>


                <div class="bg-neutral-100 border-t pads">

                    <div class="w-full max-w-md mx-auto">

                        <form @submit.prevent="submit" class="takeform w-full">
                            <div v-if="testInfo.fill_info" class="w-full">
                                <div class="mb-3">
                                    <p class="text-neutral-500/70 text-sm font-bold">Fill the information below to start the test.</p>
                                    <p class="text-neutral-600 text-sm">The fields marked with (<span class="text-red-500">*</span>) are required.</p>
                                </div>


                                <div v-if="testInfo.infos.name" class="takefields">
                                    <span v-if="testInfo.infos.name.required" class="reqs">*</span>
                                    <i class="la la-user"></i>
                                    <input type="text" v-model="infos.name" placeholder="Name" :required="testInfo.infos.name.required">
                                </div>


                                <div v-if="testInfo.infos.email" class="takefields">
                                    <span v-if="testInfo.infos.email.required" class="reqs">*</span>
                                    <i class="la la-at"></i>
                                    <input type="email" v-model="infos.email" placeholder="Email" :required="testInfo.infos.email.required">
                                </div>


                                <div v-if="testInfo.infos.phone" class="takefields">
                                    <span v-if="testInfo.infos.phone.required" class="reqs">*</span>
                                    <i class="la la-phone-alt"></i>
                                    <input type="phone" v-model="infos.phone" placeholder="Phone" :required="testInfo.infos.phone.required">
                                </div>


                                <div v-if="testInfo.infos.about" class="takefields">
                                    <span v-if="testInfo.infos.about.required" class="reqs">*</span>
                                    <i class="la la-id-badge self-start"></i>
                                    <textarea rows="3" v-model="infos.about" placeholder="About" :required="testInfo.infos.about.required"></textarea>
                                </div>


                                <div v-if="testInfo.infos.gender" class="takefields">
                                    <span v-if="testInfo.infos.gender.required" class="reqs">*</span>
                                    <i class="la la-female"></i>
                                    <select v-model="infos.gender" :required="testInfo.infos.gender.required">
                                        <option :value="null">Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>


                                <div v-if="testInfo.infos.age" class="takefields">
                                    <span v-if="testInfo.infos.age.required" class="reqs">*</span>
                                    <i class="la la-seedling"></i>
                                    <input type="number" v-model="infos.age" placeholder="Age" :required="testInfo.infos.age.required">
                                </div>

                                <!---for next version
                                <div v-if="testInfo.infos.picture" class="takefields">
                                    <span v-if="testInfo.infos.picture.required" class="reqs">*</span>
                                    <i class="la la-image"></i>
                                    <label for="pic" class="text-sm text-neutral-400 ml-2">Picture</label>
                                    <input type="file" id="pic" placeholder="Phone" :required="testInfo.infos.picture.required" class="appearance-none border-none file:bg-transparent file:border-none file:text-transparent bg-transparent">
                                </div>
                                -->


                                <div v-if="testInfo.infos.location" class="takefields">
                                    <span v-if="testInfo.infos.location.required" class="reqs">*</span>
                                    <i class="la la-map-marker"></i>
                                    <input type="text" v-model="infos.location" placeholder="Location" :required="testInfo.infos.location.required">
                                </div>


                                <div v-if="testInfo.infos.profession" class="takefields">
                                    <span v-if="testInfo.infos.profession.required" class="reqs">*</span>
                                    <i class="la la-tools"></i>
                                    <input type="text" v-model="infos.profession" placeholder="Profesional Skills" :required="testInfo.infos.profession.required">
                                </div>


                                <div v-if="testInfo.infos.beliefs" class="takefields">
                                    <span v-if="testInfo.infos.beliefs.required" class="reqs">*</span>
                                    <i class="la la-fist-raised self-start"></i>
                                    <textarea v-model="infos.beliefs" rows="2" placeholder="Beliefs" :required="testInfo.infos.beliefs.required"></textarea>
                                </div>


                                <div v-if="testInfo.infos.marritalStatus" class="takefields">
                                    <span v-if="testInfo.infos.marritalStatus.required" class="reqs">*</span>
                                    <i class="la la-ring"></i>
                                    <select v-model="infos.marritalStatus" :required="testInfo.infos.marritalStatus.required">
                                        <option :value="null">Select</option>
                                        <option value="male">Single</option>
                                        <option value="female">Married</option>
                                    </select>
                                </div>


                                <div v-if="testInfo.infos.language" class="takefields">
                                    <span v-if="testInfo.infos.language.required" class="reqs">*</span>
                                    <i class="la la-language"></i>
                                    <input type="text" v-model="infos.language" placeholder="Language" :required="testInfo.infos.language.required">
                                </div>


                                <div v-if="testInfo.infos.education" class="takefields">
                                    <span v-if="testInfo.infos.education.required" class="reqs">*</span>
                                    <i class="la la-school"></i>
                                    <input type="text" v-model="infos.education" placeholder="Education" :required="testInfo.infos.education.required">
                                </div>

                            </div>

                            <div class="text-center">
                                <button type="submit" class="btnEffect bg-cyan-400 border-b-[3px] border-cyan-500 active:border-cyan-300 text-white font-semibold rounded-md px-3 py-1">Start Test</button>
                            </div>
                        </form>

                    </div>

                </div>
            </div>
        

            <div v-else class="text-center mt-20">
                <h1 class="text-white/80 text-xl font-bold">This test has been closed!</h1>
                <Icon v-if="!bookFlip" name="fluent-emoji:blue-book" size="6em" class="mt-2" />
                <Icon v-else name="fluent-emoji:open-book" size="6.5em" class="mt-2" />
            </div>
        </transition>

    </div>


    <div v-if="!testInfo" class="mt-28 flex items-center justify-center">
        <IconsLoader class="animate-spin inline-block" :color="'fill-white/80'" :size="60" />
    </div>

    <Footer />
</NuxtLayout>
</template>

<style>
.takeform .takefields{@apply flex items-center w-full bg-white border rounded-md px-1 py-0.5 mb-3 }
.takeform input, .takeform select, .takeform textarea{@apply grow w-full border-none text-sm  }
.takeform .takefields i{@apply text-xl text-neutral-500 }
.takeform .reqs{@apply text-red-500 text-sm}

.overview{@apply text-dark-100/95 text-sm mr-3 mb-2 }
.overview h1{@apply font-bold}

.pads{@apply px-4 xsm:px-7 py-4}
</style>