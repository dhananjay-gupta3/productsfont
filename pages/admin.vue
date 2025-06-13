<template>
  <div class="bg-gradient-to-br from-slate-100 via-blue-50 to-white min-h-screen pb-8">
    <!-- Admin Header -->
    <header class="sticky top-0 z-20 bg-gray-900/70 backdrop-blur-md shadow-lg text-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between transition-all duration-300">
      <div class="flex items-center gap-4">
        <svg class="w-10 h-10 text-green-400 drop-shadow-xl animate-headerPop" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <h1 class="text-3xl font-extrabold tracking-tight drop-shadow-lg animate-headerPop">Admin Panel</h1>
      </div>
      <div class="mt-3 sm:mt-0 flex gap-3">
        <button @click="fetchAll" class="bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300/80 px-5 py-2 rounded-lg text-base font-semibold shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-2">
          <svg class="w-5 h-5 animate-spin" v-if="loading" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="4" class="opacity-30" />
            <path d="M4 12a8 8 0 018-8" stroke-width="4" class="opacity-80" />
          </svg>
          <span>{{ loading ? 'Refreshing...' : 'Refresh Data' }}</span>
        </button>
      </div>
    </header>

    <!-- Analytics Section -->
    <div class="max-w-7xl mx-auto mt-8 px-2 animate-fadein">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden min-w-0 group">
          <div class="w-14 h-14 flex items-center justify-center rounded-full mb-2 shadow bg-green-100 group-hover:bg-green-200 transition-all duration-200">
            <svg class="w-7 h-7 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M17 20h5v-2a4 4 0 00-3-3.87" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="9" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 13a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="text-3xl font-bold drop-shadow text-green-600 text-center">{{ analytics.totalUsers ?? '...' }}</div>
          <div class="mt-2 text-gray-600 font-medium text-base text-center">Users</div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden min-w-0 group">
          <div class="w-14 h-14 flex items-center justify-center rounded-full mb-2 shadow bg-blue-100 group-hover:bg-blue-200 transition-all duration-200">
            <svg class="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 10h16" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="text-3xl font-bold drop-shadow text-blue-600 text-center">{{ analytics.totalProducts ?? '...' }}</div>
          <div class="mt-2 text-gray-600 font-medium text-base text-center">Products</div>
        </div>
        <div class="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition-all duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer relative overflow-hidden min-w-0 group">
          <div class="w-14 h-14 flex items-center justify-center rounded-full mb-2 shadow bg-purple-100 group-hover:bg-purple-200 transition-all duration-200">
            <svg class="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h12a2 2 0 012 2z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="text-3xl font-bold drop-shadow text-purple-600 text-center">{{ analytics.totalComments ?? '...' }}</div>
          <div class="mt-2 text-gray-600 font-medium text-base text-center">Comments</div>
        </div>
      </div>

      <!-- Trending/Recent Tables -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <AdminTable
          title="Trending Products"
          icon="🔥"
          :items="analytics.trendingProducts"
          :fields="['name', 'upvotesCount']"
          :empty="'No trending products.'"
        />
        <AdminTable
          title="Most Commented"
          icon="💬"
          :items="analytics.mostCommentedProducts"
          :fields="['name', 'commentsCount']"
          :empty="'No commented products.'"
        />
        <AdminTable
          title="Latest Products"
          icon="🆕"
          :items="analytics.latestProducts"
          :fields="['name', 'createdAt']"
          :empty="'No products.'"
        />
      </div>
    </div>

    <!-- Tabs for CRUD -->
    <div class="max-w-7xl mx-auto mt-10 px-2">
      <div class="flex flex-wrap justify-center gap-3 animate-fadein">
        <button v-for="tab in tabs" :key="tab"
          :class="[
            'px-5 py-2 rounded-t-lg text-sm font-semibold focus:outline-none shadow transition-all duration-200',
            activeTab === tab
              ? 'bg-green-600 text-white scale-105 shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-green-100 hover:scale-105'
          ]"
          @click="activeTab = tab"
        >{{ tab }}</button>
      </div>
      <transition name="fade">
        <div class="bg-white rounded-b-lg shadow p-6 animate-fadein overflow-x-auto" :key="activeTab">
          <AdminUsers v-if="activeTab==='Users'" :users="users" @refresh="fetchUsers" />
          <AdminProducts v-if="activeTab==='Products'" :products="products" @refresh="fetchProducts" />
          <AdminComments v-if="activeTab==='Comments'" :comments="comments" @refresh="fetchComments" :users="users" :products="products" />
          <AdminVotes v-if="activeTab==='Votes'" :votes="votes" :users="users" :products="products" @refresh="fetchVotes" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminTable from '~/components/admin/AdminTable.vue'
import AdminUsers from '~/components/admin/AdminUsers.vue'
import AdminProducts from '~/components/admin/AdminProducts.vue'
import AdminComments from '~/components/admin/AdminComments.vue'
import AdminVotes from '~/components/admin/AdminVotes.vue'

const config = useRuntimeConfig()
const analytics = ref({})
const users = ref([])
const products = ref([])
const comments = ref([])
const votes = ref([])
const loading = ref(false)

const tabs = ['Users', 'Products', 'Comments', 'Votes']
const activeTab = ref('Users')

const fetchAnalytics = async () => {
  analytics.value = {}
  try {
    const token = localStorage.getItem("token")
    const res = await $fetch(`${config.public.apiBaseUrl}/admin/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    analytics.value = res
  } catch { analytics.value = {} }
}
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token")
    users.value = await $fetch(`${config.public.apiBaseUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch { users.value = [] }
}
const fetchProducts = async () => {
  try {
    const token = localStorage.getItem("token")
    products.value = await $fetch(`${config.public.apiBaseUrl}/admin/products`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch { products.value = [] }
}
const fetchComments = async () => {
  try {
    const token = localStorage.getItem("token")
    comments.value = await $fetch(`${config.public.apiBaseUrl}/admin/comments`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch { comments.value = [] }
}
const fetchVotes = async () => {
  try {
    const token = localStorage.getItem("token")
    votes.value = await $fetch(`${config.public.apiBaseUrl}/admin/votes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  } catch { votes.value = [] }
}
const fetchAll = async () => {
  loading.value = true
  await Promise.all([
    fetchAnalytics(),
    fetchUsers(),
    fetchProducts(),
    fetchComments(),
    fetchVotes()
  ])
  loading.value = false
}

onMounted(fetchAll)
</script>

<style scoped>
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(24px);}
  100% { opacity: 1; transform: translateY(0);}
}
@keyframes headerPop {
  0% { opacity: 0; transform: scale(0.8);}
  80% { opacity: 1; transform: scale(1.08);}
  100% { opacity: 1; transform: scale(1);}
}
.animate-fadein {
  animation: fadeIn 0.6s cubic-bezier(.4,0,.2,1);
}
.animate-headerPop {
  animation: headerPop 0.6s cubic-bezier(.4,0,.2,1);
}
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s cubic-bezier(.4,0,.2,1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>