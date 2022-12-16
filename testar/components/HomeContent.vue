<script setup lang="ts">
import gsap from 'gsap'
import { IconVuejs, IconAmbulance } from '@iconify-prerendered/vue-la'

const mountAuthModal = ref<boolean | string>(false)

const showAuthModal = (mode: string): void => {
    mountAuthModal.value = mode === 'signup' ? 'signup' : 'login'
}

const closeAuthModal = () => {
    setTimeout(() => mountAuthModal.value = false, 1400)
}

onMounted(() => {

    let homeContainer = document.querySelector("#homeContainer") as HTMLDivElement
    gsap.from(homeContainer.children, {
        y: "+100",
        opacity: 0,
        delay: 0.5,
        duration: 1,
        stagger: 0.35,
        ease: "back.out(1.7)"
    })
    
})
</script>

<template>

        <div class="flex flex-col opacity-1" id="homeContainer">

            <NuxtLayout name="nav-layout">
                <img src="~/assets/img/logo.svg" class="w-24 sm:w-28 opacity-90">

                <div class="flex items-center text-white/95">
                    <div class="authBtns group" @click="showAuthModal('login')">
                        <div class="ovl group-hover:scale-100"></div>
                        <button><span>Login</span></button>
                    </div>

                    <div class="authBtns group" @click="showAuthModal('signup')">
                        <div class="ovl group-hover:scale-100"></div>
                        <button class="dark"><span>Signup</span></button>
                    </div>
                </div>
            </NuxtLayout>


            <!--body-->
            <div class="grow flex flex-col md:flex-row items-center w-full max-w-5xl mx-auto px-3">

                <div class="w-full md:w-1/2 md:mr-4">
                    <h1 class="text-2xl sm:text-4xl text-dark-200 font-bold">Creating tests and quizzes has never been simpler.</h1>
                    <p class="text-white/95 text-[1.08rem] font-semibold">Testar is an application designed for professionals that require a quick and easy solution to create and publish online tests and quizzes,  including educators, businesses, and hobbyists. You can create your own engaging tests and quizzes in a minute using our user-friendly exam builder.</p>
                    <button class="bg-gradient-to-tr from-white/5 to-dark-200 hover:from-dark-200 text-white/90 text-base px-4 py-2 rounded-md -skew-x-[32deg] ml-3 mt-3">
                        <span class="block skew-x-[32deg] font-bold">Go to Tester</span>
                    </button>
                </div>

                <div class="w-[85%] sm:w-[70%] md:w-1/2 mt-8 md:mt-none">
                    <img src="~/assets/img/interface.svg" class="w-full float">
                </div>

            </div>


        </div>

        <AuthMain
            :authMode="mountAuthModal"
            v-if="mountAuthModal"
            @closeAuth="closeAuthModal"
        />

</template>

<style>
.authBtns { @apply w-fit relative mr-3 }
.authBtns .ovl { @apply absolute  w-full h-full -skew-x-[32deg] -ml-1 border border-white/75 scale-0 origin-bottom-left }
.authBtns button { @apply bg-gradient-to-tr from-white/5 to-white/30 -skew-x-[32deg] text-sm px-3 py-1.5 font-bold }
.authBtns button.dark { @apply bg-gradient-to-tr from-white/5 to-dark-200 }
.authBtns button span { @apply block skew-x-[32deg] }
</style>