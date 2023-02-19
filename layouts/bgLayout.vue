<script setup>
onMounted(() => {
    //initialize alpinejs
    window.Alpine = Alpine
    Alpine.start()
})
</script>

<template>

    <div class="table h-full w-full relative">

        <div class="absolute top-0 w-full h-screen overflow-hidden">
            <div class="w-full max-w-6xl mx-auto">
        
                <img src="~/assets/img/rank.svg" class="bgItems w-48 w-md:w-60 absolute invisible md:visible bottom-0 md:bottom-16 left-[33%] -mb-[55px] md:-mb-[15px] float2">

                <img src="~/assets/img/plant.svg" class="bgItems w-64 absolute top-44 left-0 float2 opacity-60 md:opacity-100">

                <img src="~/assets/img/plant2.svg" class="bgItems w-32 absolute top-20 right-0 float2 opacity-60 md:opacity-100">

                <img src="~/assets/img/trangle.svg" class="bgItems w-44 absolute invisible md:visible bottom-16 right-[10%] -mb-[15px] float2 hidden md:block">
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