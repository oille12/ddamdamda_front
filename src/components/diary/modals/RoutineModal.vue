<script setup>
import { ref, computed } from 'vue'
import SetCountModal from './SetCountModal.vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  exercises: {
    type: Array,
    default: () => []
  },
  selectedDate: {
    type: Date,
    required: true
  }
})

const emit = defineEmits(['close', 'add-routines'])

const selectedCategory = ref(props.categories[0]?.id || 1)
const selectedExercises = ref(new Map())
const showSetCountModal = ref(false)
const currentExercise = ref(null)

// 선택된 카테고리의 운동 목록 (이미 선택된 운동은 제외)
const availableExercises = computed(() => {
  if (!selectedCategory.value || !props.exercises) return []
  return props.exercises.filter(ex => 
    ex?.categoryId === selectedCategory.value && 
    !selectedExercises.value.has(ex?.id)
  )
})

// 운동 추가 클릭 핸들러
const handleAddExercise = (exercise) => {
  currentExercise.value = exercise
  showSetCountModal.value = true
}

// 운동 제거 핸들러
const handleRemoveExercise = (exerciseId) => {
  selectedExercises.value.delete(exerciseId)
}

// 세트/횟수 설정 완료 핸들러
const handleSetCountConfirm = (setCount) => {
  selectedExercises.value.set(currentExercise.value.id, {
    ...currentExercise.value,
    sets: setCount.sets,
    reps: setCount.reps
  })
  showSetCountModal.value = false
  currentExercise.value = null
}

// 루틴 등록 핸들러
const handleSubmit = () => {
  const year = props.selectedDate.getFullYear()
  const month = String(props.selectedDate.getMonth() + 1).padStart(2, '0')
  const day = String(props.selectedDate.getDate()).padStart(2, '0')
  const dateStr = `${year}-${month}-${day}`

  const routines = Array.from(selectedExercises.value.values()).map(exercise => ({
    id: exercise.id,
    title: exercise.title,
    sets: exercise.sets,
    reps: exercise.reps,
    exerciseDate: dateStr,
    completed: false
  }))
  
  emit('add-routines', routines)
  emit('close')
}

</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-container">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold">루틴 등록</h3>
        <button @click="emit('close')" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

       <!-- 카테고리 선택 -->
       <div class="flex space-x-2 mb-6 overflow-x-auto pb-2">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors', 
                  selectedCategory === category.id ? 'bg-black text-[#dcff1f]' : 'bg-gray-100']"
          @click="selectedCategory = category.id"
        >
          {{ category.title }}
        </button>
      </div>

      <!-- 선택된 운동 목록 -->
      <div v-if="selectedExercises.size > 0" class="mb-4">
        <h4 class="font-medium mb-2">선택된 운동</h4>
        <div class="space-y-2">
          <div 
            v-for="exercise of selectedExercises.values()" 
            :key="exercise.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <div class="font-medium">{{ exercise.title }}</div>
              <div class="text-sm text-gray-500">{{ exercise.sets }}세트 × {{ exercise.reps }}회</div>
            </div>
            <button 
              @click="handleRemoveExercise(exercise.id)"
              class="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="운동 제거"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 운동 목록 -->
      <div v-if="selectedCategory" class="mb-6">
        <h4 class="font-medium mb-2">운동 목록</h4>
        <div class="space-y-2 max-h-[40vh] overflow-y-auto">
          <div 
            v-for="exercise in availableExercises" 
            :key="exercise.id" 
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span class="font-medium">{{ exercise.title }}</span>
            <button 
              @click="handleAddExercise(exercise)"
              class="p-1.5 rounded-full transition-colors text-lime-500 hover:bg-lime-50"
            >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
              stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M12 4v16m8-8H4"
              />
            </svg>
            </button>
          </div>
          
          <div v-if="availableExercises.length === 0" class="text-center py-8 text-gray-500">
            추가 가능한 운동이 없습니다
          </div>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex justify-end space-x-3">
        <button 
          @click="emit('close')"
          class="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          취소
        </button>
        <button 
          @click="handleSubmit"
          :disabled="selectedExercises.size === 0"
          :class="['px-4 py-2 text-sm rounded-lg transition-colors',
                  selectedExercises.size > 0 ? 
                    'bg-black text-[#dcff1f] hover:bg-gray-800' : 
                    'bg-gray-200 text-gray-400 cursor-not-allowed']"
        >
          등록
        </button>
      </div>
    </div>
  </div>

  <!-- 세트/횟수 설정 모달 -->
  <SetCountModal
    v-if="showSetCountModal"
    :exercise-title="currentExercise?.title"
    @close="showSetCountModal = false"
    @confirm="handleSetCountConfirm"
  />
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-container {
  @apply bg-white rounded-xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto;
}
</style>