<script setup>
defineProps({
    authMode: String
})

//access supabase client
const supabase = useSupabaseClient()


//regex to remove unwanted texts from auth errors
const supabaseErrorTextRegex = /AuthApiError: |AuthRetryableFetchError: /g

//auth form data
const authForm = ref({
    email: '',
    password: '',
    isProcessing: false,
    isError: false,
    isSuccess: false
})


//sign up - create user
const signup = async () => {
    authForm.value.isProcessing = true //indicate form load

    //check if email exists
    const { data: checkData, error: checkErr } = await supabase.from('registeredUsers').select()
    .eq('email', authForm.value.email).single()
        
    if (checkData.email !== authForm.value.email) {
        const { data, error } = await supabase.auth.signUp({
            email: authForm.value.email,
            password: authForm.value.password
        })
        
        if (!error) {
            //add user in registered table
            const { data: usrData, error: usrErr } = await supabase.from('registeredUsers')
                .insert({email: authForm.value.email}).select().single()
            
            if (usrData) {
                authForm.value.isError = false
                authForm.value.isSuccess = true //if success, show email verification notice
            }
                
        }
        else {
            authForm.value.password = ''
            authForm.value.isSuccess = false
            authForm.value.isError = error.toString().replace(supabaseErrorTextRegex, '')
            authForm.value.isProcessing = false //end form load
        }
    }
    else {
        authForm.value.isError = 'Email exists already.'
    }
}



//login
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


const signInWithTwitter = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
  })
}

const signInWithLinkedIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'linkedin',
  })
}

const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })
}

const signInWithDiscord = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
  })
}

/*
supabase.auth.onAuthStateChange((event, session) => {
  if (event == 'SIGNED_IN') navigateTo('/dashboard')
})
*/

let authAnimation

const closeAuthModal = () => {
    authAnimation.reverse().timeScale(-1.6)
}

onMounted(() => {
    authAnimation = modalAnimation()
})
</script>


<template>
    <div id="authOverlay" class="fixed z-10 left-0 top-0 h-full w-full flex items-end xsm:items-center justify-center py-3 px-2 overflow-y-auto bg-white/80 backdrop-blur-sm scale-y-0 -translate-x-full opacity-0 origin-center">
        <div id="fourth" class="bg-white/0 w-full xsm:max-w-sm m-auto mb-0 sm:mb-auto p-2 xsm:p-3 border border-white/0 rounded-2xl shadow-sm">
            <div id="second" class="bg-white p-4 sm:p-8 w-full rounded-xl shadow-sm scale-y-0 opacity-0">

                <div class="absolute left-0 top-0 w-full text-end px-4 pt-2">
                    <div
                        class="inline-block rounded-full hover:bg-neutral-100 p-0.5 cursor-pointer"
                        @click="() => {
                            closeAuthModal()
                            $emit('closeAuth')
                        }"
                    >
                        <IconsClose :color="'fill-neutral-400/80'" :size="30" />
                    </div>
                </div>
                <div id="third" class="relative scale-y-0 opacity-0">

                    <h1 class="text-dark-200/80 text-xl font-bold mb-4">
                        {{authMode === 'signup' ?  'Sign Up for Testar': 'Login to Testar'}}
                    </h1>
        
                    <div class="w-full" v-if="!authForm.isSuccess">

                        <AuthSocialAuths
                            :authMode="authMode"
                            @signInWithEmail="signInWithEmail()"
                            @signInWithTwitter="signInWithTwitter()"
                            @signInWithLinkedIn="signInWithLinkedIn()"
                            @signInWithDiscord="signInWithDiscord()"
                            @signInWithGitHub="signInWithGitHub()"
                        />

                        <form @submit.prevent="() => authMode === 'signup' ? signup() : login()">
                            <p class="text-neutral-500 text-cyan-600/90 text-sm mt-5 mb-1">Or {{authMode}} with email and password...</p>

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