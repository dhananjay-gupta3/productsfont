<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Header & Filter/Sort Controls -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <h1 class="text-3xl font-bold text-center sm:text-left">All Products</h1>
      <NuxtLink
        to="products/create"
        class="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 text-sm transition font-semibold"
      >
        ➕ Add New Product
      </NuxtLink>
    </div>

    <!-- Filters & Sort -->
    <div class="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center">
      <!-- Category Filter -->
      <div>
        <label class="font-semibold mr-2">Category:</label>
        <select v-model="selectedCategory" @change="fetchProducts" class="border px-3 py-2 rounded">
          <option value="">All</option>
          <option value="AI">AI</option>
          <option value="SaaS">SaaS</option>
          <option value="DevTools">DevTools</option>
          <option value="Mobile">Mobile</option>
          <option value="Web">Web</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>

    <!-- Loading/Error States -->
    <div v-if="error" class="text-red-600 text-center">❌ Error loading products.</div>
    <div v-else-if="loading" class="text-gray-600 text-center">Loading...</div>

    <!-- Product List -->
    <div class="flex flex-wrap gap-8 justify-center">
      <div
        v-for="product in products"
        :key="product._id"
        class="product-card bg-white flex flex-col justify-between transition duration-300"
      >
        <!-- Product Image -->
        <NuxtLink
          :to="`/products/${product._id}`"
          class="block mb-4 hover:cursor-pointer"
        >
          <div class="flex justify-center items-center h-40 bg-gray-100 rounded-lg mb-3 overflow-hidden">
            <img
              v-if="product.logo && !brokenImages[product._id]"
              :src="getImageUrl(product.logo)"
              alt="Product Logo"
              class="max-h-40 object-contain transition-transform duration-300 hover:scale-110"
              @error="handleImageError(product._id)"
            />
            <div v-else class="text-gray-400 text-sm">No Image Available</div>
          </div>
          <h2 class="text-xl font-bold text-center mb-1 truncate">{{ product.name }}</h2>
          <p class="text-gray-600 text-sm mb-2 truncate text-center">{{ product.tagline }}</p>
          <p class="text-xs text-gray-400 text-center">Category: {{ product.category }}</p>
        </NuxtLink>

        <!-- Voting and Comments -->
        <div class="flex items-center justify-between mt-2 mb-3 px-4">
          <button 
            @click.stop="toggleVote(product)"
            class="vote-btn flex items-center gap-1 rounded-full px-3 py-1.5 transition"
            :title="product.userHasVoted ? 'Remove Upvote' : 'Upvote'"
          >
            <svg v-if="product.userHasVoted"
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-pink-500 transition"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3.172 5.172a4 4 0 015.656 0l.172.172.172-.172a4 4 0 015.656 5.656l-5.656 5.656-5.656-5.656a4 4 0 010-5.656z"/>
            </svg>
            <svg v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-400 group-hover:text-pink-400 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0l1.318 1.318 1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.682l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
            <span class="text-base select-none font-medium text-slate-700">{{ product.upvotesCount ?? 0 }}</span>
          </button>
          <button 
            @click.stop="toggleComments(product._id)"
            class="text-sm text-gray-400 hover:text-blue-500 flex items-center transition"
            title="Show Comments"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {{ product.comments?.length || 0 }}
          </button>
        </div>

        <!-- Actions -->
        <div class="flex justify-center gap-3 px-4 pb-4 mt-2">
          <button
            @click.stop="openEditModal(product)"
            class="rounded-md bg-blue-500 py-2 px-4 text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none"
          >
            ✏️ Edit
          </button>
          <button
            @click.stop="deleteProduct(product._id)"
            class="rounded-md bg-red-500 py-2 px-4 text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none"
          >
            🗑 Delete
          </button>
        </div>

        <!-- Comments Section -->
        <div 
          v-if="expandedComments[product._id]" 
          class="px-4 pb-4 pt-0 mt-2 border-t animate-commentslide"
        >
          <div class="max-h-60 overflow-y-auto mb-3 space-y-3">
            <div v-if="!product.comments || product.comments.length === 0" class="text-sm text-gray-500 text-center">
              No comments yet
            </div>
            <div 
              v-for="comment in product.comments" 
              :key="comment._id"
              class="p-2 bg-blue-50 rounded-lg"
              :class="{
                'ml-8': comment.parentComment
              }"
            >
              <div class="flex justify-between items-start">
                <div class="font-medium text-sm text-blue-700">{{ comment.username || 'Anonymous' }}</div>
                <div class="text-xs text-gray-400">{{ formatDate(comment.createdAt) }}</div>
              </div>
              <p class="text-sm mt-1">{{ comment.content }}</p>
              <button 
                @click.stop="toggleReplyForm(comment._id)"
                class="text-xs text-blue-500 mt-1 hover:underline"
              >
                Reply
              </button>
              <div v-if="comment.replies && comment.replies.length > 0" class="mt-2 space-y-2">
                <div 
                  v-for="reply in comment.replies" 
                  :key="reply._id"
                  class="p-2 bg-purple-50 rounded-lg ml-4"
                >
                  <div class="flex justify-between items-start">
                    <div class="font-medium text-sm text-purple-600">{{ reply.username || 'Anonymous' }}</div>
                    <div class="text-xs text-gray-400">{{ formatDate(reply.createdAt) }}</div>
                  </div>
                  <p class="text-sm mt-1">{{ reply.content }}</p>
                </div>
              </div>
              <form 
                v-if="showReplyForm[comment._id]"
                @submit.prevent="submitReply(comment._id)"
                class="mt-2"
              >
                <textarea
                  v-model="replyTexts[comment._id]"
                  placeholder="Write your reply..."
                  class="w-full border rounded px-2 py-1 text-sm"
                  rows="2"
                  required
                ></textarea>
                <div class="flex justify-end space-x-2 mt-2">
                  <button 
                    type="button"
                    @click.stop="toggleReplyForm(comment._id)"
                    class="text-xs px-2 py-1 text-gray-500"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    class="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                    :disabled="replyLoading[comment._id]"
                  >
                    <span v-if="replyLoading[comment._id]">Posting...</span>
                    <span v-else>Post Reply</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
          <form @submit.prevent="submitComment(product._id)" class="mt-2">
            <textarea
              v-model.trim="commentTexts[product._id]"
              placeholder="Add a comment..."
              class="w-full border rounded px-3 py-2 text-sm"
              rows="2"
              required
            ></textarea>
            <button 
              type="submit"
              class="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              :disabled="commentLoading[product._id]"
            >
              <span v-if="commentLoading[product._id]">Posting...</span>
              <span v-else>Post Comment</span>
            </button>
          </form>
        </div>
      </div>
    </div>
    <!-- Alert -->
    <div v-if="alert.show" :class="`mt-4 text-center font-medium ${alert.type === 'success' ? 'text-green-600' : 'text-red-600'}`">
      {{ alert.message }}
    </div>
    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-2"
    >
      <div class="bg-white p-6 rounded-xl shadow-md w-full max-w-lg animate-fadeIn">
        <h2 class="text-xl font-bold mb-4">Edit Product</h2>
        <form @submit.prevent="updateProduct" enctype="multipart/form-data">
          <div class="mb-4">
            <label class="block font-medium">Name</label>
            <input v-model="editForm.name" class="w-full border rounded px-3 py-2 mt-1" required />
          </div>
          <div class="mb-4">
            <label class="block font-medium">Tagline</label>
            <input v-model="editForm.tagline" class="w-full border rounded px-3 py-2 mt-1" required />
          </div>
          <div class="mb-4">
            <label class="block font-medium">Description</label>
            <textarea
              v-model="editForm.description"
              class="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block font-medium">Website</label>
            <input v-model="editForm.website" class="w-full border rounded px-3 py-2 mt-1" type="url" required />
          </div>
          <div class="mb-4">
            <label class="block font-medium">Category</label>
            <select v-model="editForm.category" class="w-full border rounded px-3 py-2 mt-1" required>
              <option value="">-- Select --</option>
              <option value="AI">AI</option>
              <option value="SaaS">SaaS</option>
              <option value="DevTools">DevTools</option>
              <option value="Mobile">Mobile</option>
              <option value="Web">Web</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block font-medium">Product Image</label>
            <input 
              type="file" 
              @change="handleProductImageUpload"
              accept="image/*"
              class="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            >
            <div v-if="editForm.logo" class="mt-2">
              <p class="text-sm text-gray-600">Current Image:</p>
              <img :src="getImageUrl(editForm.logo)" alt="Current product image" class="h-20 mt-1">
            </div>
          </div>
          <div class="flex justify-end gap-2 flex-wrap">
            <button
              type="button"
              @click="showEditModal = false"
              class="bg-gray-300 text-black px-4 py-2 rounded"
              :disabled="modalLoading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              :disabled="modalLoading"
            >
              <span v-if="modalLoading">Saving...</span>
              <span v-else>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const products = ref([])
const loading = ref(true)
const error = ref(false)
const alert = ref({
  show: false,
  message: '',
  type: 'success'
})
const expandedComments = ref({})
const showReplyForm = ref({})
const commentTexts = ref({})
const replyTexts = ref({})
const commentLoading = ref({})
const replyLoading = ref({})
const showEditModal = ref(false)
const editForm = ref({})
const editingId = ref(null)
const productImage = ref(null)
const modalLoading = ref(false)
const brokenImages = ref({})

const selectedCategory = ref("")
const sortOrder = ref("latest")

const showAlert = (message, type = 'success', duration = 3000) => {
  alert.value = { show: true, message, type }
  setTimeout(() => {
    alert.value.show = false
  }, duration)
}

// Fetch all products + user vote status & upvote count
const fetchProducts = async () => {
  loading.value = true
  error.value = false
  try {
    let url = `${config.public.apiBaseUrl}/products?sort=${sortOrder.value}`
    if (selectedCategory.value) {
      url += `&category=${encodeURIComponent(selectedCategory.value)}`
    }
    const userToken = localStorage.getItem('token') || ''
    const response = await $fetch(url, {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    })
    // Enhance each product with upvote count and user vote status
    const userVotePromises = []
    const upvotesPromises = []
    for (const product of response.data || []) {
      // Get upvotes count
      upvotesPromises.push(fetchUpvotesCount(product._id))
      // Get user vote status if logged in
      if (userToken) {
        userVotePromises.push(fetchHasUpvoted(product._id, userToken))
      } else {
        userVotePromises.push(Promise.resolve(false))
      }
    }
    const upvotesResults = await Promise.all(upvotesPromises)
    const userVoteResults = await Promise.all(userVotePromises)
    products.value = (response.data || []).map((product, idx) => ({
      ...product,
      upvotesCount: upvotesResults[idx],
      userHasVoted: userVoteResults[idx]
    }))
  } catch (e) {
    console.error('Error fetching products:', e)
    error.value = true
    showAlert('Failed to load products', 'error')
  } finally {
    loading.value = false
  }
}

const fetchUpvotesCount = async (productId) => {
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/votes/count/${productId}`)
    return res.upvotesCount ?? 0
  } catch {
    return 0
  }
}

const fetchHasUpvoted = async (productId, token) => {
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/votes/has-upvoted/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return res.upvoted === true
  } catch {
    return false
  }
}

const toggleVote = async (product) => {
  const userToken = localStorage.getItem('token') || ''
  if (!userToken) {
    showAlert("You must be logged in to upvote.", "error")
    return
  }
  const idx = products.value.findIndex(p => p._id === product._id)
  if (idx === -1) return
  try {
    const res = await $fetch(`${config.public.apiBaseUrl}/votes/toggle`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`
      },
      body: {
        productId: product._id
      }
    })
    products.value[idx].userHasVoted = res.upvoted
    products.value[idx].upvotesCount = res.upvotesCount
    showAlert(res.upvoted ? "Upvoted!" : "Upvote removed!")
  } catch (e) {
    showAlert("Failed to toggle vote", "error")
  }
}

const toggleComments = async (productId) => {
  expandedComments.value[productId] = !expandedComments.value[productId]
  if (expandedComments.value[productId]) {
    await fetchComments(productId)
  }
}
const fetchComments = async (productId) => {
  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/products/${productId}/comments`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
    const productIndex = products.value.findIndex(p => p._id === productId)
    if (productIndex !== -1) {
      // 👇 The backend returns an object with .data containing the comments array:
      products.value[productIndex].comments = response.data
    }
  } catch (e) {
    console.error('Error fetching comments:', e)
    showAlert('Failed to load comments', 'error')
  }
}
const toggleReplyForm = (commentId) => {
  showReplyForm.value[commentId] = !showReplyForm.value[commentId]
  if (showReplyForm.value[commentId]) {
    replyTexts.value[commentId] = ''
  }
}
const handleProductImageUpload = (event) => {
  productImage.value = event.target.files[0]
}
const submitComment = async (productId) => {
  if (!commentTexts.value[productId]?.trim()) {
    showAlert('Please enter some content', 'error')
    return
  }
  commentLoading.value[productId] = true
  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/products/${productId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: {
        content: commentTexts.value[productId]
      }
    })
    const productIndex = products.value.findIndex(p => p._id === productId)
    if (productIndex !== -1) {
      if (!products.value[productIndex].comments) {
        products.value[productIndex].comments = []
      }
      products.value[productIndex].comments.push(response.data)
      commentTexts.value[productId] = ''
    }
    showAlert('Comment posted!')
  } catch (e) {
    console.error('Error posting comment:', e)
    showAlert('Failed to post comment', 'error')
  } finally {
    commentLoading.value[productId] = false
  }
}
const submitReply = async (commentId) => {
  if (!replyTexts.value[commentId]?.trim()) {
    showAlert('Please enter some content', 'error')
    return
  }
  replyLoading.value[commentId] = true
  try {
    const response = await $fetch(`${config.public.apiBaseUrl}/comments/${commentId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: {
        content: replyTexts.value[commentId]
      }
    })
    for (const product of products.value) {
      if (product.comments) {
        const commentIndex = product.comments.findIndex(c => c._id === commentId)
        if (commentIndex !== -1) {
          if (!product.comments[commentIndex].replies) {
            product.comments[commentIndex].replies = []
          }
          product.comments[commentIndex].replies.push(response.data)
          break
        }
      }
    }
    showReplyForm.value[commentId] = false
    replyTexts.value[commentId] = ''
    showAlert('Reply posted!')
  } catch (e) {
    console.error('Error posting reply:', e)
    showAlert('Failed to post reply', 'error')
  } finally {
    replyLoading.value[commentId] = false
  }
}
const deleteProduct = async (id) => {
  if (!confirm('Are you sure you want to delete this product?')) return
  try {
    await $fetch(`${config.public.apiBaseUrl}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    })
    products.value = products.value.filter(p => p._id !== id)
    showAlert('Product deleted successfully!')
  } catch (e) {
    console.error('Delete error:', e)
    showAlert('Failed to delete product', 'error')
  }
}
const openEditModal = (product) => {
  editForm.value = { ...product }
  editingId.value = product._id
  productImage.value = null
  showEditModal.value = true
}
const updateProduct = async () => {
  modalLoading.value = true
  try {
    const formData = new FormData()
    formData.append('name', editForm.value.name)
    formData.append('tagline', editForm.value.tagline)
    formData.append('description', editForm.value.description)
    formData.append('website', editForm.value.website)
    formData.append('category', editForm.value.category)
    if (productImage.value) {
      formData.append('logo', productImage.value)
    }
    await $fetch(`${config.public.apiBaseUrl}/products/${editingId.value}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: formData
    })
    await fetchProducts()
    showEditModal.value = false
    showAlert('Product updated successfully!')
  } catch (e) {
    console.error('Update error:', e)
    showAlert('Failed to update product', 'error')
  } finally {
    modalLoading.value = false
  }
}
const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  const imageBaseUrl = config.public.imageBaseUrl
  return `${imageBaseUrl}/uploads/${imagePath}`
}
const handleImageError = (id) => {
  brokenImages.value[id] = true
}
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.product-card {
  width: 100%;
  max-width: 340px;
  min-width: 260px;
  border: 1.5px solid #6f6f70;
  border-radius: 1.1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 14px 0 rgb(0 0 0 / 8%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  transition: box-shadow 0.3s, border-color 0.2s, transform 0.3s;
  align-self: flex-start;
  position: relative;
  overflow: hidden;
  animation: cardpop 0.7s cubic-bezier(.7,-0.01,.33,1.07);
}
@media (min-width: 640px) {
  .product-card { width: 46%; }
}
@media (min-width: 1024px) {
  .product-card { width: 23%; }
}
@media (max-width: 450px) {
  .product-card {
    min-width: 90vw;
    max-width: 95vw;
  }
}
.product-card:hover {
  box-shadow: 0 8px 32px 0 rgb(52 144 220 / 18%);
  border-color: #7c3aed;
  background: #f8fafc;
}

.vote-btn {
  background: #fff;
  border: none;
  min-width: 48px;
  min-height: 38px;
  outline: none;
  cursor: pointer;
  box-shadow: 0 1px 4px 0 rgba(139,92,246,0.07), 0 0.5px 1.5px 0 rgba(59,130,246,0.07);
}
.vote-btn:active {
  background: #fce7f3;
}
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.35s cubic-bezier(.7,-0.01,.33,1.07);
}
.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(15px);
}
@keyframes cardpop {
  0% { opacity: 0; transform: scale(0.8) translateY(30px);}
  80% { opacity: 1; transform: scale(1.06) translateY(-8px);}
  100% { opacity: 1; transform: scale(1) translateY(0);}
}
@keyframes commentslide {
  0% { opacity: 0; transform: translateY(24px);}
  100% { opacity: 1; transform: translateY(0);}
}
.animate-commentslide {
  animation: commentslide 0.5s cubic-bezier(.7,-0.01,.33,1.07);
}
</style>
