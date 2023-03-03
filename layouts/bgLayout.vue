<script setup>
import gsap from 'gsap'

onMounted(() => {
    //initialize alpinejs
    window.Alpine = Alpine
    Alpine.start()

    gsap.timeline().to(".bgItems", {scale: 1, duration: 2, ease: "elastic.out(1, 0.6)"})
})
</script>

<template>
    <div class="table h-full w-full relative">

        <div class="absolute top-0 h-full w-full bg-[url(../img/glass-m.svg)] sm:bg-[url(../img/glass.svg)] bg-cover bg-no-repeat bg-center overflow-hidden" :class="{'h-screen': useRoute().path === '/'}">
            <div class="w-full max-w-6xl mx-auto">
                <img src="~/assets/img/rank.svg" class="bgItems w-48 md:w-56 absolute bottom-0 left-[33%] -mb-[55px] md:-mb-[15px] float2" :class="{'invisible': useRoute().path === '/'}">

                <img src="~/assets/img/plant.svg" class="bgItems w-64 absolute top-44 left-0 float2 opacity-60 md:opacity-100">

                <img src="~/assets/img/plant2.svg" class="bgItems w-32 absolute top-20 right-0 float2 opacity-60 md:opacity-100">

                <img src="~/assets/img/triangle.svg" class="bgItems w-44 md:w-52 absolute bottom-0 right-[10%] -mb-[15px] float2 hidden md:block" :class="{'invisible': useRoute().path === '/'}">
            </div>
        </div>


        <div class="table-cell align-top h-screen w-screen relative z-10 pb-10">
            <slot />

            <!--footer-->
            <Footer />
        </div>

    </div>
</template>

<style scoped>
.bgItems { @apply scale-0 }
</style>