<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated', 'test-exists']
})
</script>

<template>
    <Head>
        <Title>Testar | Questions</Title>
    </Head>

    <NuxtLayout name="test-layout">

        <div class="flex relative" x-data="{openQ: false}">

           <div
            class="absolute top-0 left-0 z-10 md:relative w-full md:w-auto md:block md:max-w-[280px] lg:max-w-sm h-full md:h-[80vh] bg-neutral-100 pb-16"
            x-bind:class="openQ ? 'flex' : 'hidden md:block'"
        >
                <div class="w-full h-full border-r px-2 pb-16 overflow-y-auto">
                    <div class="flex items-center justify-between">
                        <p class="font-semibold text-neutral-400 text-lg my-2">Questions</p>

                        <div class="flex items-center">
                            <button class="btnEffect bg-cyan-400 text-white text-sm font-semibold px-2 py-1 rounded-md"><span>New</span> <i class="la la-plus"></i></button>

                            <IconsClose
                                x-on:click="openQ = false"
                                :color="'fill-neutral-600'" :size="35" class="ml-1 md:hidden cursor-pointer"
                            />
                        </div>
                    </div>

                    <div class="">
                        <div class="qlist" v-for="g in [1,2,3,4,5,6,7,8,9,1,2,3,4]">
                            <div>
                                <p>What is the farthest distance between the and the distance that helps none conformers</p>
                            </div>

                            <IconsDragMove class="shrink-0 mx-1 cursor-move" :color="'fill-neutral-400/80'" :size="27" />
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-b from-transparent to-white absolute bottom-0 left-0 w-full h-20"></div>
           </div>


            <div class="grow">
                <div class="flex items-center justify-between w-full bg-neutral-100 px-3 py-1.5 text-neutral-500 text-base font-semibold border-b">
                    <p>Customize</p>

                    <div class="flex items-center">
                        <button
                            class="md:hidden btnEffect bg-cyan-400 text-white text-sm font-semibold rounded-md px-3 py-1.5 mr-1"
                            x-on:click="openQ = true"
                        >
                            <span>Questions</span>
                        </button>

                        <button class="btnEffect bg-neutral-400 text-white text-sm font-semibold rounded-md px-3 py-1"><span class="hidden xsm:inline">Delete</span> <i class="la la-trash-alt text-base"></i></button>
                    </div>
                </div>

                <div class="p-3">
                    <div class="items max-w-sm">
                        <div class="floats">
                            <button><i class="la la-arrows-alt-v cursor-move"></i></button>
                        </div>
                        <textarea class="w-full" rows="4" placeholder="Question text"></textarea>
                    </div>
                    <div class="items w-fit">
                        <div class="floats">
                            <button><i class="la la-times"></i></button>
                            <button><i class="la la-arrows-alt-v cursor-move"></i></button>
                        </div>
                        <img src="https://images.unsplash.com/photo-1669236132582-67d039f7fb7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" class="h-48 rounded-md">
                    </div>

                    <div class="text-center mt-3.5">
                        <label for="img" class="border-[3px] border-dashed border-neutral-300 rounded-md text-neutral-500 px-3 py-1 cursor-pointer w-fit mx-auto">
                            Add Image
                            <input type="file" id="img" class="hidden">
                        </label>
                    </div>
                </div>


                <div class="p-3 border-t mt-2">
                    <div class="text-neutral-500/90">
                        <p class=" font-semibold text-base">Test Options</p>
                        <p class="text-sm">To specify a correct answer, click on the option letter.</p>
                    </div>

                    <div class="mt-2">
                        <div class="options flex items-center w-full mb-3" v-for="o in [A,B,C,D]">
                            <button class="letters">A</button>
                            <div class="">
                                <button class="type">Text <i class="la la-plus"></i></button>
                                <label class="type" for="timg">
                                    Image <i class="la la-plus"></i>
                                    <input type="file" id="timg" class="hidden">
                                </label>
                            </div>

                            <div class="grow hidden">
                                <textarea rows="1" class="w-full border-0 border-b-2 rounded-none text-base p-1 mb-0" placeholder="Option text..."></textarea>
                                <img src="https://images.unsplash.com/photo-1669236132582-67d039f7fb7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" class="h-28 rounded-sm">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-end border-t p-3">
                    <button class="btnEffect after:bg-white/40 bg-cyan-400 text-white text-base font-semibold rounded-md px-3 py-1"><span>Add Question</span></button>
                </div>
                
            </div>

        </div>

    </NuxtLayout>
</template>

<style>
.qlist{@apply flex items-center bg-white py-2 px-2 border-b rounded-md mb-2 cursor-pointer duration-300 hover:shadow-md }
.qlist div{@apply grow truncate }
.qlist div p{@apply truncate text-sm text-neutral-500/80 font-semibold }

.items{@apply relative mx-auto mb-2 }
.items .floats{@apply absolute left-full top-2 mb-2 }
.items .floats button{@apply bg-cyan-400 text-white text-lg px-1.5 border-b hover:bg-cyan-500 }

.options .letters{@apply text-neutral-500/50 border-[3px] rounded-full text-2xl font-bold px-2 border-neutral-500/50 hover:bg-neutral-100/80 duration-300 mr-2}
.options .letters.active{@apply border-cyan-400 text-cyan-400 }
.options .type{@apply bg-neutral-100 text-neutral-500 border text-sm font-semibold rounded-sm px-2 py-1 mr-2 hover:bg-neutral-200 cursor-pointer}
</style>