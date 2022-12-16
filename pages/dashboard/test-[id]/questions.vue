<script setup>
definePageMeta({
  middleware: ['authenticated', 'test-exists']
})

const { id } = useRoute().params

const supabase = useSupabaseClient() //init spb client

const userAuth = useUser() //user Auth data

const test = ref(null)

const questions = ref(null)

const question = ref(null)

const questionLoader = ref(false)

const openQ = ref(false) //question lis nav toggle

const newBtn = ref(false)

//image upld states
const imageMsg = ref(null)
const uploadLoader = ref(false)
const imageDisplay = ref(null)


const state = store()

const createQuestion = async () => {
    if (questions.value && questions.value.length <= 49) {
        newBtn.value = true
        questionLoader.value = true //init loading

        const { data, error } = await supabase.from('questions')
            .insert({
                user_id: userAuth.value.id,
                test_id: id,
                timestamp: Date.now()
            })
            .select()
            .single()

        if (data) {
            question.value = data
            questions.value.push({id: data.id, timestamp: data.timestamp, text: data.data.text})
            imageDisplay.value = storagePrefix+data.data.image+'?r='+Math.random()

            questionLoader.value = false

            state.questionCount.value = questions.value.length //update q count on tab

            newBtn.value = false

            document.querySelector('#questions').scroll({ top: 3000 })
        }
    }
    else {
        alert('You cannot create more than 50 questions.')
    }
}


//fetch single question data
const fetchQuestion = async (qid) => {
    questionLoader.value = true //init loading

    const { data, error } = await supabase.from('questions')
        .select()
        .eq('id', qid)
        .eq('user_id', userAuth.value.id)
        .eq('test_id', id)
        .single()

    if (data) {
        question.value = data
        questionLoader.value = false
        imageDisplay.value = storagePrefix+data.data.image+'?r='+Math.random()
    }
}


//delete a question
const delQuestion = async (qid) => {
    if(confirm('Sure to delete this question?')) { 
        questionLoader.value = true //init loading

        const { data, error } = await supabase.from('questions').delete()
            .eq('id', qid)
            .eq('user_id', userAuth.value.id)
            .eq('test_id', id)
            .select().single()

        if (data) {
            if (question.value && qid === question.value.id) question.value = null
            questions.value = questions.value.filter(q => q.id !== qid)

            state.questionCount.value = questions.value.length //update q count on tab
            questionLoader.value = false
        }
    }
}


//image upload
const qImage = async image => {
    imageMsg.value = null

    if (image.size < 1050000 && (image.type === "image/png" || image.type === "image/jpeg" || image.type === "image/svg+xml")) {
        uploadLoader.value = true//initialize loader

        const reader = new FileReader
        reader.onload = async e => {
            imageDisplay.value = await e.target.result
        }
        reader.readAsDataURL(image)

        //upload to server
        const path = 'question_images/question_images_'+question.value.uuid+'.png'
        const { data, error } = await supabase
            .storage
            .from('testar')
            .upload(path, image, {
                cacheControl: '3600',
                upsert: true
            })

        if (data) {
            //to trigger change
            question.value.data.image = data.path
            uploadLoader.value = false
            imageMsg.value = ''
        }
    }
    else {
        imageMsg.value = 'Image size, 1MB max. Allows png, jpg/jpeg or svg.'
    }
}

onMounted( async () => {
    const { data: fetchtest } = await supabase.from('tests').select('uuid, published')
        .eq('uuid', id)
        .single()

    test.value = fetchtest

    if(fetchtest) {
        //fetch all test questions
        const { data: result } = await supabase.from('questions')
            .select('id, timestamp, data->text')
            .eq('user_id', userAuth.value.id)
            .eq('test_id', id)
            .order('timestamp', { ascending: true })

        if (result) questions.value = result


        //watch changes in current question and update
        watch(() => question.value, async (newVal, oldVal) => {
        if (question.value) {
            const { data, error } = await supabase.from('questions')
                .update({user_id: userAuth.value.id, test_id: id, data: question.value.data})
                .eq('id', question.value.id)
                .eq('user_id', userAuth.value.id)
                .eq('test_id', id)
                .select().single()
                
            if (data) {
                //find n replace question text in list
                const index = questions.value.findIndex(q => q.id === question.value.id)
                if (index !== -1) questions.value[index].text = question.value.data.text.substring(0, 50)
            }

        }
    }, { deep: true })
    }
})


//input text for options
const qInputs = (el, data = null) => {
   if (data) question.value.data.options[data] = {type: 'text', data: el.target.value}

    el.target.style.height = data ? "38px" : "0px"
    let scHeight = el.target.scrollHeight;
    el.target.style.height = `${scHeight}px`
}

const storagePrefix = spbStorageUrl

//animations
const slideUp = (el) => {
  slideInUpAnim(el, false)
}

const slideUpSelf = (el) => {
  slideInUpAnim(el, true)
}
</script>

<template>
    <Head>
        <Title>Questions | Testar</Title>
    </Head>

    <NuxtLayout name="test-layout">

        <div v-if="test && !test.published" class="flex relative overflow-hidden">

           <div
            class="absolute top-0 left-0 z-10 md:relative w-full md:translate-x-0 md:block md:max-w-[280px] lg:min-w-[300px] lg:max-w-sm h-full md:h-[80vh] bg-neutral-100 pb-16 duration-300"
            :class="openQ ? 'flex translate-x-0' : ' md:block -translate-x-full md:translate-x-0'"
        >
                <div id="questions" class="w-full h-full border-r px-2 pb-16 overflow-y-auto">
                    <div class="flex items-center justify-between mb-1">
                        <div class="relative flex items-center font-semibold text-neutral-400 text-lg my-2">
                            Questions

                            <div class="group ml-1 inline-block">
                                <IconsQuestionMark :color="'fill-neutral-400'" :size="22" class="-mt-0.5 cursor-pointer" />

                                <div class="absolute top-full left-0 min-w-[250px] max-w-[300px] bg-white border rounded-md p-2 text-sm text-neutral-500 font-normal shadow-md hidden group-hover:block">
                                    Questions are ordered from old(top) to new(bottom); you can re-order them by dragging a question by the icon on the right side.
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center">
                            <button
                                @click="createQuestion"
                                :disabled="newBtn"
                                class="btnEffect bg-cyan-400 text-white text-sm font-semibold px-2 py-1 rounded-md"
                            >
                                <span>New</span> <i class="la la-plus"></i>
                            </button>

                            <IconsClose
                                @click="openQ = false"
                                :color="'fill-neutral-600'" :size="35" class="ml-1 md:hidden cursor-pointer"
                            />
                        </div>
                    </div>

                    <transition appear @enter="slideUp">
                        <div v-if="questions && questions.length > 0">
                            <div
                                v-for="q in questions"
                                :key="q.id"
                                @click="() => {
                                    openQ = false
                                    q.id !== question?.id ? fetchQuestion(q.id) : null
                                }"
                                class="qlist"
                                :class="{'border border-cyan-400': q.id === question?.id}"
                            >
                                <div>
                                    <p>{{q.text.substring(0, 50)}}</p>
                                </div>

                                <div class="group shrink-0 mx-1 cursor-pointer">
                                    <IconsTrash @click.stop="delQuestion(q.id)" :color="'fill-neutral-400/80 group-hover:fill-red-400'" :size="25" />
                                </div>
                            </div>
                        </div>
                    </transition>

                    <div v-if="questions && !questions.length" class="text-2xl font-bold text-stone-400/70 text-center mt-10 px-3">
                        Create a question to get started
                    </div>

                    <div v-if="!questions" class="text-center">
                        <IconsLoader class="animate-spin mt-20" :color="'fill-neutral-400/80'" :size="45" />
                    </div>
                </div>

                <div class="bg-gradient-to-b from-transparent to-white absolute bottom-0 left-0 w-full h-16"></div>
           </div>





            <div class="grow">
                <div class="flex items-center justify-between w-full bg-neutral-100 px-3 py-1.5 text-neutral-500 text-base font-semibold border-b">
                    <p>
                        Customize
                        <IconsLoader v-if="questionLoader" class="animate-spin ml-2" :color="'fill-neutral-500'" :size="22" />
                    </p>

                    <div class="flex items-center">
                        <button
                            class="md:hidden btnEffect bg-cyan-400 text-white text-sm font-semibold rounded-md px-3 py-1.5 mr-1"
                            @click="openQ = true"
                        >
                            <span>Questions</span>
                        </button>

                        <button
                            v-if="question"
                            @click="delQuestion(question.id)"
                            class="btnEffect bg-neutral-400 text-white text-sm font-semibold rounded-md px-3 py-1"
                        >
                            <span class="hidden xsm:inline">Delete</span> <i class="la la-trash-alt text-base"></i>
                        </button>
                    </div>
                </div>


                <div v-if="!question" class="w-full my-36 px-3 text-center text-neutral-400/50 font-bold text-3xl">Select a question to Customize.</div>


                <transition appear @enter="slideUp">
                    <div v-if="question">
                        <div class="flex flex-col p-3">
                            <div
                                class="items inline-block w-full max-w-sm"
                                :class="{'order-2': question.data.first}"
                            >
                                <textarea class="w-full min-h-[110px]" rows="4" maxlength="400" placeholder="Question text (max: 400 chars)" v-model="question.data.text" @input="qInputs($event)"></textarea>
                            </div>

                            <div
                                v-if="question.data.image"
                                class="items flex w-fit"
                                :class="{'order-1': question.data.first}"
                            >
                                <div class="floats">
                                    <button @click="() => {
                                        question.data.image = null
                                        question.data.first = false
                                    }">
                                        <i class="la la-times"></i>
                                    </button>
                                    <button @click="question.data.first = !question.data.first">
                                        <i class="la la-exchange-alt la-rotate-90"></i>
                                    </button>
                                </div>

                                <div
                                    class="bg-[length:100%_100%] bg-center h-fit w-fit rounded-md"
                                    :style="'background-image: url('+imageDisplay+')'"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="w-full" viewBox="0 0 10 6"></svg>
                                </div>
                            </div>

                            <div v-if="!question.data.image" class="text-center mt-3.5">
                                <p v-if="imageMsg" class="text-sm text-red-500 mb-3">{{imageMsg}}</p>
                                <label for="img" class="border-[3px] border-dashed border-neutral-300 rounded-md text-neutral-500 px-3 py-1 cursor-pointer w-fit mx-auto">
                                    Add Image
                                    <input type="file" accept=".png, .jpg, .jpeg, .svg" id="img" class="hidden" @input="qImage($event.target.files[0])">
                                    <i class="la la-spin la-spinner" v-if="uploadLoader"></i>
                                </label>
                            </div>
                        </div>



                        <div class="p-3 border-t mt-2">
                            <div class="text-neutral-500/90">
                                <p class=" font-semibold text-base">Test Options</p>
                                <p class="text-sm">To specify a correct answer, click on the option letter.</p>
                            </div>

                            <div class="mt-2">
                                <div
                                    v-for="alpha in ['a','b','c','d']"
                                    :key="alpha"
                                    class="options flex items-start w-full"
                                >
                                    <button
                                        @click="question.data.answer = alpha"
                                        :class="{'active': question.data.answer === alpha}"
                                        class="letters capitalize active:scale-125 duration-200"
                                    >
                                        {{alpha.toUpperCase()}}
                                    </button>

                                    <div class="grow">
                                        <textarea
                                            @input="qInputs($event, alpha)"
                                            v-model="question.data.options[alpha].data"
                                            rows="1" class="w-full border-0 border-b rounded-none text-base p-1 mb-0" placeholder="Option text..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </transition>

            </div>

        </div>

    </NuxtLayout>
</template>

<style>
.qlist{@apply flex items-center bg-white py-2 px-2 border-b rounded-md mb-2 cursor-pointer hover:duration-200 hover:shadow-md }
.qlist div:first-child{@apply grow truncate }
.qlist div:first-child p{@apply truncate text-sm text-neutral-500/80 font-semibold }

.items{@apply relative mx-auto mb-2 }
.items .floats{@apply absolute left-0 sm:left-full top-0 sm:top-2 mb-2 }
.items .floats button{@apply bg-cyan-400 text-white text-lg px-1.5 border-r sm:border-b hover:bg-cyan-500 }

.options{@apply mb-7 }
.options .letters{@apply text-neutral-300 border-[3px] rounded-full text-2xl font-bold px-2 border-neutral-300 hover:bg-neutral-100/80 duration-300 mr-2}
.options .letters.active{@apply border-cyan-400 text-cyan-400 }
.options .type{@apply bg-neutral-100 text-neutral-500 border text-sm font-semibold rounded-sm px-2 py-1 mr-2 hover:bg-neutral-200 cursor-pointer}
</style>