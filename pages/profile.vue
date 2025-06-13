<template>
    <div class="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex flex-col items-center py-10 px-2">
      <div v-if="loading" class="w-full flex flex-col items-center">
        <div class="spinner mb-4"></div>
        <div class="text-gray-500">Loading profile...</div>
      </div>
      <div v-else-if="user" class="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 animate-fadein flex flex-col items-center">
        <!-- Avatar and Basic Info -->
        <div class="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-4xl font-bold mb-4 shadow-md border-4 border-white animate-popBounce overflow-hidden">
          <span v-if="user.avatar">
            <img :src="user.avatar" alt="Avatar" class="w-full h-full object-cover rounded-full" />
          </span>
          <span v-else>
            {{ user.username ? user.username.charAt(0).toUpperCase() : '?' }}
          </span>
        </div>
        <div class="w-full text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-1">{{ user.username }}</h2>
          <p class="text-gray-600 mb-2">{{ user.email }}</p>
          <div class="flex justify-center gap-2 mt-2">
            <span v-if="user.isAdmin" class="px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium text-xs">Admin</span>
            <span class="px-3 py-1 rounded-full bg-green-100 text-green-600 font-medium text-xs">User</span>
          </div>
        </div>
        <button
          class="mt-6 bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded text-white text-sm font-semibold shadow active:scale-95"
          @click="handleLogout"
        >Logout</button>
  
        <!-- Submitted Products -->
        <div class="w-full mt-10">
          <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span class="text-green-500">📦</span> Submitted Products
          </h3>
          <div v-if="profileData.submittedProducts && profileData.submittedProducts.length" class="grid gap-4 sm:grid-cols-2">
            <div
              v-for="product in profileData.submittedProducts"
              :key="product._id"
              class="bg-gradient-to-br from-green-50 via-blue-50 to-white rounded-lg shadow p-4 flex flex-col animate-fadein"
            >
              <div class="flex items-center gap-3 mb-2">
                <img
                  v-if="product.logo"
                  :src="getImageUrl(product.logo)"
                  alt="logo"
                  class="w-12 h-12 object-cover rounded border shadow bg-white"
                  @error="onImageError($event)"
                />
                <div>
                  <div class="font-semibold text-lg">{{ product.name }}</div>
                  <div class="text-gray-500 text-sm">{{ product.tagline }}</div>
                </div>
              </div>
              <div class="flex flex-wrap gap-3 mt-1 text-xs">
                <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded">{{ product.category }}</span>
                <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Views: {{ product.analytics?.views ?? 0 }}</span>
                <span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Upvotes: {{ product.upvotesCount }}</span>
                <span class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Comments: {{ product.commentsCount }}</span>
              </div>
              <div class="mt-2 text-gray-400 text-xs">Created: {{ formatDate(product.createdAt) }}</div>
              <a
                v-if="product.website"
                :href="product.website"
                target="_blank"
                rel="noopener"
                class="mt-2 text-blue-500 hover:underline text-sm"
              >Visit Website</a>
            </div>
          </div>
          <div v-else class="text-gray-400 italic text-center py-4">No submitted products.</div>
        </div>
  
        <!-- Upvoted Products -->
        <div class="w-full mt-10">
          <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span class="text-yellow-400">👍</span> Upvoted Products
          </h3>
          <div v-if="profileData.upvotedProducts && profileData.upvotedProducts.length" class="grid gap-4 sm:grid-cols-2">
            <div
              v-for="product in profileData.upvotedProducts"
              :key="product._id"
              class="bg-gradient-to-br from-yellow-50 via-blue-50 to-white rounded-lg shadow p-4 flex flex-col animate-fadein"
            >
              <div class="flex items-center gap-3 mb-2">
                <img
                  v-if="product.logo"
                  :src="getImageUrl(product.logo)"
                  alt="logo"
                  class="w-12 h-12 object-cover rounded border shadow bg-white"
                  @error="onImageError($event)"
                />
                <div>
                  <div class="font-semibold text-lg">{{ product.name }}</div>
                  <div class="text-gray-500 text-sm">{{ product.tagline }}</div>
                </div>
              </div>
              <div class="flex flex-wrap gap-3 mt-1 text-xs">
                <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded">{{ product.category }}</span>
                <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Views: {{ product.analytics?.views ?? 0 }}</span>
                <span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Upvotes: {{ product.upvotesCount }}</span>
                <span class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Comments: {{ product.commentsCount }}</span>
              </div>
              <div class="mt-2 text-gray-400 text-xs">Created: {{ formatDate(product.createdAt) }}</div>
              <a
                v-if="product.website"
                :href="product.website"
                target="_blank"
                rel="noopener"
                class="mt-2 text-blue-500 hover:underline text-sm"
              >Visit Website</a>
            </div>
          </div>
          <div v-else class="text-gray-400 italic text-center py-4">No upvoted products.</div>
        </div>
      </div>
      <div v-else class="text-center w-full max-w-md bg-white rounded-xl shadow-lg p-6 animate-fadein">
        <div class="text-gray-400 mb-3 text-lg">You are not logged in.</div>
        <NuxtLink to="/login" class="inline-block bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white font-semibold shadow transition">Login</NuxtLink>
        <NuxtLink to="/signup" class="inline-block ml-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-semibold shadow transition">Signup</NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  const config = useRuntimeConfig()
  const user = ref(null)
  const profileData = ref({ submittedProducts: [], upvotedProducts: [] })
  const loading = ref(true)
  const router = useRouter()
  
  // Adjust this function if your API serves static files differently!
  const getImageUrl = (logo) => {
    if (!logo) return null
    // If logo is absolute URL
    if (logo.startsWith('http://') || logo.startsWith('https://') || logo.startsWith('data:')) {
      return logo
    }
    // Otherwise, assume it's a file served by your backend, e.g., http://localhost:5000/uploads/...
    return `${config.public.apiBaseUrl}/uploads/${logo.replace(/^\//, '')}`
  }
  const onImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/48x48?text=No+Image'
  }
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''
  
  const fetchProfile = async () => {
    loading.value = true
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        user.value = null
        profileData.value = { submittedProducts: [], upvotedProducts: [] }
        loading.value = false
        return
      }
      const res = await fetch(`${config.public.apiBaseUrl}/users/me/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error fetching profile')
      const apiData = await res.json()
      // The API returns { data: { ... } }
      const data = apiData.data || apiData
      user.value = data.user || data
      profileData.value = {
        submittedProducts: data.submittedProducts || [],
        upvotedProducts: data.upvotedProducts || []
      }
    } catch (e) {
      user.value = null
      profileData.value = { submittedProducts: [], upvotedProducts: [] }
    }
    loading.value = false
  }
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('logout'))
    }
    user.value = null
    profileData.value = { submittedProducts: [], upvotedProducts: [] }
    router.push('/login')
  }
  
  onMounted(fetchProfile)
  
  if (typeof window !== "undefined") {
    window.addEventListener('login', fetchProfile)
    window.addEventListener('logout', fetchProfile)
  }
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(24px);}
    100% { opacity: 1; transform: translateY(0);}
  }
  @keyframes popBounce {
    0% { opacity: 0; transform: scale(0.7);}
    80% { opacity: 1; transform: scale(1.1);}
    100% { opacity: 1; transform: scale(1);}
  }
  .animate-fadein {
    animation: fadeIn 0.5s cubic-bezier(.4,0,.2,1);
  }
  .animate-popBounce {
    animation: popBounce 0.7s cubic-bezier(.7,-0.01,.33,1.07);
  }
  .spinner {
    border: 4px solid #e5e7eb;
    border-top: 4px solid #34d399;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  @keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}
  }
  </style>