<script setup>
const emit = defineEmits(['close'])
</script>

<template>
  <div class="modal-overlay" @click="emit('close')">
    <div class="modal-container" @click.stop>
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold">운동 가이드</h3>
        <button @click="emit('close')">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
        <!-- Video player component will be added here -->
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