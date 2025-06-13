export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api'
    }
  }, nitro: {
    proxy: {
      '/uploads': {
        target: process.env.API_BASE_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  css: ['./assets/css/main.css'],
  imports: {
    dirs: ['stores', 'composables']
  }
})