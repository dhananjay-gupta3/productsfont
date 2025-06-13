<template>
    <div>
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h2 class="font-bold text-lg tracking-tight text-gray-700 flex items-center gap-2">
          <span class="text-yellow-500 text-xl animate-popBounce">👍</span>
          Votes
        </h2>
      </div>
      <!-- Votes Table -->
      <div class="overflow-x-auto rounded-lg shadow">
        <table class="min-w-full text-sm bg-white">
          <thead>
            <tr class="bg-gradient-to-r from-yellow-200 to-yellow-100">
              <th class="text-left px-3 py-2 font-semibold">Product</th>
              <th class="text-left px-3 py-2 font-semibold">User</th>
              <th class="text-left px-3 py-2 font-semibold">Created At</th>
              <th class="text-left px-3 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="vote in votes"
              :key="vote._id"
              class="hover:bg-yellow-50 transition duration-150"
            >
              <td class="px-3 py-2 whitespace-nowrap">{{ productName(vote.product) }}</td>
              <td class="px-3 py-2 whitespace-nowrap">{{ userName(vote.user) }}</td>
              <td class="px-3 py-2 whitespace-nowrap">{{ formatDate(vote.createdAt) }}</td>
              <td class="px-3 py-2 whitespace-nowrap">
                <button
                  class="text-red-500 hover:underline font-medium transition"
                  @click="handleDelete(vote._id)"
                >Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps(['votes','products','users'])
  const emit = defineEmits(['refresh'])
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')
  const productName = id => props.products.find(p => p._id === id)?.name || id
  const userName = id => props.users.find(u => u._id === id)?.username || id
  const formatDate = d =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''
  const handleDelete = async id => {
    if (!confirm('Are you sure?')) return
    await $fetch(`${config.public.apiBaseUrl}/admin/votes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    emit('refresh')
  }
  </script>
  
  <style scoped>
  @keyframes popBounce {
    0% { opacity: 0; transform: scale(0.7);}
    80% { opacity: 1; transform: scale(1.13);}
    100% { opacity: 1; transform: scale(1);}
  }
  .animate-popBounce {
    animation: popBounce 0.6s cubic-bezier(.7,-0.01,.33,1.07);
  }
  </style>