<script setup>
const props = defineProps({
  parts: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="stat-card bg-black p-4 shadow-lg rounded-2xl">
    <h3 class="text-sm font-medium text-white mb-4">운동 부위</h3>
    <div class="space-y-3">
      <div v-for="part in parts" :key="part.name">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs text-white">{{ part.name }}</span>
          <span class="text-xs" style="color: #dcff1f">{{ part.percentage }}%</span>
        </div>
        <div class="h-1 bg-gray-800 rounded-full">
          <div 
            class="h-1 rounded-full transition-all duration-500"
            :style="{ 
              width: `${part.percentage}%`,
              backgroundColor: '#dcff1f'
            }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
}
</style>