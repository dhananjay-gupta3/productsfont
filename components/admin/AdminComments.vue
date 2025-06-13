<template>
    <div>
      <!-- Header -->
      
  
      <!-- Create Comment Form -->
      <transition name="fade-slide">
        <div v-if="showCreate" class="mb-4 bg-white rounded-lg shadow-md p-4 animate-fadein">
          <form @submit.prevent="handleCreate">
            <div class="flex flex-col sm:flex-row gap-2">
              <select v-model="form.product" required class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-blue-200">
                <option value="">Product</option>
                <option v-for="p in products" :key="p._id" :value="p._id">{{ p.name }}</option>
              </select>
              <select v-model="form.user" required class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-blue-200">
                <option value="">User</option>
                <option v-for="u in users" :key="u._id" :value="u._id">{{ u.username }}</option>
              </select>
              <input
                v-model="form.content"
                required
                placeholder="Content"
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-blue-200"
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
  
      <!-- Comments Table -->
      <div class="overflow-x-auto rounded-lg shadow">
        <table class="min-w-full text-sm bg-white">
          <thead>
            <tr class="bg-gradient-to-r from-blue-600 to-green-500 text-white">
              <th class="text-left px-3 py-2 font-semibold">Product</th>
              <th class="text-left px-3 py-2 font-semibold">User</th>
              <th class="text-left px-3 py-2 font-semibold">Content</th>
              <th class="text-left px-3 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="comment in comments"
              :key="comment._id"
              class="hover:bg-blue-50 transition duration-150"
            >
              <td class="px-3 py-2 whitespace-nowrap">{{ productName(comment.product) }}</td>
              <td class="px-3 py-2 whitespace-nowrap">{{ userName(comment.user) }}</td>
              <td class="px-3 py-2">{{ comment.content }}</td>
              <td class="px-3 py-2">
                <button
                  class="text-blue-600 hover:underline font-medium transition"
                  @click="startEdit(comment)"
                >Edit</button>
                <button
                  class="text-red-500 ml-3 hover:underline font-medium transition"
                  @click="handleDelete(comment._id)"
                >Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Edit Comment Form -->
      <transition name="fade-slide">
        <div
          v-if="editComment"
          class="animate-fadein mt-6 bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg shadow-md"
        >
          <form @submit.prevent="handleEdit">
            <div class="flex flex-col sm:flex-row gap-2">
              <select v-model="editComment.product" required class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-blue-200">
                <option value="">Product</option>
                <option v-for="p in products" :key="p._id" :value="p._id">{{ p.name }}</option>
              </select>
              <select v-model="editComment.user" required class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-blue-200">
                <option value="">User</option>
                <option v-for="u in users" :key="u._id" :value="u._id">{{ u.username }}</option>
              </select>
              <input v-model="editComment.content" required class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-blue-200" />
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-1 font-semibold shadow transition"
              >Save</button>
              <button
                type="button"
                @click="editComment = null"
                class="text-gray-500 ml-2 hover:text-red-400 transition"
              >Cancel</button>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  const props = defineProps(['comments', 'users', 'products'])
  const emit = defineEmits(['refresh'])
  const showCreate = ref(false)
  const form = ref({ product: '', user: '', content: '' })
  const editComment = ref(null)
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')
  const productName = id => props.products.find(p => p._id === id)?.name || id
  const userName = id => props.users.find(u => u._id === id)?.username || id
  
  const handleCreate = async () => {
    await $fetch(`${config.public.apiBaseUrl}/admin/comments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form.value
    })
    showCreate.value = false
    form.value = { product: '', user: '', content: '' }
    emit('refresh')
  }
  const startEdit = comment => { editComment.value = { ...comment } }
  const handleEdit = async () => {
    await $fetch(`${config.public.apiBaseUrl}/admin/comments/${editComment.value._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: editComment.value
    })
    editComment.value = null
    emit('refresh')
  }
  const handleDelete = async id => {
    if (!confirm('Are you sure?')) return
    await $fetch(`${config.public.apiBaseUrl}/admin/comments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    emit('refresh')
  }
  </script>
  
  <style scoped>
  @keyframes fadeIn {
    0% { opacity: 0; transform: translateY(24px);}
    100% { opacity: 1; transform: translateY(0);}
  }
  .animate-fadein {
    animation: fadeIn 0.5s cubic-bezier(.4,0,.2,1);
  }
  @keyframes popBounce {
    0% { opacity: 0; transform: scale(0.7);}
    80% { opacity: 1; transform: scale(1.12);}
    100% { opacity: 1; transform: scale(1);}
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