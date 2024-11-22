<template>
    <div class="modal-overlay" @click.self="emit('close')">
      <div class="modal-container">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold">{{ isEdit ? '세트 & 횟수 수정' : '세트 & 횟수 설정' }}</h3>
          <button @click="emit('close')" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <div class="mb-4">
          <p class="text-gray-600 mb-4">{{ exerciseName }}</p>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">세트 수</label>
              <input
                type="number"
                v-model="sets"
                min="1"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">반복 횟수</label>
              <input
                type="number"
                v-model="reps"
                min="1"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
            </div>
          </div>
        </div>
  
        <div class="flex justify-end space-x-3">
          <button 
            @click="emit('close')"
            class="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button 
            @click="handleConfirm"
            class="px-4 py-2 text-sm bg-black text-[#dcff1f] rounded-lg hover:bg-gray-800 transition-colors"
          >
            {{ isEdit ? '저장' : '등록' }}
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  exerciseName: {
    type: String,
    required: true
  },
  initialSets: {   // 초기 세트 수
    type: Number,
    default: 1
  },
  initialReps: {   // 초기 반복 횟수
    type: Number,
    default: 10
  },
  isEdit: {        // 수정 모드 여부
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

const sets = ref(props.initialSets)
const reps = ref(props.initialReps)

const handleConfirm = () => {
  emit('confirm', {
    sets: sets.value,
    reps: reps.value
  })
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60];
}

.modal-container {
  @apply bg-white rounded-xl p-6 w-full max-w-md mx-4;
}
</style>