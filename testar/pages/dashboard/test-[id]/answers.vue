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

        <div class="bg-white border rounded-lg my-4 shadow-sm">

            <div class="xsm:flex items-center justify-between p-3">
                <div class="text-neutral-600 py-3 mr-2">
                    <p class="text-base font-semibold">Participants</p>
                    <p class="text-sm">This is a list of all the participants who have taken this test.</p>
                </div>

                
                <div class="flex items-center bg-neutral-50 text-neutral-500 border rounded-md px-2 py-1">
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
                        <th class="relative hidden xsm:table-cell"><i class="la la-stopwatch absolute top-2 text-xl"></i></th>
                        <th>Info</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="o in [1,1,1,1,1,1,1,1,1,1,1,1,1]">
                        <td>
                            <div class="text-sm text-neutral-400 font-bold">4</div>
                        </td>
                        <td>12 June, 2021</td>
                        <td>
                            <div class="text-sm text-neutral-500/90 font-bold">59%</div>
                        </td>
                        <td>
                            <span class="text-green-500 text-xs border border-green-400 rounded-full px-2 hidden">Yes</span>
                            <span class="text-red-500 text-xs border border-red-400 rounded-full px-2">No</span>
                        </td>
                        <td class="hidden xsm:table-cell">23m</td>
                        <td class="relative">
                            <IconsEllipsesH class="absolute top-2.5 active:scale-x-125 cursor-pointer" :color="'fill-neutral-500'" :size="25" />
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
        

        <div class="hidden fixed overflow-auto z-10 bg-black/20 top-0 left-0 w-full h-full table">
            <div class="table-cell align-middle text-center">
                
                <div class="relative h-[95vh] overflow-auto bg-white inline-block border rounded-md p-3 w-fit text-start shadow-md my-3 mx-2">
                    
                    <i class="la la-times absolute top-1 right-3 text-neutral-500 text-xl cursor-pointer active:scale-125"></i>

                    <p class="text-sm text-nenutral-400 font-semibold">Participant Info</p>

                    <div class="flex flex-wrap w-full max-w-md">
                        <a href="#" target="_blank" class="float-left">
                            <div class="bg-[url(https://images.unsplash.com/photo-1669236132582-67d039f7fb7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80)] w-10 h-10 rounded-md mr-3 mt-4"></div>
                        </a>

                        <div class="info mr-5 mt-4 xsm:hidden">
                            <p>Time</p>
                            <p>In 1h 2m</p>
                        </div>

                        <div class="info mr-5 mt-4" v-for="o in [1,1,1,1,1,1]">
                            <p>Name</p>
                            <p>Kura Blackk Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda perferendis explicabo fuga fugiat, et voluptatum. Atque blanditiis tenetur consequatur, distinctio temporibus reiciendis obcaecati consequuntur libero explicabo. Ipsa ullam asperiores consequatur.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </NuxtLayout>
</template>

<style>
.info p{@apply text-neutral-600 text-sm first:font-semibold first:text-neutral-400}
#patTable th, #patTable td{@apply text-start text-sm px-2 xsm:px-3 py-3 }
#patTable td{@apply text-sm text-neutral-600 }
#patTable tbody tr{@apply border-b border-neutral-200/70 last:border-transparent hover:bg-neutral-50/80 last:rounded-b-lg overflow-hidden}
</style>