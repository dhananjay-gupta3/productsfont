<template>
    <div>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h2 class="font-bold text-lg tracking-tight text-gray-700 flex items-center gap-2">
          <span class="text-purple-500 text-xl animate-popBounce">👤</span>
          Users
        </h2>
        <button
          class="bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300 px-4 py-2 rounded-md text-white text-sm font-semibold shadow transition-all duration-200 active:scale-95"
          @click="showCreate = true"
        >
          + Add User
        </button>
      </div>
  
      <!-- Create User Form -->
      <transition name="fade-slide">
        <div v-if="showCreate" class="mb-4 bg-white rounded-lg shadow-md p-4 animate-fadein">
          <form @submit.prevent="handleCreate">
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="form.username"
                required
                placeholder="Username"
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-purple-200"
              />
              <input
                v-model="form.email"
                required
                type="email"
                placeholder="Email"
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-purple-200"
              />
              <input
                v-model="form.password"
                required
                type="password"
                placeholder="Password"
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-purple-200"
              />
              <button
                type="submit"
                class="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-1 font-semibold shadow transition"
              >
                Create
              </button>
              <button
                type="button"
                @click="showCreate = false"
                class="text-gray-500 ml-2 hover:text-red-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </transition>
  
      <!-- Users Table -->
      <div class="overflow-x-auto rounded-lg shadow">
        <table class="min-w-full text-sm bg-white">
          <thead>
            <tr class="bg-gradient-to-r from-purple-400 to-green-400 text-white">
              <th class="text-left px-3 py-2 font-semibold">Username</th>
              <th class="text-left px-3 py-2 font-semibold">Email</th>
              <th class="text-left px-3 py-2 font-semibold">Admin</th>
              <th class="text-left px-3 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user._id"
              class="hover:bg-purple-50 transition duration-150"
            >
              <td class="px-3 py-2 whitespace-nowrap">{{ user.username }}</td>
              <td class="px-3 py-2 whitespace-nowrap">{{ user.email }}</td>
              <td class="px-3 py-2 whitespace-nowrap">
                <span
                  class="inline-block px-2 py-0.5 rounded text-xs font-bold"
                  :class="user.isAdmin ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'"
                >{{ user.isAdmin ? 'Yes' : 'No' }}</span>
              </td>
              <td class="px-3 py-2 whitespace-nowrap">
                <button
                  class="text-blue-600 hover:underline font-medium transition"
                  @click="startEdit(user)"
                >Edit</button>
                <button
                  class="text-red-500 ml-3 hover:underline font-medium transition"
                  @click="handleDelete(user._id)"
                >Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Edit User Form -->
      <transition name="fade-slide">
        <div
          v-if="editUser"
          class="animate-fadein mt-6 bg-gradient-to-r from-purple-50 to-green-50 p-4 rounded-lg shadow-md"
        >
          <form @submit.prevent="handleEdit">
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="editUser.username"
                required
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-purple-200"
              />
              <input
                v-model="editUser.email"
                required
                type="email"
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-purple-200"
              />
              <label class="flex items-center gap-1 px-2 py-1">
                <input type="checkbox" v-model="editUser.isAdmin" />
                <span class="text-gray-700">Admin</span>
              </label>
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-1 font-semibold shadow transition"
              >Save</button>
              <button
                type="button"
                @click="editUser = null"
                class="text-gray-500 ml-2 hover:text-red-400 transition"
              >Cancel</button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  const props = defineProps(['users'])
  const emit = defineEmits(['refresh'])
  const showCreate = ref(false)
  const form = ref({ username: '', email: '', password: '' })
  const editUser = ref(null)
  const config = useRuntimeConfig()
  const token = ref('')
  
  onMounted(() => {
    if (typeof window !== 'undefined') {
      token.value = localStorage.getItem('token') || ''
    }
  })
  
  const handleCreate = async () => {
    await $fetch(`${config.public.apiBaseUrl}/admin/users`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token.value}` },
      body: form.value
    })
    showCreate.value = false
    form.value = { username: '', email: '', password: '' }
    emit('refresh')
  }
  const startEdit = user => { editUser.value = { ...user } }
  const handleEdit = async () => {
    await $fetch(`${config.public.apiBaseUrl}/admin/users/${editUser.value._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token.value}` },
      body: editUser.value
    })
    editUser.value = null
    emit('refresh')
  }
  const handleDelete = async id => {
    if (!confirm('Are you sure?')) return
    await $fetch(`${config.public.apiBaseUrl}/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token.value}` }
    })
    emit('refresh')
  }
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(24px);}
    100% { opacity: 1; transform: translateY(0);}
  }
  @keyframes popBounce {
    0% { opacity: 0; transform: scale(0.7);}
    80% { opacity: 1; transform: scale(1.12);}
    100% { opacity: 1; transform: scale(1);}
  }
  .animate-fadein {
    animation: fadeIn 0.5s cubic-bezier(.4,0,.2,1);
  }
  .animate-popBounce {
    animation: popBounce 0.7s cubic-bezier(.7,-0.01,.33,1.07);
  }
  .fade-slide-enter-active, .fade-slide-leave-active {
    transition: all 0.4s cubic-bezier(.4,0,.2,1);
  }
  .fade-slide-enter-from, .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(16px);
  }
  </style>