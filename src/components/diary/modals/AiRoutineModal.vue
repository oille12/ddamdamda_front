<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  experienceLevels: {
    type: Array,
    required: true
  },
  selectedExperience: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'previous-step', 'next-step', 'select-experience'])
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="ai-modal-container">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold">AI 맞춤 루틴 생성</h3>
        <button @click="emit('close')">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 진행바 -->
      <div v-if="currentStep <= 4" class="w-full bg-gray-200 h-2 rounded-full mb-8">
        <div 
          class="bg-black h-2 rounded-full transition-all duration-500"
          :style="{ width: `${(currentStep / 4) * 100}%` }"
        ></div>
      </div>

      <!-- AI 질문리스트 -->
      <div v-if="currentStep === 1">
        <h4 class="font-medium mb-4">Q1. 운동 경험</h4>
        <div class="grid grid-cols-3 gap-3">
          <button 
            v-for="level in experienceLevels"
            :key="level.value"
            :class="['px-4 py-2 rounded-lg text-sm',
                    selectedExperience === level.value ? 'bg-black text-[#dcff1f]' : 'bg-gray-100']"
            @click="emit('select-experience', level.value)"
          >
            {{ level.label }}
          </button>
        </div>
      </div>

      <!-- 네비게이션 버튼 -->
      <div class="flex justify-between mt-8">
        <button 
          v-if="currentStep > 1" 
          @click="emit('previous-step')"
          class="px-4 py-2 text-sm"
        >
          이전
        </button>
        <button 
          v-if="currentStep < 5"
          @click="emit('next-step')"
          class="px-4 py-2 bg-black text-[#dcff1f] rounded-full text-sm"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.ai-modal-container {
  @apply bg-white rounded-xl p-6 w-full max-w-lg mx-4;
}
</style>