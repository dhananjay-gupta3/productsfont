<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10 space-y-6">
    <h1 class="text-4xl font-bold text-gray-800 mb-6 text-center">Edit Product</h1>

    <form v-if="product" @submit.prevent="submitForm" class="space-y-5" enctype="multipart/form-data">
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input v-model="form.name" type="text" placeholder="Product Name" required class="input" />
      </div>

      <!-- Category -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <input v-model="form.category" type="text" placeholder="Category" required class="input" />
      </div>

      <!-- Tagline -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
        <input v-model="form.tagline" type="text" placeholder="Tagline" required class="input" />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea v-model="form.description" placeholder="Description" rows="4" required class="input"></textarea>
      </div>

      <!-- Website -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
        <input v-model="form.website" type="url" placeholder="https://example.com" class="input" />
      </div>

      <!-- Current Image Preview -->
      <div v-if="product.logo" class="mt-4">
        <p class="text-sm text-gray-600 mb-1">Current Image:</p>
        <img :src="`${config.public.apiBaseUrl}/uploads/${product.logo}`" alt="Current Logo" class="w-32 h-32 object-cover rounded shadow" />
      </div>

      <!-- New Image Upload -->
      <div>
        <p class="text-sm text-gray-600 mb-1">Upload New Image:</p>
        <label class="block">
          <input
            type="file"
            @change="handleImageChange"
            accept="image/*"
            class="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
          />
        </label>
        <div v-if="previewImage" class="mt-2">
          <p class="text-sm text-gray-600 mb-1">Preview:</p>
          <img :src="previewImage" alt="Preview" class="w-32 h-32 object-cover rounded shadow" />
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="btn-primary w-full">Update Product</button>

      <!-- Error -->
      <p v-if="error" class="text-red-600 mt-2 text-center font-medium">{{ error }}</p>
    </form>

    <p v-else class="text-center text-gray-500 py-10 text-lg">Loading product details...</p>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const productId = route.query.id
const config = useRuntimeConfig()

const product = ref(null)
const error = ref(null)

const form = reactive({
  name: '',
  category: '',
  tagline: '',
  description: '',
  website: ''
})

const imageFile = ref(null) // New image file
const previewImage = ref(null) // Preview URL

async function fetchProduct() {
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/products/id/${productId}`)
    product.value = res.product
    Object.assign(form, {
      name: product.value.name,
      category: product.value.category,
      tagline: product.value.tagline,
      description: product.value.description,
      website: product.value.website
    })
  } catch {
    error.value = 'Failed to load product details.'
  }
}

function handleImageChange(event) {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    previewImage.value = URL.createObjectURL(file)
  } else {
    imageFile.value = null
    previewImage.value = null
  }
}

async function submitForm() {
  error.value = null
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      error.value = 'You must be logged in to update a product.'
      return
    }

    // Prepare form data
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('category', form.category)
    formData.append('tagline', form.tagline)
    formData.append('description', form.description)
    formData.append('website', form.website)
    if (imageFile.value) {
      formData.append('logo', imageFile.value) // append new image only if selected
    }

    // Send PUT request
    await $fetch(`${config.public.apiBaseUrl}/products/${productId}`, {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    router.push('/products')
  } catch {
    error.value = 'Failed to update product.'
  }
}

onMounted(fetchProduct)
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #d1d5db; /* gray-300 */
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #374151; /* gray-700 */
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input:focus {
  border-color: #3b82f6; /* blue-500 */
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); /* blue focus ring */
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.3s, transform 0.2s;
}
.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px) scale(1.02);
}
</style>
