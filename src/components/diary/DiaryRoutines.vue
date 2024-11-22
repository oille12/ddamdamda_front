<script setup>
import { computed, ref } from 'vue'
import { routine } from '@/stores/routine';

const props = defineProps({
  selectedDate: {
    type: [Number, Object],
    default: null
  },
  currentDate: {
    type: Date,
    default: () => new Date()
  },
  routines: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'show-routine-modal', 
  'show-ai-modal', 
  'edit-routine', 
  'show-set-count-modal',
  'delete-routine', 
  'show-video',
  'update-routine-status'
])

// 날짜 관련 computed 속성들
const formattedDate = computed(() => {
  if (!props.selectedDate) return '루틴 관리'
  
  const selected = new Date(props.currentDate.getFullYear(), 
                          props.currentDate.getMonth(), 
                          props.selectedDate)
  const today = new Date()
  
  if (selected.toDateString() === today.toDateString()) {
    return '오늘의 루틴'
  }
  
  return `${props.selectedDate}일의 루틴`
})

// 선택된 날짜의 루틴만 필터링
const filteredRoutines = computed(() => {
  if (!props.selectedDate) return []

  const year = props.currentDate.getFullYear()
  const month = String(props.currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(props.selectedDate).padStart(2, '0')
  const selectedDateStr = `${year}-${month}-${day}`
  
  return props.routines.filter(routine => 
    routine.exerciseDate === selectedDateStr
  )
})

const showSetCountModal = ref(false)
const editingRoutine = ref(null)

const handleEditClick = (routine) => {
  editingRoutine.value = routine
  showSetCountModal.value = true
}

// 세트, 횟수 수정 확인
const handleSetCountConfirm = (setCount) => {
  if(editingRoutine.value) {
    emit('update-routine', {
      ...editingRoutine.value,
      sets: setCount.sets,
      reps: setCount.reps
    })
  }
  showSetCountModal.value = false
  editingRoutine.value = null
}

const completeRoutine = async(routine) => {
  if(routine.is_completed === 1) {
    return
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const routineDate = new Date(routine.exerciseDate)
  routineDate.setHours(0, 0, 0, 0)

  if(routineDate > today) {
    alert('미래 날짜의 루틴은 완료 처리할 수 없습니다.')
    return
  }

  const confirmed = confirm('완료 처리하시겠습니까?')
  if(!confirmed) {
    return
  }

  try {
    emit('update-routine-status', {
      routineId : routine.id,
      completed: true
    })

    // routine.disabled = true // 
    // routine.completed = true //
  } catch(error) {
    console.error('루틴 완료처리 중 오류 발생:', error)
    // routine.completed = false // 
    alert('완료 처리 중 오류 발생했습니다.')
  }
}
</script>

<template>
  <div class="stat-card bg-white p-6 shadow-lg rounded-2xl">
    <div class="flex items-center justify-between mb-6">
      <!-- 헤더 타이틀 -->
      <div>
        <h2 class="text-xl font-bold">{{ formattedDate }}</h2>
      </div>

      <!-- 버튼 그룹 -->
      <div class="flex items-center gap-3">
        <!-- 루틴 등록 버튼 -->
        <button 
          @click="emit('show-routine-modal')" 
          class="px-3 py-2 bg-black text-[#dcff1f] rounded-full text-sm hover:bg-gray-800 transition-colors"
        >
          루틴 등록
        </button>

        <!-- AI 루틴 생성 버튼 -->
        <button 
          @click="emit('show-ai-modal')"
          class="px-4 py-2 rounded-full text-sm ai-button flex items-center space-x-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
          <span>AI 루틴 생성</span>
        </button>
      </div>
    </div>

    <!-- 루틴 목록 -->
    <div class="space-y-4">
      <div v-if="filteredRoutines.length === 0" class="text-center py-8 text-gray-500">
        등록된 루틴이 없습니다
      </div>
      
      <div 
        v-for="routine in filteredRoutines" 
        :key="routine.id" 
        class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3"
            :class="{ 'completed-routine': routine.is_completed === 1 }"
          >
            <input 
              type="checkbox" 
              class="w-5 h-5 rounded text-black focus:ring-black"
              :checked="routine.is_completed === 1"
              :disabled="routine.is_completed === 1"
              @change="completeRoutine(routine)"
            >
            <div>
              <div class="font-medium">{{ routine.title }}</div>
              <div class="text-sm text-gray-500">{{ routine.sets }}세트 × {{ routine.reps }}회</div>
            </div>
          </div>

          <!-- 액션 버튼 그룹 -->
          <div class="flex items-center space-x-2">
            <button 
              @click="emit('show-video', routine.id)"
              class="p-1.5 hover:text-gray-700 transition-colors duration-200"
              title="영상 가이드"
            >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 2H18C20.2091 2 22 3.79086 22 6V18C22 20.2091 20.2091 22 18 22H6C3.79086 22 2 20.2091 2 18V6C2 3.79086 3.79086 2 6 2Z" stroke="black" stroke-width="2" fill="none"/>
              <path d="M2 7.5H22" stroke="black" stroke-width="2"/>
              <path d="M10 11L14 13.5L10 16V11Z" fill="black"/>
            </svg>
            </button>

            <button 
              @click="$emit('show-set-count-modal', routine)"
              class="p-1.5 hover:text-gray-700 transition-colors duration-200"
              title="수정"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                />
              </svg>
            </button>

            <button 
              @click="emit('delete-routine', routine.id)"
              class="p-1.5 hover:text-red-500 transition-colors duration-200"
              title="삭제"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
            </button>
          </div>
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
.ai-button {
  background-color: #dcff1f;
  color: black;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  animation: pulse 2s infinite;
  transition: all 0.3s ease;
}
.ai-button:hover {
  transform: translateY(-2px);
  background-color: #c3e619;
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 255, 31, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(220, 255, 31, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(220, 255, 31, 0);
  }
}
.completed-routine {
  opacity: 0.5;
  pointer-events: none;
}

.completed-routine input[type="checkbox"] {
  cursor: not-allowed;
  background-color: #e5e5e5;
}
</style>