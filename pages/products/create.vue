<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white px-2 py-8">
    <div class="w-full max-w-xl p-6 sm:p-10 bg-white rounded-2xl shadow-2xl animate-fadein">
      <div class="flex flex-col items-center gap-2 mb-6">
        <div class="bg-blue-100 p-3 rounded-full animate-popBounce shadow-md">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M20 21v-2a4 4 0 00-3-3.87M4 21v-2a4 4 0 013-3.87m13-8.13A4 4 0 0112 7a4 4 0 01-4 4m8-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 13v7" />
          </svg>
        </div>
        <h1 class="text-2xl font-extrabold text-gray-700 text-center tracking-tight">Create Product</h1>
      </div>
      <form @submit.prevent="submitForm" enctype="multipart/form-data" class="space-y-5">
        <!-- Name -->
        <div>
          <label class="block font-medium mb-1 text-gray-600">Name</label>
          <input v-model="form.name" type="text" class="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-200 focus:outline-none transition" required />
        </div>
        <!-- Tagline -->
        <div>
          <label class="block font-medium mb-1 text-gray-600">Tagline</label>
          <input v-model="form.tagline" type="text" class="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-200 focus:outline-none transition" required />
        </div>
        <!-- Description -->
        <div>
          <label class="block font-medium mb-1 text-gray-600">Description</label>
          <textarea v-model="form.description" class="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-200 focus:outline-none transition" required></textarea>
        </div>
        <!-- Website -->
        <div>
          <label class="block font-medium mb-1 text-gray-600">Website</label>
          <input v-model="form.website" type="url" class="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-200 focus:outline-none transition" required />
        </div>
        <!-- Category -->
        <div>
          <label class="block font-medium mb-1 text-gray-600">Category</label>
          <select v-model="form.category" class="border rounded-lg w-full p-2 focus:ring-2 focus:ring-blue-200 focus:outline-none transition" required>
            <option value="" disabled>Select category</option>
            <option value="AI">AI</option>
            <option value="SaaS">SaaS</option>
            <option value="DevTools">DevTools</option>
            <option value="Mobile">Mobile</option>
            <option value="Web">Web</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <!-- Product Logo -->
        <div>
          <label class="block font-medium mb-1 text-gray-600">Product Logo</label>
          <input type="file" @change="onFileChange" accept="image/*" class="border rounded-lg w-full bg-white p-2" required />
        </div>
        <!-- Preview -->
        <div v-if="previewLogo" class="flex items-center justify-center mt-2">
          <img :src="previewLogo" alt="Preview Logo" class="w-20 h-20 object-cover rounded shadow border" />
        </div>
        <!-- Submit -->
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 rounded-lg font-bold shadow-lg transition transform hover:-translate-y-0.5 active:scale-95 mt-2"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Creating...
          </span>
          <span v-else>Submit</span>
        </button>
      </form>
      <!-- Success message -->
      <div v-if="successMessage" class="mt-4 text-green-600 font-semibold animate-fadein text-center">
        {{ successMessage }}
      </div>
      <!-- Error message -->
      <div v-if="errorMessage" class="mt-4 text-red-600 font-semibold animate-shake text-center">
        {{ errorMessage }}
      </div>
      <!-- Uploaded Image Preview -->
      <div v-if="uploadedLogoUrl" class="mt-8">
        <h2 class="text-lg font-semibold mb-2 text-center">Uploaded Logo:</h2>
        <img :src="uploadedLogoUrl" alt="Uploaded Logo" class="mx-auto max-w-xs rounded shadow" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// If you use Pinia or another store, replace this section accordingly
// import { useAuthStore } from '@/stores/auth'
const config = useRuntimeConfig()
const form = ref({
  name: '',
  tagline: '',
  description: '',
  website: '',
  category: '',
  logo: null
})
const previewLogo = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const uploadedLogoUrl = ref('')
const loading = ref(false)

// You can replace this with your own way of getting the auth token
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem('token')
  }
  return ''
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  form.value.logo = file
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      previewLogo.value = ev.target.result
    }
    reader.readAsDataURL(file)
  } else {
    previewLogo.value = ''
  }
}

const submitForm = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  uploadedLogoUrl.value = ''
  loading.value = true

  try {
    const formData = new FormData()
    formData.append('name', form.value.name)
    formData.append('tagline', form.value.tagline)
    formData.append('description', form.value.description)
    formData.append('website', form.value.website)
    formData.append('category', form.value.category)
    formData.append('logo', form.value.logo)

    const token = getToken()

    const response = await fetch(`${config.public.apiBaseUrl}/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error creating product')
    }

    successMessage.value = 'Product created successfully!'
    uploadedLogoUrl.value = `${config.public.apiBaseUrl}/uploads/${data.data.logo}`

    // Reset form
    form.value = {
      name: '',
      tagline: '',
      description: '',
      website: '',
      category: '',
      logo: null
    }
    previewLogo.value = ''
  } catch (error) {
    errorMessage.value = error.message
  }
  loading.value = false
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