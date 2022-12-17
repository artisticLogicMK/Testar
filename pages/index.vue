<script setup lang="ts">
import gsap from 'gsap'

/*definePageMeta({
    middleware: ['auth']
})*/

//get user data
const user = useSupabaseUser()

const mountSlot = ref<boolean>(false)

onMounted(() => {    
    //if user has signed in
    watchEffect(() => {
        if (user.value) navigateTo('/dashboard')
    })


    let loader: any

    //if page has loaded before, give loader repeat 4times else 2times
    const loadTime = sessionStorage.getItem("opened") === null ? 3 : 1

    //after loader animation complete, reverse
    const afterLoader = () => {
        loader.reverse()
        sessionStorage.setItem("opened", "1")
    }

    //after loader is reversed, hide from DOM
    const hideLoader = () => {
        let loadContainer = document.querySelector("#loadConAlpha") as HTMLDivElement
        if (loadContainer) loadContainer.style.display = 'none'

        mountSlot.value = true
    }

    //loader animation
    loader = gsap.timeline({onComplete: afterLoader, onReverseComplete: hideLoader})
        .to("#loadCon", {scale: 1, opacity: 1, display: "flex", duration: 2, ease: "elastic.out(1, 0.6)"})
        .to(".bgItems", {scale: 1, duration: 2, ease: "elastic.out(1, 0.6)"}, "<")
        .to("#loadCon #inner1", {scale: 1, duration: 2, ease: "elastic.out(1, 0.6)"}, "-=1.5")
        .to("#loadCon #inner1", {borderWidth: "1px", duration: 1, ease: "power4.out"}, "-=1.5")
        .to("#loadCon #inner2", {scale: 1, opacity: "1", duration: 1, ease: "elastic.out(1, 0.6)"}, "-=1.5")
        .to("#inner2 #star", {scale: 1, rotate: "360deg", duration: 1, ease: "power4.out"}, "-=1")
        .to("#inner2 #text", {scale: 1, opacity: 1, duration: 1, ease: "power4.out"}, "-=0.8")
        .to("#loadCon", {scale: 1.1, border: "20px solid rgba(255,255,255,0.1)", duration: 1, ease: "back.out(1.7)", repeat: loadTime, yoyo: true }, "-=1")
})
</script>

<template>
    <NuxtLayout name="bg-layout">
        <div id="loadConAlpha" class="absolute z-10 top-0 w-full h-full flex items-center justify-center overflow-hidden z-[9999] hiden">
            <div id="loadCon" class="w-[320px] xsm:w-[350px] h-[320px] xsm:h-[350px] scale-[6] bg-white/40 border-white/0 opacity-0 hidden">
                <div id="inner1" class="inners w-4/5 h-4/5 scale-0 bg-white/40 border-0 border-white/50">
                    <div id="inner2" class="inners w-4/6 h-4/6 scale-0 bg-white/95 opacity-0 text-cyan-500 overflow-hidden">
                        <span id="text" class="relative z-[2] bg-white font-bold text-2xl pb-[4px] -mr-8 -mb-[4px] leading-[0.6] scale-x-0 origin-right opacity-0">Testar</span>
                        <i id="star" class="lar la-star text-6xl scale-0"></i>
                    </div>
                </div>
            </div>
        </div>

        <HomeContent v-if="mountSlot" />

    </NuxtLayout>
</template>

<style>
#loadCon, #loadCon .inners {
    @apply rounded-full flex items-center justify-center
}

.authBtns { @apply w-fit relative mr-3 }
.authBtns .ovl { @apply absolute  w-full h-full -skew-x-[32deg] -ml-1 border border-white/75 scale-0 origin-bottom-left }
.authBtns button { @apply bg-gradient-to-tr from-white/5 to-white/30 -skew-x-[32deg] text-sm px-3 py-1.5 font-bold }
.authBtns button.dark { @apply bg-gradient-to-tr from-white/5 to-dark-200 }
.authBtns button span { @apply block skew-x-[32deg] }
</style>