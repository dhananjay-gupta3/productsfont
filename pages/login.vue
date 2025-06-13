<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white">
    <form
      @submit.prevent="handleLogin"
      class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xs animate-fadein border border-green-100"
    >
      <div class="flex flex-col items-center gap-2 mb-6">
        <div class="bg-green-100 p-3 rounded-full animate-popBounce shadow-md">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
          </svg>
        </div>
        <h2 class="text-2xl font-extrabold text-gray-700 text-center tracking-tight">Login to your account</h2>
      </div>
      <label class="block mb-2 text-gray-600 text-sm font-semibold">Email</label>
      <input
        v-model="email"
        required
        type="email"
        placeholder="Enter your email"
        class="mb-4 px-3 py-2 border rounded-lg w-full focus:ring-2 focus:ring-green-200 focus:outline-none transition"
        autocomplete="username"
      />
      <label class="block mb-2 text-gray-600 text-sm font-semibold">Password</label>
      <div class="relative mb-3">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          required
          placeholder="Enter your password"
          class="px-3 py-2 border rounded-lg w-full focus:ring-2 focus:ring-green-200 focus:outline-none transition pr-10"
          autocomplete="current-password"
        />
        <button
          type="button"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-500 transition"
          @click="showPassword = !showPassword"
          tabindex="-1"
        >
          <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.965 9.965 0 013.25-7.5m2.25 2.25A7.96 7.96 0 0012 5c4.418 0 8 3.582 8 8 0 1.07-.208 2.09-.589 3.014M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15 12a3 3 0 01-6 0m6 0a3 3 0 00-6 0m6 0v0c0-1.657-1.343-3-3-3m0 0V5m0 7v7" />
          </svg>
        </button>
      </div>
      <button
        type="submit"
        class="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-2 rounded-lg font-bold shadow-lg transition transform hover:-translate-y-0.5 active:scale-95 mt-3"
      >Login</button>
      <div v-if="error" class="text-red-500 text-sm mt-2 text-center animate-shake">{{ error }}</div>
      <div class="text-center mt-5">
        <NuxtLink
          to="/signup"
          class="text-green-600 hover:underline font-semibold transition"
        >Don't have an account? <span class="underline">Signup</span></NuxtLink>
      </div>
    </form>
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
const showPassword = ref(false)

const handleLogin = async () => {
  error.value = ''
  try {
    const res = await fetch(`${config.public.apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    if (!res.ok) {
      error.value = 'Invalid email or password'
      return
    }
    const data = await res.json()
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    window.dispatchEvent(new Event('login'))
    router.push('/products')
  } catch (e) {
    error.value = 'An error occurred'
  }
}
</script>

<style scoped>
.animate-fadein {
  animation: fadeIn 0.5s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(32px);}
  100% { opacity: 1; transform: translateY(0);}
}
@keyframes popBounce {
  0% { opacity: 0; transform: scale(0.7);}
  80% { opacity: 1; transform: scale(1.1);}
  100% { opacity: 1; transform: scale(1);}
}
.animate-popBounce {
  animation: popBounce 0.7s cubic-bezier(.7,-0.01,.33,1.07);
}
@keyframes shake {
  10%, 90% { transform: translateX(-1px);}
  20%, 80% { transform: translateX(2px);}
  30%, 50%, 70% { transform: translateX(-4px);}
  40%, 60% { transform: translateX(4px);}
}
.animate-shake {
  animation: shake 0.4s;
}
</style>