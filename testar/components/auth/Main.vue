<script setup lang="ts">
import gsap from 'gsap'

defineProps({
    authMode: String
})

//access supabase client
const supabase = useSupabaseClient()
//console.log(supabase);


//regex to remove unwanted texts from auth errors
const supabaseErrorTextRegex = /AuthApiError: |AuthRetryableFetchError: /g

//auth form data
const authForm = ref({
    email: '' as string,
    password: '' as string,
    isProcessing: false as boolean,
    isError: false as boolean | string,
    isSuccess: false as boolean
})

const signup = async () => {
    authForm.value.isProcessing = true //indicate form load

    const { data, error } = await supabase.auth.signUp({
        email: authForm.value.email,
        password: authForm.value.password
    })
    console.log(data);
    console.log(error);
    
    if (!error) {
        authForm.value.isError = false
        authForm.value.isSuccess = true //if success, show email verification notice
    }
    else {
        authForm.value.password = ''
        authForm.value.isSuccess = false
        authForm.value.isError = error.toString().replace(supabaseErrorTextRegex, '')
        authForm.value.isProcessing = false //end form load
    }
}

const login = async () => {
    authForm.value.isProcessing = true //indicate form load

    const { data, error } = await supabase.auth.signInWithPassword({
        email: authForm.value.email,
        password: authForm.value.password
    })

    //if login failed
    if (error) {
        authForm.value.password = ''
        authForm.value.isError = error.toString().replace(supabaseErrorTextRegex, '')
        authForm.value.isProcessing = false //end form load
    }
}

const signInWithEmail = async () => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: 'max.2xtremes@gmail.com',
  })
  console.log(data);
    console.log(error);
}


const signInWithLinkedIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin',
  })
  console.log(data);
    console.log(error);
}

const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
}

//supabase.auth.onAuthStateChange((event, session) => {
//  if (event == 'SIGNED_IN') navigateTo('/dashboard')
//})

let authAnimation: any

const closeAuthModal = () => {
    authAnimation.reverse().timeScale(-1.6)
}

onMounted(() => {
    authAnimation = gsap.timeline({ defaults: { ease: "power2.inOut" }})
        .to("#authOverlay", {scaleY: 0.01, x: 1, opacity: 1, display: "flex", duration: 0.4})
        .to("#authOverlay", {scaleY: 1, background: "rgba(255,255,255,0.16)", duration: 0.6})
        .to("#authOverlay #second", {scaleY: 1, opacity: 1, duration: 0.6}, "-=0.4")
        .to("#authOverlay #third", {scaleY: 1, opacity: 1, duration: 0.4}, "-=0.2")
        .to("#authOverlay #fourth", {background: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.3)", duration: 0.8}, "-=0.4")
})
</script>


<template>
    <div id="authOverlay" class="fixed z-10 left-0 top-0 h-full w-full flex items-end xsm:items-center justify-center py-3 px-2 overflow-y-auto bg-white/80 backdrop-blur-sm scale-y-0 -translate-x-full opacity-0 origin-center">
        <div id="fourth" class="bg-white/0 w-full xsm:max-w-sm m-auto mb-0 sm:mb-auto p-2 xsm:p-3 border border-white/0 rounded-2xl shadow-sm">
            <div id="second" class="bg-white p-4 sm:p-8 w-full rounded-xl shadow-sm scale-y-0 opacity-0">

                <div class="absolute left-0 top-0 w-full text-end px-4 pt-2">
                    <i
                        class="la la-times text-dark-200 text-lg cursor-pointer"
                        @click="() => {
                            closeAuthModal()
                            $emit('closeAuth')
                        }"
                    ></i>
                </div>
                <div id="third" class="relative scale-y-0 opacity-0">

                    <h1 class="text-dark-200/80 text-xl font-bold mb-4">
                        {{authMode === 'signup' ?  'Sign Up for Testar': 'Login to Testar'}}
                    </h1>
        
                    <div class="w-full" v-if="!authForm.isSuccess">

                        <AuthSocialAuths
                            :authMode="authMode"
                            @signInWithEmail="signInWithEmail()"
                            @signInWithLinkedIn="signInWithLinkedIn()"
                            @signInWithGitHub="signInWithGitHub()"
                        />

                        <form @submit.prevent="() => authMode === 'signup' ? signup() : login()">
                            <p class="text-neutral-500 text-cyan-600/90 text-sm mb-1">Or {{authMode}} with email and password...</p>

                            <div class="fields">
                                <i class="la la-at"></i>
                                <input type="email" v-model="authForm.email" class="border-none" placeholder="you@site.com">
                            </div>

                            <div class="fields">
                                <i class="la la-lock"></i>
                                <input type="password" v-model="authForm.password" class="border-none" placeholder="password***">
                            </div>

                            <div
                                class="w-full text-red-500 text-[0.81rem] mb-2 -mt-2"
                                v-if="authForm.isError"
                            >
                                <i class="la la-exclamation-circle text-sm"></i>
                                {{authForm.isError}}
                            </div>

                            <div class="text-end">
                                <button
                                    type="submit"
                                    class="inline-flex items-center text-xs font-bold bg-cyan-400 text-white rounded-md px-3 py-0.5"
                                    :disabled="authForm.isProcessing"
                                >
                                    Sign Up
                                    <i
                                        class="la la-arrow-right text-lg ml-1"
                                        :class="{'la-spin la-spinner': authForm.isProcessing}"
                                    ></i>
                                </button>
                            </div>
                        </form>
                        <AuthForm />
                    </div>


                    <AuthVerificationNotice :email="authForm.email" v-else />
            
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.fields{ @apply flex items-center w-full border border-dark-200/40 text-dark-200 rounded-md p-1 mb-3 }
.fields i{ @apply mr-1 text-xl }
.fields input{ @apply grow text-base bg-transparent }
</style>