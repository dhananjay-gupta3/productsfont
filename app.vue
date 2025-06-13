<template>
  <div>
    <Navbar />
    <main class="min-h-screen p-4 bg-gray-100">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
// Import the navbar component globally
import Navbar from '~/components/Navbar.vue'
</script>
