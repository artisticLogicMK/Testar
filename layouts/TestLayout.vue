<script setup>
import {v4 as uuidv4} from 'uuid'

const { id } = useRoute().params

const supabase = useSupabaseClient() //init spb client

const userAuth = useUser() //user Auth data

const test = ref(null)

const ptpCount = ref('')

const openPublishMdl = ref(false)

const makingCopy = ref(false)

const testLinkPrefix = takeTestUrl

const alertData = ref({ is: false, type: null, msg: null })

//action to copy the link of a test
const copyLink = link => {
    if (copyTestLink(link)) {
        alertData.value = { is: true, type: 'success', msg: 'Link Copied!' }
    }
}

//action to star test
const starTest = async (testId, state) => {
  const { data, error } = await supabase.from('tests')
    .update({starred: state ? false : true})
    .eq('id', testId)
    .eq('user_id', userAuth.value.id)
    .select()

  if (data) {
    test.value.starred = state ? false : true
  }
}

//action to remove test
const removeTest = async (testId) => {
  if (confirm("Really want to delete this test? \nAll test questions and participants data will be gone too.")) {
    const { data, error } = await supabase.from('tests').delete().select()
      .eq('id', testId)
      .eq('user_id', userAuth.value.id)
      
      if (data) navigateTo('/dashboard')
  }
}


//create another copy of test
const makeCopy = async () => {
    makingCopy.value = true

    let testData = {...test.value}

    delete testData.id
    delete testData.title
    delete testData.created_at
    delete testData.updated_at
    delete testData.published
    delete testData.uuid
    delete testData.link
    delete testData.allow_close
    delete testData.close_time
    delete testData.close_time_raw
    delete testData.starred

    const { data: testD } = await supabase.from('tests')
        .insert({
            title: 'Copy_'+test.value.title,
            updated_at: new Date().toJSON(),
            uuid: uuidv4(),
            link: uuidv4(),
            ...testData
        })
        .select().single()

    if (testD) {
        //fetch test questions
        const { data: questions, count } = await supabase.from('questions').select('*', { count: 'exact' })
            .eq('test_id', test.value.uuid)
            .eq('user_id', userAuth.value.id)
            .order('timestamp', { ascending: true })

        if (questions) {
            questions.forEach( async (q, index) => {
                const { data } = await supabase.from('questions')
                    .insert({
                        data: q.data,
                        test_id: testD.uuid,
                        timestamp: Date.now(),
                        user_id: userAuth.value.id
                    })
                    .select().single()

                if (data && count === index + 1) navigateTo('/dashboard')
            })
        }
    }
}


const state = store()

const closePublish = () => {
    setTimeout(() => openPublishMdl.value = false, 1400)
}

onMounted( async () => {
    //fetch test data
    const { data: result, error } = await supabase.from('tests').select()
        .eq('user_id', useUser().value.id)
        .eq('uuid', id)
        .single()

    test.value = result

    //get no of questions
    const { count } = await supabase.from('questions').select('*', { count: 'exact' })
        .eq('test_id', id)
    state.questionCount.value = count

    //get no of participants
    const { count: pcount } = await supabase.from('participants')
        .select('*', { count: 'exact' })
        .eq('test_uuid', test.value.uuid)
        .eq('finished', true)

    ptpCount.value = pcount
})

</script>

<template>
<NuxtLayout name="dashboard-layout">

    <DashboardPublishNotice
        v-if="openPublishMdl"
        @closePublish="closePublish"
        :testId="test.id"
    />


    <div v-if="test">
        <div class="testNav relative flex justify-between items-center mx-3 mt-3 border-b" x-data="{openMenu: false}">

            <ul x-bind:class="openMenu ? 'scale-y-100' : 'scale-y-0 sm:scale-y-100'">
                <li v-if="!test.published" class="group">
                    <NuxtLink :to="'/dashboard/test-'+id">
                        <div><i class="la la-tasks"></i> <span>Info/Options</span></div>
                        <div class="group-hover:scale-x-100 origin-right"></div>
                    </NuxtLink>
                </li>
                <li v-if="!test.published" class="group">
                    <NuxtLink :to="'/dashboard/test-'+id+'/questions'">
                        <div>
                            <i class="la la-question-circle"></i> <span>Questions</span>
                            <span class="bdg">{{state.questionCount}}</span>
                        </div>
                        <div class="group-hover:scale-x-100 origin-left"></div>
                    </NuxtLink>
                </li>
                <li class="group">
                    <NuxtLink :to="'/dashboard/test-'+id+'/participants'">
                        <div><i class="la la-comments"></i>
                        <span>Participants</span> <span class="bdg">{{ptpCount}}</span></div>
                        <div class="group-hover:scale-x-100 origin-left"></div>
                    </NuxtLink>
                </li>
            </ul>

            <IconsBars v-if="!test.published" class="sm:hidden cursor-pointer" :color="'fill-neutral-400'" :size="27" x-on:click="openMenu = !openMenu" />

            <span v-else></span>

            <div class="flex items-center mb-1 sm:mb-auto">
                <button
                    v-if="!test.published"
                    @click="openPublishMdl = true"
                    class="tlbtns"
                >
                    Publish
                </button>
                <button
                    v-else
                    @click="makeCopy"
                    class="tlbtns"
                    :disabled="makingCopy"
                >
                    Make a Copy <i v-if="makingCopy" class="la la-spinner la-pulse"></i>
                </button>

                <div class="relative" x-data="{moreMenu: false}">
                    <div class="actions" x-on:click="moreMenu = !moreMenu">
                        <IconsEllipsesV :color="'fill-neutral-500'" :size="25" />
                    </div>
                    
                    <div
                        class="tTp w-28 absolute top-full right-0 z-20 mt-1 bg-white rounded-md border shadow-md overflow-hidden origin-top duration-200 scale-y-0 group-hover:scale-y-100"
                        x-bind:class="moreMenu ? 'scale-y-100' : 'scale-y-0'"
                        x-on:mouseleave="moreMenu = false"
                    >
                        <button class="copybtn" :data-clipboard-text="test.published ? takeTestUrl+test.link : 'The test is not published.'">
                            <i class="la la-link"></i> Copy Link
                        </button>

                        <button @click="starTest(test.id, test.starred)">
                            <i class="lar la-star" :class="{'text-yellow-500': test.starred}"></i> Star
                        </button>

                        <button @click="removeTest(test.id)"><i class="lar la-trash-alt"></i> Remove</button>
                    </div>
                </div>
            </div>

        </div>

        <div v-if="test.published" class="text-neutral-500/80 text-sm px-5 py-2">
            This test has been published, and cannot be modified.
        </div>

        <slot />

        
    </div>

    <DashboardLoader v-else />
</NuxtLayout>
</template>

<style>
.testNav ul{@apply block sm:flex absolute top-full z-20 sm:static -mt-1 sm:mt-auto bg-white border rounded-md shadow-md sm:border-none sm:shadow-none origin-top duration-200}
.testNav ul li{@apply border-b sm:border-none overflow-hidden cursor-pointer }
.testNav ul li i{@apply text-lg mr-1 }
.testNav ul li div:first-child{@apply flex items-center p-2 text-sm text-neutral-600/90 active:bg-neutral-100 }
.testNav ul li div:first-child .bdg{@apply flex justify-center items-center bg-cyan-400 text-white font-semibold px-1.5 py-0 ml-1 rounded-full shadow-md}
.testNav ul li div:nth-child(2){@apply h-[2px] w-full bg-cyan-400 scale-x-0 duration-200 }

.testNav ul li a.router-link-exact-active div:first-child{@apply bg-neutral-50}
.testNav ul li a.router-link-exact-active div:nth-child(2){@apply scale-x-100 }

.testNav .actions{@apply btnEffect round after:bg-neutral-200 flex items-center justify-center rounded-full px-1.5 py-1.5 ml-1 hover:bg-neutral-100 cursor-pointer }

.tTp button{@apply flex items-center text-sm text-neutral-700 px-2 py-1.5 w-full border-b  last:border-none border-neutral-100 hover:bg-neutral-50/80}
.tTp button i{@apply mr-1 }

.btnEffect{@apply relative overflow-hidden after:bg-white/40 after:-translate-x-full hover:after:translate-x-full after:duration-500 after:absolute after:left-0 after:top-0 after:origin-left after:w-full after:h-full after:text-transparent active:after:translate-x-0 active:after:duration-[0s]; }
.btnEffect.round{@apply after:rounded-full; }
.btnEffect i, .btnEffect span, .btnEffect svg {@apply relative z-[9]; }

.tlbtns{@apply btnEffect bg-gradient-to-r from-cyan-400 to-cyan-500 text-white text-sm font-semibold rounded-md px-2.5 py-1 mr-1}
</style>