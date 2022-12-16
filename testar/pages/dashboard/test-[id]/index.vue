<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated', 'test-exists']
})

const range = ref(40)

onMounted(() => {
    
})
</script>

<template>
  <Head>
    <Title>Testar | Untitled Test</Title>
  </Head>

  <NuxtLayout name="test-layout">


    <div class="sm:mt-4">

        <div class="testDscr">
            <div class="cols">
                <p class="title">Title</p>
                <p class="descri">Allows a maximum length of 30 characters.</p>
            </div>
            <div class="cols">
                <div class="flex justify-end items-center text-sm text-neutral-600 mb-2">
                    Category/tag: <input type="text" class="text-sm px-1 py-0.5 rounded-sm ml-1">
                </div>

                <input type="text" class="w-full" value="untitled test">
            </div>
        </div>

        <div class="testDscr">
            <div class="cols">
                <p class="title">Description</p>
                <p class="descri">Allows a maximum length of 600 characters.</p>
            </div>
            <div class="cols">
                <textarea class="w-full" rows="6"></textarea>
            </div>
        </div>

        <div class="testDscr">
            <div class="cols">
                <p class="title">Test Cover/Thumbnail</p>
                <p class="descri">Use a portrait or landscape image.</p>
            </div>
            <div class="cols flex">
                <img src="https://images.unsplash.com/photo-1669236132582-67d039f7fb7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" class="h-20 rounded-md mr-2">
                <div class="grow flex items-center justify-center border-2 border-dashed border-neutral-200 rounded-md px-2 text-xs text-neutral-500 cursor-pointer">
                    <div class="text-center">
                        <IconsImageAdd :color="'fill-neutral-300'" :size="40" />
                        <p>Drop or select image</p>
                        <p>JPEG, PNG</p>
                    </div>
                </div>
            </div>
        </div>


        <div class="testDscr">
            <div class="cols">
                <p class="title">Give a time for the test.</p>
            </div>
            <div class="cols flex flex-wrap items-end">
                <div class="mr-2 flex-1">
                    <p class="descri">Hour</p>
                    <input type="number" maxlength="2" max="3" class="w-full">
                </div>
                <div class="mr-2 flex-1">
                    <p class="descri">Minute</p>
                    <input type="number" maxlength="2" max="60" class="w-full">
                </div>
                <button class="bg-cyan-400 rounded-md text-sm font-bold text-white px-4 py-2">Set</button>
            </div>
        </div>


        <div class="testDscr">
            <div class="cols">
                <p class="title">Allow participants to see their score & rank after test?</p>
                <p class="descri">Note that each of your questions carries the same number of points or percentage. If you ask five questions, then the point per question is 100 divided by 5, which is 20; this signifies that each question has a weighted average of 20% of the total 100%. </p>
            </div>
            <div class="cols">
                <i class="la la-toggle-on cp text-cyan-400 text-5xl"></i>
            </div>
        </div>


        <div class="testDscr">
            <div class="cols">
                <p class="title">Tell the participants whether they passed or failed the test?</p>
            </div>
            <div class="cols">
                <i class="la la-toggle-on cp text-cyan-400 text-5xl"></i>

                <div>
                    <p class="descri">Set a passing score for the test.</p>
                    <div class="flex items-center">
                        <div class="mr-2 text-lg font-bold text-cyan-500">{{range}}%</div>
                        <input type="range" min="20" max="80" step="1" v-model="range"   class="grow appearance-none h-1.5 bg-cyan-100 border-none">
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
                <i class="la la-toggle-on cp text-cyan-400 text-5xl"></i>

                <div>
                    <p class="descri mb-2">Select information of people to collect. Minimum of 3.</p>
                    <div class="flex flex-wrap mb-1">
                        <button class="detailsBtns relative group"
                            v-for="detail in [
                                {type: 'Name', icon: 'la-user'},
                                {type: 'Gender', icon: 'la-female'},
                                {type: 'Picture', icon: 'la-image'},
                                {type: 'Email', icon: 'la-envelope'},
                                {type: 'About', icon: 'la-id-badge'},
                                {type: 'Location', icon: 'la-map-marker'},
                                {type: 'Phone', icon: 'la-phone-alt'},
                                {type: 'Age', icon: 'la-seedling'},
                                {type: 'Marrital Status', icon: 'la-ring'},
                                {type: 'Language', icon: 'la-language'},
                                {type: 'Beliefs', icon: 'la-fist-raised'},
                                {type: 'Profession', icon: 'la-tools'},
                                {type: 'Education', icon: 'la-school' },
                            ]"
                            :key="detail"
                        >
                            <i class="la" :class="detail.icon"></i> {{detail.type}}

                            <div
                                class="dropdown group-active:duration-[0ms] group-active:scale-y-0"
                            >
                                <div>
                                    Required
                                </div>
                                <div>
                                    Optional
                                </div>
                            </div>
                        </button>

                        <button class="detailsBtns border-dashed border-neutral-700 bg-neutral-50"><i class="la la-plus"></i> Add</button>
                    </div>

                    <div class=" max-w-sm px-3 py-2 rounded-md border shadow-sm">
                        <p class="text-sm text-neutral-500 font-bold mb-0.5">Add a custom information.</p>
                        <input type="text" placeholder="Whats it called.." class="w-full mb-2">
                        <br/>
                        <select placeholder="Type..." class="w-full mb-2">
                            <option value="">Type</option>
                            <option value="input">Input field (one line)</option>
                            <option value="textarea">Text area (wider)</option>
                        </select>

                        <div class="text-sm text-neutral-700">
                            <input type="radio" name="opt"> Is it required?
                            <br/>
                            <input type="radio" name="opt"> Is it optional?
                        </div>

                        <button class="bg-cyan-400 rounded-md text-sm font-bold text-white px-4 py-1.5 my-1.5">Add</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="testDscr">
            <div class="cols">
                <p class="title">Specify a deadline at which the test should end?</p>
                <p class="descri">When the specified time is reached, the test will be automatically closed.</p>
            </div>
            <div class="cols">
                <i class="la la-toggle-on cp text-cyan-400 text-5xl"></i>
                <input type="datetime-local" class="w-full" value="untitled test">
            </div>
        </div>

    </div>

  </NuxtLayout>
</template>


<style>
.testDscr{@apply flex flex-col md:flex-row py-5 border-b border-neutral-100 }
.testDscr .cols{@apply flex-1 px-2 }
.testDscr .cols:first-child{@apply mb-2 md:mb-auto }
.testDscr .cols .title{@apply text-neutral-600 text-base font-semibold  }
.testDscr .cols .descri{@apply text-neutral-600/90 text-sm }

.detailsBtns{@apply flex items-center rounded-md border text-sm text-neutral-600 px-2 py-1 shadow-sm hover:bg-neutral-50 mr-3 mb-2 }
.detailsBtns i{@apply text-lg mr-1 }
</style>