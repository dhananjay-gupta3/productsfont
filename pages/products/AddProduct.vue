<template>
    <div class="max-w-xl mx-auto p-6 bg-white rounded shadow-md mt-10">
      <h2 class="text-2xl font-bold mb-6">Add New Product</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block mb-1 font-semibold">Name</label>
          <input v-model="form.name" type="text" required class="w-full border rounded px-3 py-2" />
        </div>
  
        <div>
          <label class="block mb-1 font-semibold">Tagline</label>
          <input v-model="form.tagline" type="text" required class="w-full border rounded px-3 py-2" />
        </div>
  
        <div>
          <label class="block mb-1 font-semibold">Description</label>
          <textarea v-model="form.description" required class="w-full border rounded px-3 py-2" rows="4"></textarea>
        </div>
  
        <div>
          <label class="block mb-1 font-semibold">Website</label>
          <input v-model="form.website" type="url" required class="w-full border rounded px-3 py-2" />
        </div>
  
        <div>
          <label class="block mb-1 font-semibold">Category</label>
          <input v-model="form.category" type="text" required class="w-full border rounded px-3 py-2" />
        </div>
  
        <div>
          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
  
        <p v-if="error" class="text-red-600 font-semibold mt-4">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const config = useRuntimeConfig()
  
  const form = ref({
    name: '',
    tagline: '',
    description: '',
    website: '',
    category: ''
  })
  
  const error = ref(null)
  
  async function submitForm() {
    error.value = null
    try {
      // Get JWT token from localStorage (adjust if you store it somewhere else)
      const token = localStorage.getItem('token')
      if (!token) {
        error.value = 'You must be logged in to add a product.'
        return
      }
  
      await $fetch(`${config.public.apiBaseUrl}/products`, {
        method: 'POST',
        body: form.value,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
  
      router.push('/products') // Redirect to product listing page after success
    } catch (err) {
      error.value = 'Failed to add product. Please check your input and try again.'
      console.error(err)
    }
  }
  </script>
  
  <style scoped>
  /* Optional styling */
  </style>
  