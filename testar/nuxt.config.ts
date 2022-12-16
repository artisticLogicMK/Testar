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
        { name: 'description', content: '...' },
        { name: 'og:image', content: '...' },
        { name: 'theme-color', content: '...' }
      ],
      script: [
        {src: 'https://unpkg.com/alpinejs@3.10.5/dist/cdn.min.js'},
        {children: 'window.Alpine = Alpine;Alpine.start()'}
      ]
    },
    
  }
})
