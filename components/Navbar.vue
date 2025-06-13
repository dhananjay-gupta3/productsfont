<template>
  <nav class="bg-gray-800 text-white shadow-md">
    <div class="flex justify-between items-center p-4 max-w-7xl mx-auto">
      <!-- Logo -->
      <NuxtLink to="/" class="text-2xl font-bold tracking-wide">Products</NuxtLink>
      <!-- Hamburger (Mobile only) -->
      <button
        @click="isOpen = !isOpen"
        class="sm:hidden focus:outline-none text-gray-200 hover:text-white transition"
      >
        <svg
          v-if="!isOpen"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <!-- Desktop Menu -->
      <div class="hidden sm:flex space-x-6 items-center text-sm font-medium">
        <NuxtLink
          to="/"
          class="hover:text-green-400 transition-colors duration-300"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/products"
          class="hover:text-green-400 transition-colors duration-300"
        >
          Products
        </NuxtLink>
        <NuxtLink
          v-if="isLoggedIn"
          to="/profile"
          class="hover:text-green-400 transition-colors duration-300"
        >
          Profile
        </NuxtLink>
        <button
          v-if="isLoggedIn"
          @click="logout"
          class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition text-white text-sm"
        >
          Logout
        </button>
        <NuxtLink
          v-if="!isLoggedIn"
          to="/login"
          class="hover:text-green-400 transition-colors duration-300"
        >
          Login
        </NuxtLink>
        <NuxtLink
          v-if="!isLoggedIn"
          to="/signup"
          class="hover:text-green-400 transition-colors duration-300"
        >
          Signup
        </NuxtLink>
      </div>
    </div>
    <!-- Mobile Menu -->
    <transition name="slide-fade">
      <div
        v-if="isOpen"
        class="sm:hidden px-4 pb-4 space-y-3 bg-gray-800 text-center text-sm font-medium"
      >
        <NuxtLink
          to="/"
          class="block py-2 hover:text-green-400 transition"
          @click="closeMenu"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/products"
          class="block py-2 hover:text-green-400 transition"
          @click="closeMenu"
        >
          Products
        </NuxtLink>
        <NuxtLink
          v-if="isLoggedIn"
          to="/profile"
          class="block py-2 hover:text-green-400 transition"
          @click="closeMenu"
        >
          Profile
        </NuxtLink>
        <button
          v-if="isLoggedIn"
          @click="logout"
          class="block w-full bg-red-500 hover:bg-red-600 px-3 py-2 rounded text-white mx-auto transition"
        >
          Logout
        </button>
        <NuxtLink
          v-if="!isLoggedIn"
          to="/login"
          class="block py-2 hover:text-green-400 transition"
          @click="closeMenu"
        >
          Login
        </NuxtLink>
        <NuxtLink
          v-if="!isLoggedIn"
          to="/signup"
          class="block py-2 hover:text-green-400 transition"
          @click="closeMenu"
        >
          Signup
        </NuxtLink>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const isOpen = ref(false)
const isLoggedIn = ref(false)
const router = useRouter()

function checkLogin() {
  if (typeof window !== "undefined") {
    isLoggedIn.value = !!localStorage.getItem("token")
  }
}

onMounted(() => {
  checkLogin()
  window.addEventListener('storage', checkLogin)
})

function closeMenu() {
  isOpen.value = false
}

function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
  isLoggedIn.value = false
  closeMenu()
  router.push('/login')
}

// Listen for login/logout events across the app
if (typeof window !== "undefined") {
  window.addEventListener('login', checkLogin)
  window.addEventListener('logout', checkLogin)
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>