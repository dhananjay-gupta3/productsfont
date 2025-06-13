<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-8 animate-fadein">
        <h2 class="text-2xl font-bold mb-6 text-gray-800 text-center">Admin Login</h2>
        <form @submit.prevent="handleAdminLogin">
          <div class="mb-4">
            <label class="block mb-1 font-medium text-gray-700">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-200"
              placeholder="admin@example.com"
            />
          </div>
          <div class="mb-6">
            <label class="block mb-1 font-medium text-gray-700">Password</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-200"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
            :disabled="loading"
          >
            <span v-if="loading">Logging in...</span>
            <span v-else>Login as Admin</span>
          </button>
          <div v-if="error" class="text-red-600 text-sm mt-4 text-center">{{ error }}</div>
        </form>
        <div class="mt-6 text-center">
          <NuxtLink to="/login" class="text-blue-500 hover:underline text-sm">User Login</NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const config = useRuntimeConfig()
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const error = ref('')
  const loading = ref(false)
  
  const handleAdminLogin = async () => {
    error.value = ''
    loading.value = true
    try {
      const res = await $fetch(`${config.public.apiBaseUrl}/auth/login`, {
        method: 'POST',
        body: { email: email.value, password: password.value }
      })
      // Check admin status
      if (!res.data?.isAdmin && res.data?.role !== 'admin') {
        error.value = 'You are not an admin!'
        loading.value = false
        return
      }
      // Save token and user
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.token)
        localStorage.setItem('user', JSON.stringify(res.data))
      }
      // Optionally, call your auth composable to refresh state
      if (typeof useAuth === 'function') {
        useAuth().setUser(res.data)
      }
      router.push('/admin')
    } catch (e) {
      error.value = e?.data?.message || 'Admin login failed'
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .animate-fadein {
    animation: fadeIn .5s cubic-bezier(.4,0,.2,1);
  }
  @keyframes fadeIn {
    0% { opacity:0; transform: translateY(24px);}
    100% { opacity:1; transform: translateY(0);}
  }
  </style>