<script setup>
const pr = defineProps({data: Object})

const infos = Object.entries(pr.data)
</script>


<template>
    <div class="fixed overflow-auto z-[999] bg-black/20 top-0 left-0 w-full h-full table">
        <transition appear enter-active-class="ans an-zoomIn an-faster">
            <div class="table-cell align-middle text-center w-full px-3">
                
                <div class="relative max-h-[80vh] w-full xsm:max-w-md sm:min-w-[350px] overflow-auto bg-white inline-block border rounded-md p-3 text-start shadow-md my-3 mx-auto">
                    
                    <i
                        @click="$emit('closeInfo')"
                        class="la la-times absolute top-1 right-3 text-neutral-500 text-xl cursor-pointer active:scale-125"
                    ></i>

                    <p class="text-sm text-nenutral-400 font-semibold">Participant Info</p>

                    <div v-if="infos.length" class="flex flex-wrap">

                        <div v-for="[name, val] in infos" :key="name" class="info mr-5 mt-4">
                            <p class="capitalize">{{name}}</p>
                            <p>{{val}}</p>
                        </div>

                    </div>

                    <div v-else class="text-2xl font-bold text-neutral-300 py-10">
                        No data...
                    </div>
                </div>

            </div>
        </transition>
    </div>
</template>