<template>
  <div class="bg-white rounded-xl shadow-lg p-5 transition-all duration-200 hover:shadow-2xl animate-fadein">
    <div class="flex items-center gap-2 mb-2">
      <span class="text-2xl animate-popBounce">{{ icon }}</span>
      <span class="font-semibold text-lg text-gray-700 tracking-tight">{{ title }}</span>
    </div>
    <div v-if="items && items.length">
      <div class="overflow-x-auto rounded-md">
        <table class="w-full text-sm min-w-[360px]">
          <thead>
            <tr class="bg-gradient-to-r from-blue-100 to-green-100">
              <th
                v-for="field in fields"
                :key="field"
                class="text-left text-gray-500 px-2 py-1 font-semibold uppercase tracking-wide"
              >
                {{ prettify(field) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item._id"
              class="hover:bg-blue-50 transition duration-150"
            >
              <td
                v-for="field in fields"
                :key="field+'-'+item._id"
                class="py-2 px-2 whitespace-nowrap"
              >
                <span v-if="field === 'createdAt'">{{ formatDate(item[field]) }}</span>
                <span v-else>{{ item[field] }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="text-gray-400 italic py-6 text-center animate-fadein">{{ empty }}</div>
  </div>
</template>

<script setup>
const props = defineProps(['title', 'icon', 'items', 'fields', 'empty'])
const formatDate = d =>
  d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''
const prettify = s => s.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())
</script>

<style scoped>
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(18px);}
  100% { opacity: 1; transform: translateY(0);}
}
@keyframes popBounce {
  0% { opacity: 0; transform: scale(0.7);}
  80% { opacity: 1; transform: scale(1.13);}
  100% { opacity: 1; transform: scale(1);}
}
.animate-fadein {
  animation: fadeIn 0.5s cubic-bezier(.4,0,.2,1);
}
.animate-popBounce {
  animation: popBounce 0.6s cubic-bezier(.7,-0.01,.33,1.07);
}
</style>