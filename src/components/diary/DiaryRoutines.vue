<script setup>
const props = defineProps({
  selectedDate: {
    type: Number,
    default: null
  },
  todayDate: {
    type: Number,
    default: () => new Date().getDate()
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
  'delete-routine', 
  'show-video'
])
</script>

<template>
  <div class="stat-card bg-white p-6 shadow-lg rounded-2xl">
    <div class="flex items-center justify-between mb-6">
      <!-- 헤더 타이틀 -->
      <h2 class="text-xl font-bold">
        {{ selectedDate ? (selectedDate === todayDate ? '오늘의 루틴' : `${selectedDate}일의 루틴`) : '루틴 관리' }}
      </h2>

      <!-- 버튼 그룹 -->
      <div class="flex items-center gap-4">
        <!-- 루틴 등록 버튼 -->
        <button 
          @click="emit('show-routine-modal')" 
          class="px-3 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
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
          AI 루틴 생성
        </button>
      </div>
    </div>

    <!-- 루틴 목록 -->
    <div v-for="routine in routines" :key="routine.id" class="p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div>
            <div class="font-medium">{{ routine.name }}</div>
            <div class="text-sm text-gray-500">{{ routine.sets }}세트 × {{ routine.reps }}회</div>
          </div>
        </div>

        <!-- 액션 버튼 그룹 -->
        <div class="flex items-center space-x-2">
          <!-- 영상 가이드 버튼 -->
          <button 
            @click="emit('show-video', routine)"
            class="p-1.5 hover:text-gray-700 transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
              />
            </svg>
          </button>

          <!-- 수정 버튼 -->
          <button 
            @click="emit('edit-routine', routine)"
            class="p-1.5 hover:text-gray-700 transition-colors duration-200"
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

          <!-- 삭제 버튼 -->
          <button 
            @click="emit('delete-routine', routine.id)"
            class="p-1.5 hover:text-red-500 transition-colors duration-200"
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
</template>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
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
.ai-button::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -60%;
  width: 20px;
  height: 200%;
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(35deg);
  transition: all 0.5s;
}
.ai-button:hover::after {
  left: 120%;
}
</style>