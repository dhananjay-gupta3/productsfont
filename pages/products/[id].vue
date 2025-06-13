<template>
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <!-- Error -->
    <div v-if="error" class="text-red-600 text-center text-lg font-semibold animate-pulse">
      ❌ Error loading product.
    </div>

    <!-- Loading -->
    <div v-else-if="pending" class="text-gray-600 text-center text-lg font-semibold animate-pulse">
      Loading...
    </div>

    <!-- Product Card -->
    <div
      v-else-if="product"
      class="bg-gradient-to-br from-white via-indigo-50 to-slate-100 p-4 md:p-6 rounded-2xl shadow-xl space-y-6 transition-all duration-500 ease-in-out transform hover:scale-[1.01] hover:shadow-2xl border border-slate-200"
      style="backdrop-filter: blur(2px);"
    >
      <!-- Product Image -->
      <div class="flex justify-center transition-opacity duration-700 ease-in-out opacity-0 animate-fadeIn mb-3">
        <img
          v-if="product.logo && !imageError"
          :src="imageUrl"
          alt="Product Logo"
          class="max-w-full max-h-48 object-contain bg-gradient-to-tl from-gray-100 via-indigo-100 to-gray-50 p-3 rounded-xl shadow hover:scale-105 transition-transform duration-700 border border-gray-200"
          @error="handleImageError"
        />
        <div
          v-else
          class="flex items-center justify-center h-48 bg-gradient-to-r from-gray-100 via-slate-50 to-gray-200 rounded-xl w-full text-gray-400 text-lg font-semibold animate-fadeIn border border-gray-200"
        >
          No Image Available
        </div>
      </div>

      <!-- Product Info -->
      <div class="space-y-3 animate-fadeIn">
        <h1
          class="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 via-blue-600 to-blue-400 transition-colors duration-300 drop-shadow hover:from-blue-400 hover:to-indigo-700 break-words text-center"
          style="letter-spacing: .03em;"
        >
          {{ product.name || 'No name provided' }}
        </h1>
        <p class="text-xs font-bold text-indigo-300 uppercase tracking-widest text-center drop-shadow-sm">Tagline</p>
        <p class="text-base md:text-lg text-indigo-600 font-semibold italic text-center px-2 break-words transition-all duration-300" style="letter-spacing: .01em;">
          {{ product.tagline || 'No tagline provided' }}
        </p>
        <p class="text-xs font-bold text-indigo-300 uppercase tracking-widest text-center mt-1">Description</p>
        <p class="text-base text-gray-700 whitespace-pre-line leading-relaxed text-center px-1 rounded-xl bg-white/70 shadow-inner py-2 transition-all duration-500">
          {{ product.description || 'No description provided' }}
        </p>

        <!-- Category & Website (Row) -->
        <div class="flex flex-col sm:flex-row sm:justify-between items-center gap-3 mt-2">
          <div class="flex flex-col items-center sm:items-start">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Category</span>
            <span class="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-blue-200 to-blue-50 text-blue-800 text-sm font-semibold shadow border border-blue-200 capitalize tracking-wide transition-all duration-300 hover:bg-blue-300 hover:text-indigo-900">
              {{ product.category || 'Not specified' }}
            </span>
          </div>
          <div class="flex flex-col items-center sm:items-end">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Website</span>
            <a
              v-if="product.website"
              :href="product.website"
              target="_blank"
              class="inline-block px-3 py-1 rounded-full font-bold transition-all duration-300 bg-gradient-to-tr from-cyan-500 to-blue-500 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md scale-95 hover:scale-105 border border-blue-200 hover:border-blue-400"
              style="font-size: 1rem; letter-spacing: .01em;"
            >
              🌐 Visit Website
            </a>
            <span v-else class="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-400 font-semibold">No website</span>
          </div>
        </div>

        <!-- Upvotes & Comments -->
        <div class="flex justify-center gap-6 mt-4">
          <div class="flex items-center space-x-2">
            <span class="text-2xl animate-bounce" style="animation-delay:.1s;">👍</span>
            <span class="text-base font-bold text-gray-800 select-none">{{ product.upvotesCount || 0 }}</span>
            <span class="text-xs font-semibold text-gray-400">Upvotes</span>
          </div>
          <div class="flex items-center space-x-2">
            <span class="text-2xl animate-bounce" style="animation-delay:.3s;">💬</span>
            <span class="text-base font-bold text-gray-800 select-none">{{ product.commentsCount || 0 }}</span>
            <span class="text-xs font-semibold text-gray-400">Comments</span>
          </div>
        </div>
      </div>

      <!-- User Info -->
      <div class="mt-7 border-t pt-4 animate-fadeIn">
        <h2 class="text-lg md:text-xl font-bold mb-3 text-indigo-700 tracking-wide text-center">Posted By</h2>
        <div class="flex items-center justify-center space-x-3">
          <div v-if="product.user?.avatar" class="w-11 h-11 rounded-full overflow-hidden ring-2 ring-indigo-400 shadow-md">
            <img
              :src="product.user.avatar"
              alt="User Avatar"
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
          <div>
            <p class="text-sm md:text-base text-gray-800 font-semibold">{{ product.user?.email || 'Unknown user' }}</p>
          </div>
        </div>
      </div>

      <!-- Created At -->
      <p class="text-xs md:text-sm text-gray-400 mt-4 text-center font-medium tracking-wide animate-fadeIn">
        Created: <span class="font-semibold text-gray-600">{{ formatDate(product.createdAt) }}</span>
      </p>
    </div>

    <!-- No Data -->
    <div v-else class="text-center py-8 text-gray-500 text-lg animate-fadeIn">No product data available</div>
  </div>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const imageError = ref(false)

const { data: productData, pending, error } = await useFetch(
  `${config.public.apiBaseUrl}/products/${route.params.id}`,
  {
    headers: useCookie('token').value
      ? { Authorization: `Bearer ${useCookie('token').value}` }
      : {}
  }
)

const product = ref(productData.value?.data || productData.value)

const imageUrl = computed(() => {
  if (!product.value?.logo) return ''

  if (product.value.logo.startsWith('http')) {
    return product.value.logo
  }

  const baseUrl = process.dev
    ? config.public.apiBaseUrl.replace('/api', '')
    : config.public.apiBaseUrl

  return `${baseUrl}/uploads/${product.value.logo}`
})

const handleImageError = () => {
  imageError.value = true
}

const formatDate = (dateString) => {
  if (!dateString) return 'Date not available'

  try {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  } catch {
    return 'Invalid date'
  }
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fadeIn {
  animation: fadeIn 0.85s cubic-bezier(.8, -.02, .32, 1.1) forwards;
}
@media (max-width: 700px) {
  .max-w-2xl { max-width: 98vw !important; }
  .rounded-2xl { border-radius: 1rem !important; }
  .max-h-48 { max-height: 110px !important; }
  .p-4, .md\:p-6 { padding: 0.7rem !important; }
}
</style>