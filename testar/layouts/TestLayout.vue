<script setup>
/*const supabase = useSupabaseClient() 

const { id } = useRoute().params
onMounted( async () => {
    const { data, error } = await supabase
        .from('tests')
        .select()
        .eq('id', id).single()

        console.log(data);
})*/
</script>

<template>
<NuxtLayout name="dashboard-layout">

    <div class="testNav relative flex justify-between items-center mx-3 mt-3 border-b" x-data="{openMenu: false}">
        
        <ul x-bind:class="openMenu ? 'scale-y-100' : 'scale-y-0 sm:scale-y-100'">
            <li class="group active">
                <div><i class="la la-tasks"></i> <span>Info/Options</span></div>
                <div class="group-hover:scale-x-100 origin-right"></div>
            </li>
            <li class="group">
                <div><i class="la la-question-circle"></i> <span>Questions</span> <span class="bdg">15</span></div>
                <div class="group-hover:scale-x-100 origin-left"></div>
            </li>
            <li class="group">
                <div><i class="la la-comments"></i> <span>Participants</span> <span class="bdg">3</span></div>
                <div class="group-hover:scale-x-100 origin-left"></div>
            </li>
        </ul>

        <IconsBars class="sm:hidden cursor-pointer" :color="'fill-neutral-400'" :size="27" x-on:click="openMenu = !openMenu" />

        <div class="flex items-center mb-1 sm:mb-auto">
            <div class="actions">
                <a href="#" target="_blank"><IconsEye :color="'fill-neutral-500'" :size="25" /></a>
            </div>
            <div class="relative" x-data="{moreMenu: false}">
                <div class="actions" x-on:click="moreMenu = !moreMenu">
                    <IconsEllipsesV :color="'fill-neutral-500'" :size="25" />
                </div>
                
                <div
                    class="tTp w-28 absolute top-full right-0 z-10 mt-1 bg-white rounded-md border shadow-md overflow-hidden origin-top duration-200 scale-y-0 group-hover:scale-y-100"
                    x-bind:class="moreMenu ? 'scale-y-100' : 'scale-y-0'"
                >
                    <button><i class="la la-link"></i> Copy Link</button>
                    <button><i class="lar la-star"></i> Star</button>
                    <button><i class="lar la-trash-alt"></i> Remove</button>
                </div>
            </div>
        </div>

    </div>

    <slot />
</NuxtLayout>
</template>

<style>
.testNav ul{@apply block sm:flex absolute top-full sm:static -mt-1 sm:mt-auto bg-white border rounded-md shadow-md sm:border-none sm:shadow-none origin-top duration-200}
.testNav ul li{@apply border-b sm:border-none overflow-hidden cursor-pointer }
.testNav ul li i{@apply text-lg mr-1 }
.testNav ul li div:first-child{@apply flex items-center p-2 text-sm text-neutral-600/90 active:bg-neutral-100 }
.testNav ul li div:first-child .bdg{@apply flex justify-center items-center bg-cyan-400 text-white font-semibold px-1.5 py-0 ml-1 rounded-full shadow-md}
.testNav ul li div:nth-child(2){@apply h-[2px] w-full bg-cyan-400 scale-x-0 duration-200 }

.testNav ul li.active div:first-child{@apply bg-neutral-50}
.testNav ul li.active div:nth-child(2){@apply scale-x-100 }

.testNav .actions{@apply btnEffect round after:bg-neutral-200 flex items-center justify-center rounded-full px-1.5 py-1.5 ml-1 hover:bg-neutral-100 cursor-pointer }

.tTp button{@apply flex items-center text-sm text-neutral-700 px-2 py-1.5 w-full border-b  last:border-none border-neutral-100 hover:bg-neutral-50/80}
.tTp button i{@apply mr-1 }
</style>