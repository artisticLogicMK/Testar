<script setup lang="ts">
import gsap from 'gsap'

const mountSlot = ref<boolean>(true)

onMounted(() => {

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
        loadContainer.style.display = 'none'

        mountSlot.value = true
    }

    //loader animation
    loader = gsap.timeline({onComplete: afterLoader, onReverseComplete: hideLoader})
        .to("#loadCon", {scale: 1, opacity: 1, display: "flex", duration: 2, ease: "elastic.out(1, 0.6)"})
        .to(".bgItems", {scale: 1, duration: 2, ease: "elastic.out(1, 0.6)"}, "<")
        .to("#loadCon #inner1", {scale: 1, duration: 2, ease: "elastic.out(1, 0.6)"}, "-=1.5")
        .to("#loadCon #inner1", {borderWidth: "1px", duration: 1, ease: "power4.out"}, "-=1.5")
        .to("#loadCon #inner2", {width: "60%", opacity: "1", duration: 1, ease: "bounce.out"}, "-=1.5")
        .to("#inner2 #star", {scale: 1, rotate: "360deg", duration: 1, ease: "power4.out"}, "-=1")
        .to("#inner2 #text", {scale: 1, opacity: 1, duration: 1, ease: "power4.out"}, "-=0.8")
        .to("#loadCon", {scale: 1.1, border: "20px solid rgba(255,255,255,0.1)", duration: 1, ease: "back.out(1.7)", repeat: loadTime, yoyo: true }, "-=1")

    //initialize alpinjs
    window.Alpine = Alpine
    Alpine.start()
})
</script>

<template>
    <div class="table h-full w-full relative ">

        <div class="absolute top-0 w-full h-full overflow-hidden">
            <div class="w-full max-w-6xl mx-auto">
        
                <img src="~/assets/img/rank.svg" class="bgItems w-52 md:w-64 absolute bottom-0 left-[30%] -mb-[55px] md:-mb-[15px] float2">

                <img src="~/assets/img/plant.svg" class="bgItems w-64 absolute top-44 left-0 float2 opacity-60 md:opacity-100">

                <img src="~/assets/img/plant2.svg" class="bgItems w-32 absolute top-20 right-0 float2 opacity-60 md:opacity-100">

                <img src="~/assets/img/trangle.svg" class="bgItems w-44 absolute bottom-0 right-[10%] -mb-[15px] float2 hidden md:block">
            </div>

            <div class="bg-bubbles h-20 bg-red-400 w-full absolute -bottom-10g left-0 text-lg text-white/90 hidden">
                <div class="bgwhite left-[73%]" style="animation-delay: 3s;animation-duration: 130s;">?</div>
                <div class="bgwhite left-[25%]" style="animation-delay: 70s;animation-duration: 23s;"><i class="la la-stopwatch"></i></div>
                <div class="bgdark left-[40%]" style="animation-delay: 30s;animation-duration: 20s;"><i class="la la-school"></i></div>
                <div class="bgdark left-[55%]" style="animation-delay: 60s;animation-duration: 12s;"><i class="la la-book"></i></div>
                <div class="bgdark left-[400%]" style="animation-delay: 14s;animation-duration: 35s;"><i class="la la-certificate"></i></div>
                <div class="bgwhite left-[19%]" style="animation-delay: 90s;animation-duration: 52s;"><i class="la la-chess-knight"></i></div>
                <div class="bgwhite left-[36%]" style="animation-delay: 50s;animation-duration: 52s;"><i class="la la-code"></i></div>
                <div class="bgdark left-[82%" style="animation-delay: 80s;animation-duration: 40s;"><i class="la la-mobile"></i></div>
                <div class="bgdark left-[90%]" style="animation-delay: 5s;animation-duration: 70s;"><i class="la la-atom"></i></div>
            </div>
        </div>

        <div class="table-cell align-top h-screen w-screen relative z-10 bg-[url(../img/glass-m.svg)] sm:bg-[url(../img/glass.svg)] bg-cover bg-no-repeat bg-center pb-12">

            <div id="loadConAlpha" class="absolute z-10 top-0 w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-tr from-cyan-400 to-cyan-700 z-[9999] hidden">
                <div id="loadCon" class="w-[320px] xsm:w-[350px] h-[320px] xsm:h-[350px] scale-[6] bg-white/40 border-white/0 opacity-0 hidden">
                    <div id="inner1" class="inners w-4/5 h-4/5 scale-0 bg-white/40 border-0 border-white/50">
                        <div id="inner2" class="inners w-full bg-white/95 opacity-0 text-cyan-500 overflow-hidden">
                            <span id="text" class="relative z-[2] bg-white font-bold text-2xl pb-[4px] -mr-8 -mb-[4px] leading-[0.6] scale-x-0 origin-right opacity-0">Testar</span>
                            <i id="star" class="lar la-star text-6xl scale-0"></i>
                        </div>
                    </div>
                </div>
            </div>

            <slot v-if="mountSlot" />

            <!--footer-->
            <div class="absolute bottom-0 w-full">
                <div class="w-full max-w-5xl mx-auto px-3 py-1.5 text-dark-200 font-bold text-sm text-start">
                    &copy;2022 Testar.
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#loadCon, #loadCon .inners {
    @apply rounded-full aspect-square flex items-center justify-center
}

.bgItems { @apply scale-0 }
</style>