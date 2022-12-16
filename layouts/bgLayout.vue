<script setup>
onMounted(() => {
    //initialize alpinejs
    window.Alpine = Alpine
    Alpine.start()
})
</script>

<template>

    <div class="table h-full w-full relative">

        <div class="absolute top-0 w-full h-full overflow-hidden">
            <div class="w-full max-w-6xl mx-auto">
        
                <img src="~/assets/img/rank.svg" class="bgItems w-52 md:w-64 absolute bottom-0 left-[30%] -mb-[55px] md:-mb-[15px] float2">

                <img src="~/assets/img/plant.svg" class="bgItems w-64 absolute top-44 left-0 float2 opacity-60 md:opacity-100">

                <img src="~/assets/img/plant2.svg" class="bgItems w-32 absolute top-20 right-0 float2 opacity-60 md:opacity-100">

                <img src="~/assets/img/trangle.svg" class="bgItems w-44 absolute bottom-0 right-[10%] -mb-[15px] float2 hidden md:block">
            </div>

            <div class="bg-bubbles h-20 bg-red-400 w-full absolute -bottom-10 left-0 text-lg text-white/90 hidden">
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

        <div class="table-cell align-top h-screen w-screen relative z-10 bg-[url(../img/glass-m.svg)] sm:bg-[url(../img/glass.svg)] bg-cover bg-no-repeat bg-center pb-10">

            <slot />

            <!--footer-->
            <Footer />
        </div>
    </div>

</template>

<style scoped>
.bgItems { @apply scale-0 }
</style>