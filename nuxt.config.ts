// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss','nuxt-icon','@nuxtjs/supabase', '@vueuse/nuxt'],
  build: {
    //transpile: ['alpinejs']
  },
  components: {
    dirs: [
      '~/components',
    ]
  },
  app: {
    head: {
      title: "Testar: Create tests and quizzes.",
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' },
        { name: 'description', content: 'Testar is an app for creating and publishing online tests and quizzes. With its user-friendly dashboard, professionals and hobbyists can quickly create engaging tests to assess knowledge and understanding. Testar makes it easy to share tests with others through a link, allowing them to participate and take the test. It\'s an excellent solution for anyone in need of a reliable and efficient way to create and administer online tests and quizzes.' },
        { name: 'og:image', content: '...' },
        { name: 'theme-color', content: '#138aa5' }
      ],
      script: [
        {src: 'https://unpkg.com/alpinejs@3.10.5/dist/cdn.min.js', defer: true},
        {src: 'https://cdn.jsdelivr.net/npm/clipboard@2.0.10/dist/clipboard.min.js', defer: true}
      ]
    },
    
  }
})
