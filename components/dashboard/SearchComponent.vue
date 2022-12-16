<script setup lang="ts">
const results = ref<any>(null)
const openSearch = ref<boolean>(false)

//perform
const search = async (val: string) => {
    if (val.length > 2) {
        //perform search based on individual words in search string
        let ar: string[] = []
        val.split(' ').forEach(word => {
            if(word !== '') ar.push("'"+word+"'")
        })
        
        const supabase = useSupabaseClient()
        const user = useUser()

        const { data: res, error } = await supabase
            .from('tests')
            .select('title, id, uuid, published')
            .eq('user_id', user.value.id)
            .textSearch('title', `${ar.join(' | ')}`)
            .limit(7)

        if (res?.length) {
            openSearch.value = true
            results.value = res 
        }  
    } else {
        openSearch.value = false
    }
}
</script>

<template>
    <div
        class="bg-white sm:bg-white/[.15] w-[80%] sm:w-2/5 rounded-md flex items-center text-cyan-500 sm:text-white/70 px-2 py-0.5 overflow-hiddenh ml-2 absolute bottom-3 z-[999] sm:bottom-auto sm:relative duration-300 origin-right"
        x-bind:class="searchOpen ? 'scale-x-100' : 'scale-x-0 sm:scale-x-100'"
    >
        <IconsSearch :color="'fill-cyan-400 sm:fill-white/70'" :size="20" />
        <input type="search" @input="search($event.target.value)" class="w-0 grow bg-transparent border-none text-neutral-500/80 sm:text-white/90 text-sm placeholder:text-white/90" placeholder="Search title of tests...">
        <i
            class="la la-times text-2xl ml-1 sm:hidden cursor-pointer"
            x-on:click="searchOpen = false"
        ></i>

        <transition appear enter-active-class="ans an-flipInX an-fast" leave-active-class="ans an-flipOutX an-fast">
            <div v-if="openSearch" class="absolute top-full left-0 bg-white/[.99] z-[9999] w-full rounded-md border mt-1.5 shadow-sm">
                <div class="flex items-center justify-between px-2 py-1">
                    <p class="text-neutral-500/60 text-sm font-semibold">Search Results</p>
                    <IconsClose @click="openSearch = false" :color="'fill-neutral-400/80'" :size="23" class="cursor-pointer" />
                </div>

                <div>
                    <NuxtLink
                        v-for="result in results"
                        :key="result"
                        :to="'/dashboard/test-'+result.uuid+(result.published ? '/participants' : '')"
                    >
                        <div class="text-neutral-500 text-sm border-t border-neutral-100 px-3 py-2 hover:bg-neutral-50 truncate">{{result.title}}</div>
                    </NuxtLink>
                </div>
            </div>
        </transition>
    </div>
</template>