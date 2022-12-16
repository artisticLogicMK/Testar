<script setup>
definePageMeta({
  middleware: ['authenticated', 'test-exists']
})

const { id: testId } = useRoute().params //get testId from param

const supabase = useSupabaseClient() //init spb client

const userAuth = useUser() //user Auth data

const test = ref(null)

//participants info collection states
const infoBtns = ref(null)
const details = ref([
    {type: 'name', icon: 'la-user'},
    {type: 'email', icon: 'la-envelope'},
    {type: 'phone', icon: 'la-phone-alt'},
    {type: 'about', icon: 'la-id-badge'},
    {type: 'gender', icon: 'la-female'},
    {type: 'age', icon: 'la-seedling'},
    {type: 'location', icon: 'la-map-marker'},
    {type: 'profession', icon: 'la-tools'},
    {type: 'beliefs', icon: 'la-fist-raised'},
    {type: 'marritalStatus', icon: 'la-ring'},
    {type: 'language', icon: 'la-language'},
    {type: 'education', icon: 'la-school' },
])
const customDetail = ref({
    name: '',
    fieldType: '',
    required: null
})

const categories = testCategories //get test categories

//all on upload test cover
const imageDisplay = ref(null) //image preview
const uploadLoader = ref(false)
const imageMsg = ref(null)

const uploadCover = async image => {
    imageMsg.value = null

    if (image.size < 1050000 && (image.type === "image/png" || image.type === "image/jpeg" || image.type === "image/svg+xml")) {
        uploadLoader.value = true//initialize loader

        const reader = new FileReader
        reader.onload = async e => {
            imageDisplay.value = await e.target.result
        }
        reader.readAsDataURL(image)

        //upload to server
        const path = 'test_covers/'+test.value.uuid+'.png'
        const { data, error } = await supabase
            .storage
            .from('testar')
            .upload(path, image, {
                cacheControl: '3600',
                upsert: true
            })

        const uploadPath = data.path

        if (data) {
            //test.value.cover = ''//to trigger change
            test.value.cover = uploadPath
            uploadLoader.value = false
            imageMsg.value = 'Cover Updated Successfully'
        }
    }
    else {
        imageMsg.value = 'Image size, 1MB max. Image type allows png, jpg/jpeg or svg.'
    }
}


onMounted( async () => {
    const { data: result, error } = await supabase.from('tests').select()
        .eq('user_id', useUser().value.id)
        .eq('uuid', testId)
        .single()

        test.value = result

    
    //and now... the climax; watch for change and update entire test..
    watch(test.value, async () => {
        const { data, error } = await supabase.from('tests')
            .update({
                title : test.value.title,
                description: test.value.description,
                cover : test.value.cover,
                category : test.value.category ?? 'Others',
                specify_time : test.value.specify_time,
                timeframe : test.value.timeframe,
                see_score : test.value.see_score,
                see_pass : test.value.see_pass,
                pass_range : test.value.pass_range,
                fill_info : test.value.fill_info,
                infos : test.value.infos,
                allow_close : test.value.allow_close,
                close_time : test.value.close_time,
                close_time_raw : test.value.close_time_raw,
                updated_at: new Date().toJSON()
            })
            .eq('user_id', useUser().value.id)
            .eq('uuid', testId)
    })


    //set test cover to default image upload preview
    imageDisplay.value =  storagePrefix+test.value.cover+'?r='+Math.random()

})

const storagePrefix = spbStorageUrl
</script>

<template>
  <Head>
    <Title>{{test ? test.title : ''}} | Testar</Title>
  </Head>

  <NuxtLayout name="test-layout">


    <div v-if="test && !test.published" class="sm:mt-4">
        <div class="testDscr">
            <div class="cols">
                <p class="title">Title</p>
                <p class="descri">Allows a maximum length of 30 characters.</p>
            </div>
            <div class="cols">
                <input type="text" class="w-full" maxlength="60" v-model="test.title">
                <div class="text-sm text-neutral-500 text-end">{{test.title ? test.title.length : ''}}/60</div>

                <div class="flex justify-end items-center text-sm text-neutral-600 mt-2">
                    Category/tag:
                    <select type="text" v-model="test.category" class="text-sm px-1 py-0.5 rounded-sm ml-1">
                        <option :value="null">Select Category</option>
                        <option
                            v-for="category in categories"
                            :key="category.key"
                            :value="category.name"
                        >{{category.name}}</option>
                    </select>
                </div>
            </div>
        </div>




        <div class="testDscr">
            <div class="cols">
                <p class="title">Description</p>
                <p class="descri">Allows a maximum length of 500 characters.</p>
            </div>
            <div class="cols">
                <textarea class="w-full" rows="6" maxlength="500" v-model="test.description"></textarea>
                <div class="text-sm text-neutral-500 text-end">{{test.description ? test.description.length : ''}}/500</div>
            </div>
        </div>




        <div class="testDscr">
            <div class="cols">
                <p class="title">Test Cover/Thumbnail</p>
                <p class="descri">Use a landscape image.</p>
            </div>
            <div class="cols">
                <p v-if="imageMsg" class="text-sm text-neutral-500/90 mb-2">{{imageMsg}}</p>
                <div class="flex">
                    <div v-if="test.cover" class="bg-[length:100%_100%] bg-center h-20 w-[130px] rounded-md border mr-2" :style="'background-image: url('+imageDisplay+')'"></div>

                    <label class="grow relative flex items-center justify-center h-20 border-2 border-dashed border-neutral-200 rounded-md text-xs text-neutral-500 cursor-pointer" for="cover">
                        <div class="absolute z-[5] mx-2 w-full text-center">
                            <IconsLoader v-if="uploadLoader" class="animate-spin" :color="'fill-neutral-300'" :size="35" />
                            <IconsImageAdd v-else :color="'fill-neutral-300'" :size="35" />
                            <p>Drop or select image</p>
                            <p>JPEG, PNG, SVG</p>
                        </div>

                        <input
                            @input="uploadCover($event.target.files[0])"
                            accept=".png, .jpg, .jpeg, .svg" type="file" id="cover" class="relative z-10 appearance-none h-full w-full border-none file:bg-transparent file:border-none file:text-transparent text-transparent bg-transparent cursor-pointer"
                        >
                    </label>
                </div>
            </div>
        </div>



        <div class="testDscr">
            <div class="cols">
                <p class="title">Give a time for the test.</p>
            </div>
            <div class="cols">
                <i
                    @click="test.specify_time = !test.specify_time"
                    class="la la-toggle-on cursor-pointer text-5xl"
                    :class="test.specify_time ? 'text-cyan-400' : 'la-flip-horizontal text-neutral-300'"
                ></i>
                
                <div v-if="test.specify_time" class="flex flex-wrap items-end">
                    <div class="mr-2 flex-1">
                        <p class="descri">Hour</p>
                        <select v-model="test.timeframe.hour" class="w-full">
                            <option :value="null"></option>
                            <option
                                v-for="(min, i) in Array(10)"
                                :key="i"
                                :value="i+1"
                            >
                                {{i+1}}
                            </option>
                        </select>
                    </div>
                    <div class="flex-1">
                        <p class="descri">Minute</p>
                        <select v-model="test.timeframe.min" class="w-full">
                            <option :value="null"></option>
                            <option
                                v-for="(min, i) in Array(60)"
                                :key="i"
                                :value="i+1"
                            >
                                {{i+1}}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
        </div>



        <div class="testDscr">
            <div class="cols">
                <p class="title">Allow participants to see their score & rank after test?</p>
                <p class="descri mb-2">If this option is disabled, participants will only see a confirmation of the test's completion; the test result will not be displayed.</p>
                <p class="descri">Note that each of your questions carries the same number of points or percentage. If you ask five questions, then the point per question is 100 divided by 5, which is 20; this signifies that each question has a weighted average of 20% of the total 100%. </p>
            </div>
            <div class="cols">
                <i
                    @click="test.see_score = !test.see_score"
                    class="la la-toggle-on cursor-pointer text-5xl"
                    :class="test.see_score ? 'text-cyan-400' : 'la-flip-horizontal text-neutral-300'"
                ></i>
            </div>
        </div>




        <div v-if="test.see_score" class="testDscr">
            <div class="cols">
                <p class="title">Tell the participants whether they passed or failed the test?</p>
            </div>
            <div class="cols">
                <i
                    @click="test.see_pass = !test.see_pass"
                    class="la la-toggle-on cursor-pointer text-5xl"
                    :class="test.see_pass ? 'text-cyan-400' : 'la-flip-horizontal text-neutral-300'"
                ></i>

                <div v-if="test.see_pass">
                    <p class="descri">Set a passing score for the test.</p>
                    <div class="flex items-center">
                        <div class="mr-2 text-lg font-bold text-cyan-500">{{test.pass_range}}%</div>
                        <input type="range" min="20" max="80" step="1" v-model="test.pass_range"   class="grow appearance-none h-1.5 bg-cyan-100 border-none">
                    </div>
                </div>
            </div>
        </div>




        <div class="testDscr">
            <div class="cols">
                <p class="title">Allow people to fill in information before attempting test?</p>
                <p class="descri">If off, the test will be taken anonymously.</p>
            </div>
            <div class="cols">
                <i
                    @click="test.fill_info = !test.fill_info"
                    class="la la-toggle-on cursor-pointer text-5xl"
                    :class="test.fill_info ? 'text-cyan-400' : 'la-flip-horizontal text-neutral-300'"
                ></i>

                <div v-if="test.fill_info" x-data="{addInfo: false}">
                    <p class="descri mb-2">Select the information of participants you want to collect.</p>
                    <div class="flex flex-wrap mb-1">
                        <button
                            class="detailsBtns relative"
                            v-for="(detail,i) in details"
                            :key="detail"
                            :class="{'bg-neutral-100 border-transparent': test.infos[detail.type]}"
                            @click="() => {
                                if (test.infos[detail.type])
                                    delete test.infos[detail.type]
                                else
                                    infoBtns = i
                            }"
                        >
                            <i class="la" :class="detail.icon"></i> <span class="capitalize">{{detail.type}}</span>

                            <div
                                class="dropdown ch"
                                :class="infoBtns == i ? 'scale-y-100' : 'scale-y-0'"
                                 @mouseleave="infoBtns = null"
                            >
                                <div
                                    @click.stop="() => {
                                        test.infos[detail.type] = { required: true }
                                        infoBtns = null
                                    }"
                                >
                                    Required
                                </div>
                                <div
                                    @click.stop="() => {
                                        test.infos[detail.type] = { required: false }
                                        infoBtns = null
                                    }"
                                >
                                    Optional
                                </div>
                            </div>
                        </button>

                        <!--cancelled for next version
                        <button
                            v-if="false"
                            x-on:click="addInfo = !addInfo"
                            class="detailsBtns border-dashed border-neutral-700 bg-neutral-50"
                        >
                            <i class="la la-plus"></i> Add
                        </button>
                        -->
                    </div>

                    <!--everything in this element was cancelled for next version
                    <div x-show="addInfo" x-transition class="max-w-sm px-3 py-2 rounded-md border shadow-sm">
                        <p class="text-sm text-neutral-500 font-bold mb-0.5">Add a custom information.</p>
                        <input type="text" placeholder="Whats it called.." v-model="customDetail.name" class="w-full mb-2">
                        <br/>
                        <select placeholder="Type..." class="w-full mb-2" v-model="customDetail.fieldType">
                            <option value="">Type</option>
                            <option value="input">Input field (one line)</option>
                            <option value="textarea">Text area (wider)</option>
                        </select>

                        <div class="text-sm text-neutral-700">
                            <input type="radio" name="opt" :value="true" v-model="customDetail.required"> Is it required?
                            <br/>
                            <input type="radio" name="opt" :value="false" v-model="customDetail.required"> Is it optional?
                        </div>

                        <button class="bg-cyan-400 rounded-md text-sm font-bold text-white px-4 py-1.5 my-1.5"
                            @click="() => {
                            details.push({type: customDetail.name, custom: true})
                            test.infos[customDetail.name] = { required: customDetail.required, fieldType: customDetail.fieldType}
                            customDetail = {name:'',required:null,fieldType:''}
                            }"
                        >Add</button>
                    </div>
                    --->
                </div>
            </div>
        </div>



        <div class="testDscr">
            <div class="cols">
                <p class="title">Specify a deadline at which the test should end?</p>
                <p class="descri">When the specified time is reached, the test will be automatically closed.</p>
            </div>

            <div class="cols">
                <i
                    @click="test.allow_close = !test.allow_close"
                    class="la la-toggle-on cursor-pointer text-5xl"
                    :class="test.allow_close ? 'text-cyan-400' : 'la-flip-horizontal text-neutral-300'"
                ></i>

                <input
                    v-if="test.allow_close"
                    v-model="test.close_time_raw"
                    @input="test.close_time = new Date($event.target.value).getTime()"
                    type="datetime-local" min="1970-01-01T00:00:00" class="w-full"
                >
            </div>
        </div>

    </div>

    <DashboardLoader v-if="!test" />

  </NuxtLayout>
</template>


<style>
.testDscr{@apply flex flex-col md:flex-row py-5 border-b border-neutral-100 }
.testDscr .cols{@apply flex-1 px-2 }
.testDscr .cols:first-child{@apply mb-2 md:mb-auto }
.testDscr .cols .title{@apply text-neutral-600 text-sm sm:text-base font-semibold  }
.testDscr .cols .descri{@apply text-neutral-600/90 text-sm }

.detailsBtns{@apply flex items-center rounded-md border text-sm text-neutral-600 px-2 py-1 shadow-sm hover:bg-neutral-50 mr-3 mb-2 }
.detailsBtns i{@apply text-lg mr-1 }

.ch div{@apply w-full }
</style>