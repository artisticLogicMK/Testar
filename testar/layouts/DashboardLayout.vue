<template>
<NuxtLayout name="bg-layout">

    <NuxtLayout name="nav-layout">
        <img src="~/assets/img/logo.svg" class="w-20 opacity-90">

        <div
            class="bg-white sm:bg-white/[.15] w-[80%] sm:w-2/5 rounded-md flex items-center text-cyan-500 sm:text-white/70 px-2 py-0.5 overflow-hidden ml-2 absolute bottom-3 sm:static duration-300 origin-right"
            x-bind:class="searchOpen ? 'scale-x-100' : 'scale-x-0 sm:scale-x-100'"
        >
            <i class="la la-search text-xl mr-1"></i>
            <input type="search" class="w-0 grow bg-transparent border-none text-white/80 text-sm">
            <i
                class="la la-times text-2xl ml-1 sm:hidden cursor-pointer"
                x-on:click="searchOpen = false"
            ></i>
        </div>


        <div class="flex items-center text-white/80">
            <IconsSearch class="sm:hidden cp" :color="'fill-white/80'" :size="28" x-on:click="searchOpen = true" />
            
            <div class="relative cp">
                <IconsBell class="mx-2" :color="'fill-white/80'" :size="28" />
                <span class="absolute -top-1.5 right-0 flex justify-center items-center bg-cyan-400 text-white text-xs font-semibold px-1 py-0.5 rounded-full shadow-md">47</span>
            </div>

            <div class="rounded-full bg-white/[.15] w-9 aspect-square flex items-center justify-center text-xl leading-none ml-1 cp">A</div>
        </div>
       
    </NuxtLayout>


    <div class="relative flex flex-col items-center mt-2 px-2 sm:px-3">
        <div class="h-full absolute top-0 w-full overflow-y-hidden">
            <div class="bg-neutral-100/0 h-full mt-14"></div>
        </div>

        <div class="bg-white h-full w-full max-w-5xl relative z-10 rounded-2xl shadow-xl px-1.5 xsm:px-3 lg:px-5 opacity-[.99]">
            <slot />
        </div>
    </div>

</NuxtLayout>
</template>