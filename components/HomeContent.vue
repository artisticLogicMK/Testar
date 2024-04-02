<script setup lang="ts">
const mountAuthModal = ref<boolean | string>(false)

const showAuthModal = (mode: string): void => {
    mountAuthModal.value = mode === 'signup' ? 'signup' : 'login'
}

const closeAModal = () => {
    setTimeout(() => mountAuthModal.value = false, 1400)
}

const fadeIn = (el: HTMLElement) => {
    slideInUpAnim(el, false)
}
</script>

<template>

        <transition appear @enter="fadeIn">
            <div class="flex flex-col opacity-1 h-auto mb-5 sm:mb-6 md:mb-auto" id="homeContainer">

                <div>
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
                </div>


                <!--body-->
                <div class="relative grow flex flex-col md:flex-row items-center w-full max-w-5xl mx-auto px-3 pt-7 pb-9 md:mt-auto">

                    <div class="absolute top-0 left-0 w-full h-[106%] overflow-hidden">
                        <div class="w-full max-w-6xl mx-auto">
                            <img src="~/assets/img/rank.svg" class="bgItems w-56 absolute bottom-0 left-[30%] -mb-[55px] md:-mb-[15px] float2">

                            <img src="~/assets/img/triangle.svg" class="bgItems hidden md:block w-44 absolute bottom-0 right-[6%] -mb-[15px] float2">
                        </div>
                    </div>

                    <div class="w-full md:w-1/2 md:mr-4 relative z-10">
                        <h1 class="text-3xl sm:text-4xl text-dark-200 font-bold">Creating tests and quizzes made simple!</h1>
                        <p class="text-white/95 text-[1.03rem] sm:text-[1.08rem] font-semibold">Testar is an app for creating and publishing online tests and quizzes. With its user-friendly dashboard, professionals and hobbyists can quickly create engaging tests to assess knowledge and understanding. Testar makes it easy to share tests with others through a link, allowing them to participate and take the test. It's an excellent solution for anyone in need of a reliable and efficient way to create and administer online tests and quizzes.</p>
                        
                        <NuxtLink to="https://tstar.vercel.app/taketest/test-0f7c6570-c0f3-4c83-9f73-f98ecf9962de" target="_blank">
                            <button class="bg-gradient-to-tr from-white/5 to-dark-200 hover:from-dark-200 text-white/90 text-sm sm:text-base px-4 py-2 rounded-md -skew-x-[32deg] ml-3 mt-3">
                                <span class="block skew-x-[32deg] font-bold">Take a test</span>
                            </button>
                        </NuxtLink>
                        
                        <button @click="showAuthModal('signup')" class="bg-gradient-to-tr from-white/5 to-white/30 hover:from-white/30 text-white/90 text-sm sm:text-base px-4 py-2 rounded-md -skew-x-[32deg] ml-3 mt-3">
                            <span class="block skew-x-[32deg] font-bold">Create</span>
                        </button>
                    </div>

                    <div class="w-[85%] sm:w-[70%] md:w-1/2 mt-9 md:mt-none">
                        <img src="~/assets/img/interface.svg" class="w-full float">
                    </div>

                </div>

                <HomeContentBody />

            </div>
        </transition>
 

        <AuthMain
            :authMode="mountAuthModal"
            v-if="mountAuthModal"
            @closeAuth="closeAModal"
        />

</template>

<style>
.authBtns { @apply w-fit relative mr-3 }
.authBtns .ovl { @apply absolute  w-full h-full -skew-x-[32deg] -ml-1 border border-white/75 scale-0 origin-bottom-left }
.authBtns button { @apply bg-gradient-to-tr from-white/5 to-white/30 -skew-x-[32deg] text-sm px-3 py-1.5 font-bold }
.authBtns button.dark { @apply bg-gradient-to-tr from-white/5 to-dark-200 }
.authBtns button span { @apply block skew-x-[32deg] }
</style>
