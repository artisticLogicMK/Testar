<script setup >
import moment from 'moment'

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

const tests = ref(null)
const ascendingOrder = ref(false)
const filters = ref({
  type: 'user_id',
  val: userAuth.value.id
})
const page = ref(0)
const totalTests = ref(null)
const totalPages = ref(null)

const isFiltered = ref(false)

const clickCreate = ref(false)

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


const categories = testCategories //get test categories


//action to load user tests
const loadTests = async (isAscendingOrder, filter = filters.value.type, value = filters.value.val) => {

  ascendingOrder.value = isAscendingOrder //set fetch order
  filters.value = {
    type: filter,
    val: value
  } //set filter state

  tests.value = null //initialize loader
  let pageSize = 15

  const {from, to} = getPagination(page.value, pageSize)

  const { data: testraw, error, count } = await supabase.from('tests')
    .select("*", { count: "exact" })
    .eq('user_id', userAuth.value.id)
    .eq(filter, value)
    .range(from,to)
    .order('id', { ascending: isAscendingOrder })

  let notFound
  if (isFiltered && !testraw.length) {
    notFound = true
  }

  totalTests.value = count
  tests.value = testraw.length ? testraw.map(test => ({
    id: test.id,
    title: test.title,
    updated_at: moment(test.updated_at).format('MMM Do YY, ha'),
    published: test.published,
    link: test.link,
    starred: test.starred,
    uuid: test.uuid,
    category: test.category
  })) : notFound ? [] : 'empty'

  if (totalTests.value > 0) {
    let lastPage = totalTests.value / pageSize
    totalPages.value = totalTests.value % pageSize > 0 ? Math.trunc(lastPage + 1) : lastPage
  }
  else {
    totalPages.value = 1
  }
}


//action to remove test
const removeTest = async (testId) => {
  if (confirm("Really want to delete this test?\nAll test questions and participants data will be removed too.")) {
    const { data, error } = await supabase.from('tests')
      .delete()
      .eq('id', testId)
      .eq('user_id', userAuth.value.id)
      .select()

    if (data) {
      if (tests.value.length == 1) {
        loadTests(ascendingOrder.value)
      } else {
        tests.value = tests.value.filter(test => test.id !== testId)
      }
    }
  }
}


const openTest = (e, uuid, published) => {
  const checkIfPublished = published ? '/participants' : ''
  if (e.target.id !== 'link') navigateTo('/dashboard/test-'+uuid+checkIfPublished)
}

onMounted(async () => {

  watchEffect(() => {
    if (!userAuth) navigateTo('/')
  })

  loadTests(false)

})


//animations
const slideUp = (el) => {
  slideInUpAnim(el, false)
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
      <div v-if="tests && tests !== 'empty'" class="flex flex-col justify-between min-h-[80vh]">
        <div class="flex justify-between items-center mt-4 px-3">
          <div class="text-base sm:text-lg font-bold text-neutral-400/80">Your Tests</div>

          <div class="flex">
              <div
                class="d_topBtns mr-2"
                @click="() => {
                  dashToggles.sort = !dashToggles.sort
                  dashToggles.filter = false
                }"
                @mouseleave="dashToggles.sort = false"
              >
                <i class="la la-sort"></i> {{ascendingOrder ? 'Oldest' : 'Newest'}}
                
                <div
                  class="drops scale-y-0" 
                  :class="{'scale-y-100': dashToggles.sort}"
                >
                  <div class="drops_in">
                    <div @click="loadTests(false)" class="tbs">
                      <i class="la la-caret-up"></i>Newest
                    </div>
                    <div @click="loadTests(true)" class="tbs">
                      <i class="la la-caret-up"></i>Oldest
                    </div>
                  </div>
                </div>
                
              </div>

              <div
                class="d_topBtns"
                @click="() => {
                  dashToggles.filter = !dashToggles.filter
                  dashToggles.sort = false
                }"
                @mouseleave="dashToggles.filter = false"
              >
                <i class="la la-filter"></i> Filter

                <div class="drops scale-y-0" 
                  :class="{'scale-y-100': dashToggles.filter}"
                >
                  <div class="drops_in">
                    <div class="tbs" @click="loadTests(ascendingOrder, 'user_id', userAuth.id); page = 0">
                      <i class="la la-border-all"></i>All
                    </div>
                    <div class="tbs" @click="() => {
                      isFiltered = true
                      loadTests(ascendingOrder, 'starred', true); page = 0
                    }">
                      <i class="lar la-star"></i>Starred
                    </div>
                    <div class="tbs">
                      <i class="la la-box"></i>Categories 
                    </div>

                    <div class="bg-neutral-50 max-h-[180px] overflow-auto">
                      <button
                        v-for="cat in categories"
                        :key="cat.key"
                        @click="() => {
                          isFiltered = true
                          loadTests(ascendingOrder, 'category', cat.name)
                        }"
                        class="catees"
                      >{{cat.name.replace(' ', '&nbsp;')}}</button>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
    
      
        <div class="grow">
          <transition appear @enter="slideUp">
            <div id="testGrid" class="xsm:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 justify-between w-full mx-auto mt-5 px-1.5">

              <div class="relative flex justify-center items-center rounded-lg border-[3px] border-dashed hover:border-solid xsm:h-full mb-4 xsm:mb-auto">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="w-full relative hidden lg:inline-block" viewBox="0 0 10 9"></svg>
                
                <div class="static lg:absolute top-0 w-full h-full flex justify-center items-center">
                  <button
                    @click="() => {addTest(); clickCreate = true}"
                    class="bg-slate-100 rounded-full flex justify-center items-center px-3 py-0.5 my-2 cursor-pointer border border-transparent hover:border-neutral-200"
                    :disabled="clickCreate"
                  >
                    <span class="text-4xl text-slate-300 font-bold">+</span>
                  </button>
                </div>
              </div>


              <div
                v-for="(test, i) in tests"
                :key="i"
                @click="openTest($event,test.uuid, test.published)"
                class="relative h-full bg-white rounded-lg border box-border mb-4 xsm:mb-auto cursor-pointer shadow-sm hover:shadow-lg"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="w-full relative hidden lg:inline-block" viewBox="0 0 10 9"></svg>

                  <div class="flex flex-col justify-between w-full h-full static lg:absolute top-0 p-3 mh-3 tests">
                    <div class="flex items-center justify-end text-xs text-slate-500">
                        <i class="la la-box text-lg"></i> {{test.category}}
                    </div>

                    <div class="my-3">
                        <p class="text-slate-600 text-sm font-semibold w-full truncate">{{test.title}}</p>
                        <p class="text-slate-400 text-sm">Updated {{test.updated_at}}</p>
                        <p class="text-slate-500 text-xs">{{test.published ? 'Published' : 'Not Published'}}</p>
                    </div>

                    <div class="flex justify-between text-slate-400/80 text-xl">
                        <div id="link" class="group tran active:scale-125">
                          <IconsLink
                            id="link"
                            :data-clipboard-text="test.published ? takeTestUrl+test.link : 'The test is not published.'"
                            class="copybtn cursor-pointer" :color="'fill-neutral-400/80 group-active:fill-cyan-400'" :size="22"
                          />
                        </div>

                        <div @click.stop="starTest(test.id, test.starred, i)" class="tran active:scale-125">
                          <IconsStar
                            class="cursor-pointer" :color="test.starred ? 'fill-yellow-400/90' : 'fill-neutral-400/80'" :size="22"
                          />
                        </div>
                        
                        <div @click.stop="removeTest(test.id)" class="tran active:scale-125">
                          <IconsTrash
                            class="cursor-pointer" :color="'fill-neutral-400/80'" :size="22"
                          />
                        </div>
                    </div>
                  </div>

              </div>

            </div>
          </transition>
        </div>


        <div class="self-end my-4 mr-3 flex justify-end">
          <button class="d_topBtns mr-2"
            @click="() => {
              isFiltered = false
              page = 0
              loadTests(ascendingOrder, 'user_id', userAuth.id)
            }"
          >
            <IconsRefresh :color="'fill-neutral-500/90'" :size="21" />
          </button>
          <button class="d_topBtns" 
            @click="() => {
              if((totalPages - 1) !== page) {
                isFiltered = false
                page += 1 
                loadTests(ascendingOrder)
              }
            }"
          >See More</button>
        </div>

      </div>
    </transition>


    <!--Not needed
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
    -->


    <DashboardLoader v-if="!tests" />

  </NuxtLayout>
</template>

<style>
.d_topBtns{@apply relative z-[10] flex items-center bg-neutral-100 rounded-md text-neutral-500/90 text-sm px-2 py-1 border border-transparent cursor-pointer hover:border-neutral-200}
.d_topBtns i{@apply text-base mr-1 }

.d_topBtns .drops{@apply absolute top-full right-0 origin-top duration-200 text-sm pt-1.5 }
.d_topBtns .drops_in{@apply bg-white rounded-md border shadow-md overflow-hidden }
.d_topBtns .drops .tbs{@apply flex items-center px-2 py-1 first:border-b border-neutral-100 hover:bg-neutral-50/80 w-full}
.d_topBtns .drops .tbs i{@apply mr-1 }

.d_topBtns .catees{@apply w-full text-start text-sm text-neutral-600/80 px-3 py-1.5 pl-6 border-b last:border-none hover:bg-neutral-100 }
</style>