<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  filteredExercises: {
    type: Array,
    default: () => []
  },
  selectedCategory: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close', 'select-category', 'add-exercise'])
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold">루틴 등록</h3>
        <button @click="emit('close')">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex space-x-2 mb-6">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          :class="['px-3 py-1 rounded-full text-sm', 
                  selectedCategory === cat.id ? 'bg-black text-[#dcff1f]' : 'bg-gray-100']"
          @click="emit('select-category', cat.id)"
        >
          {{ cat.name }}
        </button>
      </div>

      <div class="space-y-3">
        <div v-for="exercise in filteredExercises" 
          :key="exercise.id" 
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span class="font-medium">{{ exercise.name }}</span>
          <button 
            @click="emit('add-exercise', exercise)" 
            class="px-3 py-1 text-sm bg-black text-[#dcff1f] rounded-full"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-container {
  @apply bg-white rounded-xl p-6 w-full max-w-md mx-4;
}
</style>