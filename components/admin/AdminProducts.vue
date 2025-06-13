<template>
    <div>
      <!-- Header -->
      <!-- <div class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <h2 class="font-bold text-lg tracking-tight text-gray-700 flex items-center gap-2">
          <span class="text-green-500 text-xl animate-popBounce">📦</span>
          Products
        </h2>
        <button
          class="bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300 px-4 py-2 rounded-md text-white text-sm font-semibold shadow transition-all duration-200 active:scale-95"
          @click="showCreate = true"
        >
          + Add Product
        </button>
      </div> -->
  
      <!-- Create Product Form -->
      <transition name="fade-slide">
        <div v-if="showCreate" class="mb-4 bg-white rounded-lg shadow-md p-4 animate-fadein">
          <form @submit.prevent="handleCreate" enctype="multipart/form-data">
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="form.name"
                required
                placeholder="Name"
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-green-200"
              />
              <input
                v-model="form.tagline"
                required
                placeholder="Tagline"
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-green-200"
              />
              <select
                v-model="form.category"
                required
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-green-200"
              >
                <option value="">Category</option>
                <option>AI</option>
                <option>SaaS</option>
                <option>DevTools</option>
                <option>Mobile</option>
                <option>Web</option>
                <option>Other</option>
              </select>
              <input
                type="file"
                accept="image/*"
                @change="onCreateImageChange"
                class="border rounded px-2 py-1 flex-1 bg-white"
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
            <div v-if="formImagePreview" class="mt-2 flex justify-center">
              <img :src="formImagePreview" alt="Preview" class="w-20 h-20 object-cover rounded shadow border" />
            </div>
          </form>
        </div>
      </transition>
  
      <!-- Products Table -->
      <div class="overflow-x-auto rounded-lg shadow">
        <table class="min-w-full text-sm bg-white">
          <thead>
            <tr class="bg-gradient-to-r from-green-600 to-blue-500 text-white">
              <th class="text-left px-3 py-2 font-semibold">Image</th>
              <th class="text-left px-3 py-2 font-semibold">Name</th>
              <th class="text-left px-3 py-2 font-semibold">Tagline</th>
              <th class="text-left px-3 py-2 font-semibold">Category</th>
              <th class="text-left px-3 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in products"
              :key="product._id"
              class="hover:bg-green-50 transition duration-150"
            >
              <td class="px-3 py-2 whitespace-nowrap">
                <img
                  v-if="getProductImage(product)"
                  :src="getProductImage(product)"
                  alt="Product Image"
                  class="w-12 h-12 object-cover rounded shadow border"
                  @error="onImageError($event)"
                />
                <span v-else class="text-gray-300">—</span>
              </td>
              <td class="px-3 py-2 whitespace-nowrap">{{ product.name }}</td>
              <td class="px-3 py-2 whitespace-nowrap">{{ product.tagline }}</td>
              <td class="px-3 py-2 whitespace-nowrap">{{ product.category }}</td>
              <td class="px-3 py-2 whitespace-nowrap">
                <button
                  class="text-blue-600 hover:underline font-medium transition"
                  @click="startEdit(product)"
                >Edit</button>
                <button
                  class="text-red-500 ml-3 hover:underline font-medium transition"
                  @click="handleDelete(product._id)"
                >Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Edit Product Form -->
      <transition name="fade-slide">
        <div
          v-if="editProduct"
          class="animate-fadein mt-6 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg shadow-md"
        >
          <form @submit.prevent="handleEdit" enctype="multipart/form-data">
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                v-model="editProduct.name"
                required
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-green-200"
              />
              <input
                v-model="editProduct.tagline"
                required
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-green-200"
              />
              <select
                v-model="editProduct.category"
                required
                class="border rounded px-2 py-1 flex-1 focus:ring focus:ring-green-200"
              >
                <option value="">Category</option>
                <option>AI</option>
                <option>SaaS</option>
                <option>DevTools</option>
                <option>Mobile</option>
                <option>Web</option>
                <option>Other</option>
              </select>
              <input
                type="file"
                accept="image/*"
                @change="onEditImageChange"
                class="border rounded px-2 py-1 flex-1 bg-white"
              />
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-1 font-semibold shadow transition"
              >Save</button>
              <button
                type="button"
                @click="editProduct = null"
                class="text-gray-500 ml-2 hover:text-red-400 transition"
              >Cancel</button>
            </div>
            <div v-if="editImagePreview || getProductImage(editProduct)" class="mt-2 flex justify-center">
              <img
                :src="editImagePreview || getProductImage(editProduct)"
                alt="Preview"
                class="w-20 h-20 object-cover rounded shadow border"
                @error="onImageError($event)"
              />
            </div>
          </form>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const props = defineProps(['products'])
  const emit = defineEmits(['refresh'])
  const showCreate = ref(false)
  const form = ref({ name: '', tagline: '', category: '' })
  const formImage = ref(null)
  const formImagePreview = ref(null)
  const editProduct = ref(null)
  const editImage = ref(null)
  const editImagePreview = ref(null)
  const config = useRuntimeConfig()
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  
  // Helper: get correct image URL for product (handle relative/absolute, fallback to null)
  const getProductImage = (product) => {
    if (!product || !product.image) return null
    if (
      product.image.startsWith('http://') ||
      product.image.startsWith('https://') ||
      product.image.startsWith('data:')
    ) {
      return product.image
    }
    // Support both "image" and "logo" fields for edit (API inconsistency)
    if (product.logo && typeof product.logo === 'string') {
      return `${config.public.apiBaseUrl.replace(/\/$/, '')}/uploads/${product.logo.replace(/^\//, '')}`
    }
    return `${config.public.apiBaseUrl.replace(/\/$/, '')}/${product.image.replace(/^\//, '')}`
  }
  
  // Fallback for broken images
  const onImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/48x48?text=No+Image'
  }
  
  // Handle image preview on create
  const onCreateImageChange = (e) => {
    const file = e.target.files[0]
    formImage.value = file
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        formImagePreview.value = ev.target.result
      }
      reader.readAsDataURL(file)
    } else {
      formImagePreview.value = null
    }
  }
  
  // Handle image preview on edit
  const onEditImageChange = (e) => {
    const file = e.target.files[0]
    editImage.value = file
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        editImagePreview.value = ev.target.result
      }
      reader.readAsDataURL(file)
    } else {
      editImagePreview.value = null
    }
  }
  
  const handleCreate = async () => {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('tagline', form.value.tagline)
    formData.append('category', form.value.category)
    if (formImage.value) formData.append('image', formImage.value)
  
    await $fetch(`${config.public.apiBaseUrl}/admin/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    showCreate.value = false
    form.value = { name: '', tagline: '', category: '' }
    formImage.value = null
    formImagePreview.value = null
    emit('refresh')
  }
  
  const startEdit = (product) => {
    // Clear any previous image preview and file
    editProduct.value = { ...product }
    editImage.value = null
    editImagePreview.value = null
  }
  
  const handleEdit = async () => {
    const formData = new FormData()
    formData.append('name', editProduct.value.name)
    formData.append('tagline', editProduct.value.tagline)
    formData.append('category', editProduct.value.category)
    // Only append image if a new one was selected
    if (editImage.value) {
      formData.append('image', editImage.value)
    }
    await $fetch(`${config.public.apiBaseUrl}/admin/products/${editProduct.value._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    editProduct.value = null
    editImage.value = null
    editImagePreview.value = null
    emit('refresh')
  }
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return
    await $fetch(`${config.public.apiBaseUrl}/admin/products/${id}`, {
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