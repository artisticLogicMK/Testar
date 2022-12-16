<script setup >
import moment from 'moment'
import gsap from 'gsap'

definePageMeta({
  middleware: ['authenticated']
})

const supabase = useSupabaseClient() //init spb client

//get user data
const userAuth = useUser()

const dashToggles = ref({
  sort: false,
  filter: false
})

let tests = ref(null)

const addRequest = ref(false)
const addTest = async () => {
  if (!addRequest.value) {
    addRequest.value = true
    await createTest()
    setTimeout(() => addRequest.value = false, 2000)
  }
}

//action to star test
const starTest = async (testId, state, index) => {
  const { data, error } = await supabase.from('tests')
    .update({starred: state ? false : true})
    .eq('id', testId)
    .eq('user_id', userAuth.value.id)
    .select()

  if (data) {
    tests.value[index].starred = state ? false : true
  }
}


//action to remove test
const removeTest = async (testId) => {
  if (confirm("Really want to delete this test?")) {
    const { data, error } = await supabase.from('tests')
      .delete()
      .eq('id', testId)
      .eq('user_id', userAuth.value.id)
      .select()

    if (data) {
      tests.value = tests.value.length == 1 ? tests.value = 'empty' : tests.value.filter(test => test.id !== testId)
      console.log(tests.value);
    }
  }
}

const copyLink = link => {
  navigator.clipboard.writeText(link)
}

const testGrid = ref(null)
onMounted(async () => {

    watchEffect(() => {
      if (!userAuth) navigateTo('/')
    })

  //load user tests
  const { data: testraw, error } = await supabase
      .from('tests')
      .select()
      .eq('user_id', userAuth.value.id)
      .order('id', { ascending: false })

  tests.value = testraw.length ? testraw.map(test => ({
    id: test.id,
    title: test.title,
    updated_at: moment(test.updated_at).format('Do MMM, YYYY'),
    link: test.link,
    starred: test.starred
  })) : 'empty'
  
})


//animations
const slideUp = (el) => {
  //let homeContainer = document.querySelector("#testGrid")
      gsap.from(el.children, {
        y: "+100",
        opacity: 0,
        delay: 0.5,
        duration: 1,
        stagger: 0.35,
        ease: "back.out(1.7)"
    })
}

/*when fetching user is needed
const { data: p } = await useFetch('/api/getUser', {
  headers: useRequestHeaders(['cookie'])
})*/
</script>

<template>
  <Head>
    <Title>Testar | Dashboard</Title>
  </Head>

  <NuxtLayout name="dashboard-layout">

    <transition appear @enter="slideUp">
      <div v-if="tests && tests !== 'empty'">

        <div class="flex justify-between items-center mt-4 px-3">
          <div class="text-lg font-bold text-neutral-400/80">Your Tests</div>

          <div class="flex">
              <div
                class="d_topBtns mr-2"
                @click="() => {
                  dashToggles.sort = !dashToggles.sort
                  dashToggles.filter = false
                }"
              >
                <i class="la la-sort"></i> Newest

                
                <div
                  class="drops scale-y-0" 
                  :class="{'scale-y-100': dashToggles.sort}"
                >
                  <div>
                    <i class="la la-caret-up"></i>Newest
                  </div>
                  <div>
                    <i class="la la-caret-up"></i>Oldest
                  </div>
                </div>
                
              </div>

              <div
                class="d_topBtns"
                @click="() => {
                  dashToggles.filter = !dashToggles.filter
                  dashToggles.sort = false
                }"
              >
                <i class="la la-filter"></i> Filter

                <div class="drops scale-y-0" 
                  :class="{'scale-y-100': dashToggles.filter}"
                >
                  <div>
                    <i class="lar la-star"></i>Starred
                  </div>
                  <div>
                    <i class="la la-trash-alt"></i>Removed 
                  </div>
                </div>
              </div>
          </div>
        </div>
    
      
        <transition appear @enter="slideUp">
          <div id="testGrid" class="xsm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 justify-between w-full mx-auto mt-5 px-1.5">

            <div class="relative flex justify-center items-center rounded-lg border-[3px] border-dashed hover:border-solid xsm:h-full mb-4 xsm:mb-auto">
                <div
                  class="bg-slate-100 rounded-full flex justify-center items-center px-3 py-0.5 my-2 cursor-pointer border border-transparent hover:border-neutral-200"
                  @click="addTest"
                >
                  <span class="text-4xl text-slate-300 font-bold">+</span>
                </div>
            </div>


            <div
              v-for="(test, i) in tests"
              :key="i"
              class="relative rounded-lg border box-border mb-4 xsm:mb-auto cursor-pointer shadow-sm hover:shadow-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="w-full relative hidden lg:inline-block" viewBox="0 0 10 9"></svg>

                <div class="flex flex-col justify-between w-full h-full static lg:absolute top-0 p-3 mh-3 tests">
                  <div class="flex items-center justify-end text-xs text-slate-500">
                      <i class="la la-box text-lg"></i> Thoughts
                  </div>

                  <div class="my-3">
                      <p class="text-slate-600 text-sm font-semibold">{{test.title}}</p>
                      <p class="text-slate-400 text-sm">Update {{test.updated_at}}</p>
                  </div>

                  <div class="flex justify-between text-slate-400/80 text-xl">
                      <IconsLink
                        @click="copyLink(test.link)"
                        class="cursor-pointer" :color="'fill-neutral-400/80 active:fill-cyan-400'" :size="22"
                      />
                      <IconsStar
                        @click="starTest(test.id, test.starred, i)"
                        class="cursor-pointer" :color="test.starred ? 'fill-yellow-400/90' : 'fill-neutral-400/80'" :size="22"
                      />
                      <IconsTrash
                        @click="removeTest(test.id)"
                        class="cursor-pointer" :color="'fill-neutral-400/80'" :size="22"
                      />
                  </div>
                </div>

                <div class="absolute top-0 right-0 translate-x-2 -translate-y-2 inline-flex justify-center items-center bg-cyan-400 text-xs text-white font-bold px-1.5 py-0.5 rounded-full shadow-md">7</div>
            </div>

          </div>
        </transition>

        <div class="my-4 mr-3 flex justify-end">
          <button class="d_topBtns mr-2"><i class="la la-angle-left text-sm"></i> Previous</button>
          <button class="d_topBtns">Next <i class="la la-angle-right text-sm"></i></button>
        </div>

      </div>
    </transition>


    <div v-if="tests === 'empty'" class="h-[75vh] flex items-center justify-center">
      <div class="inline-flex flex-col items-center justify-center border-[3px] border-dashed p-8 rounded-lg text-sm">
        <p class="text-neutral-500 mb-2">You haven't created any tests yet.</p>
        <button
          @click="addTest"
          class="btnEffect bg-cyan-400 text-white font-semibold rounded-md px-3 py-1.5 disabled:bg-red-600"
          :disabled="addRequest"
        >
          <i class="la la-plus"></i> New Test
        </button>
      </div>
    </div>


    <div v-if="!tests" class="h-[75vh] flex items-center justify-center">
      <IconsLoader class="animate-spin inline-block" :color="'fill-neutral-400/80'" :size="60" />
    </div>

  </NuxtLayout>
</template>

<style>
.d_topBtns{@apply relative flex items-center bg-neutral-100 rounded-md text-neutral-500/90 text-sm px-2 py-1 border border-transparent cursor-pointer hover:border-neutral-200}
.d_topBtns i{@apply text-base mr-1 }

.d_topBtns .drops{@apply absolute top-full right-0 z-10 mt-1 bg-white rounded-md border shadow-md overflow-hidden origin-top duration-300 }
.d_topBtns .drops div{@apply flex items-center text-sm px-2 py-1 w-28 first:border-b border-neutral-100 hover:bg-neutral-50/80 }
.d_topBtns .drops div i{@apply mr-1 }
</style>