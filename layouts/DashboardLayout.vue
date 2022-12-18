<script setup>
const userAuth = useUser() //get user data

const alertData = ref({
    is: false, type: null, msg: null
})

const supabase = useSupabaseClient() //init spb client

const authMenu = ref(false)


const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
        document.cookie="sb-access-token=;max-age=0"
        document.cookie="sb-refresh-token=;max-age=0"
        window.location = "/"
    }
}


onMounted(() => {
    //instantiate clipboardjs
    let clipboard = new ClipboardJS('.copybtn')
    clipboard.on('success', function(e) {
        alertData.value = {
            is: true, type: 'success', msg: 'Link Copied!'
        }

        e.clearSelection()
    })

    const internetOff = ref(false)

    //check internet connection status
    setInterval(() => {
        if (window.navigator.onLine) {
             internetOff.value = false
        } else {
            internetOff.value = true
            alertData.value = {
                is: true, type: 'error', msg: 'Check Network!'
            }
        }
    }, 1500)


    watchEffect(() => {
        if (!userAuth.value) navigateTo('/')
    })

    supabase.auth.onAuthStateChange((event, session) => {
        if (event == 'SIGNED_OUT') navigateTo('/')
    })
})
</script>

<template>
<NuxtLayout name="bg-layout">
    <DashboardAlerts
        v-if="alertData.is"
        :alertData="alertData"
        @closeAlert="alertData = {is: false,type:null,msg:null}" 
    />

    <NuxtLayout name="nav-layout">
        <NuxtLink to="/dashboard"><img src="~/assets/img/logo.svg" class="w-20 opacity-90"></NuxtLink>


        <DashboardSearchComponent />


        <div class="flex items-center text-white/80" x-data="{aMenu: false, nMenu: false}">
            <IconsSearch class="sm:hidden cursor-pointer" :color="'fill-white/80'" :size="28" x-on:click="searchOpen = true" />
            
            
            <div class="hidden relative cursor-pointer">
                <IconsBell class="mx-2" :color="'fill-white/80'" :size="28" />
                <span class="absolute -top-1.5 right-0 flex justify-center items-center w-5 h-5 bg-cyan-400 text-white text-xs font-semibold px-1 py-0.5 rounded-full shadow-md">4</span>

                <div class="authMenu absolute top-full right-0 z-[9999] bg-cyan-400/80 backdrop-blur-sm rounded-md mt-1.5 duration-300" x-show="nMenu" x-on:mouseleave="nMenu = false" x-transition>

                </div>
            </div>


            <div class="relative rounded-full bg-white/[.15] w-9 h-9 flex items-center justify-center text-xl leading-none ml-1 border border-transparent hover:border-white cursor-pointer" @click="authMenu = !authMenu">
                <IconsUser :color="'fill-white/80'" :size="23" />

                <transition enter-active-class="ans an-fadeInUp an-faster" leave-active-class="ans an-fadeOutDown an-faster">
                    <div class="authMenu absolute top-full right-0 z-[9999] max-w[250px] bg-cyan-400/80 backdrop-blur-sm rounded-md mt-1.5 duration-300" v-if="authMenu" @mouseleave="authMenu = false">
                        <div>{{userAuth.email}}</div>
                        <div @click="logout">Logout</div>
                    </div>
                </transition>
            </div>
        </div>
       
    </NuxtLayout>


    <div class="relative flex flex-col items-center mt-2 px-2 sm:px-3">
        <div class="h-full absolute top-0 w-full overflow-y-hidden">
            <div class="bg-neutral-100/0 h-full mt-14"></div>
        </div>

        <div class="bg-white h-full w-full max-w-5xl relative z-10 rounded-2xl shadow-xl px-1.5 xsm:px-3 lg:px-5 opacity-[.99] duration-200">
            <slot />
        </div>
    </div>

</NuxtLayout>
</template>

<style scoped>
.authMenu div{@apply px-3 py-1 text-sm text-white border-b border-white/30 font-semibold }
.authMenu div:nth-child(2){@apply hover:bg-white/20 }
</style>