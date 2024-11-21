<template>
    <div class="min-h-screen">
      <!-- 페이지 헤더 섹션 -->
      <div class="shadow-sm mb-3">
        <div class="max-w-7xl mx-auto px-8 pt-20">
          <div class="py-12">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-4xl font-bold text-gray-900">운동 다이어리</h1>
                <p>당신의 운동 기록을 체계적으로 관리하세요</p>
                
                <!-- 색상별 요약 -->
                <div class="flex gap-4 mt-4">
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span>오늘</span>
                    <div class="w-3 h-3 rounded-full" style="background-color: #dcff1f;"></div>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span>선택된 날짜</span>
                    <div class="w-3 h-3 rounded-full bg-black"></div>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span>운동 완료</span>
                    <div class="w-3 h-3 rounded-full bg-blue-200"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Main -->
      <div class="pt-6 pb-20" role="main">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- 달력 섹션 -->
            <div class="stat-card bg-white p-6 shadow-lg h-full rounded-2xl">
              <!-- 달력 헤더(년 월) -->
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-bold">{{ currentYear }}년 {{ currentMonth }}월</h2>
                <div class="flex space-x-2">
                  <button @click="previousMonth">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button @click="nextMonth">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
  
              <!-- 달력 내부 섹션 -->
              <div class="grid grid-cols-7 gap-1">
                <!-- 달력 요일 -->
                <div class="text-center text-sm font-medium text-red-500">일</div>
                <div class="text-center text-sm font-medium">월</div>
                <div class="text-center text-sm font-medium">화</div>
                <div class="text-center text-sm font-medium">수</div>
                <div class="text-center text-sm font-medium">목</div>
                <div class="text-center text-sm font-medium">금</div>
                <div class="text-center text-sm font-medium text-blue-500">토</div>
  
                <!-- 달력 일자 -->
                <template v-for="(day, index) in calendarDays" :key="index">
                  <div 
                    class="aspect-square p-2 text-center cursor-pointer relative rounded-full"
                    :class="getDayClasses(day)"
                    @click="selectDate(day)"
                  >
                    {{ day.date }}
                    <div v-if="hasWorkout(day)" class="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div class="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
                    </div>
                  </div>
                </template>
              </div>
            </div>

          <!-- 루틴 섹션 -->
          <div class="space-y-6">
            <div class="stat-card bg-white p-6 shadow-lg rounded-2xl">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold">
                        {{ selectedDate ? (selectedDate === todayDate ? '오늘의 루틴' : `${selectedDate}일의 루틴`) : '루틴 관리' }}
                    </h2>
                    <div class="flex items-center gap-4">
                        <!-- 루틴 등록 버튼 -->
                        <button 
                            @click="showRoutineModal = true" 
                            class="px-3 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
                        >
                            루틴 등록
                        </button>

                        <!-- AI 루틴 생성 버튼 -->
                        <button 
                            @click="showAiModal = true"
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
                        <div class="flex items-center space-x-2">
                        <!-- 영상 가이드 버튼 -->
                        <button 
                            @click="showVideoModal = true"
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
                            @click="editRoutine(routine)"
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
                            @click="deleteRoutine(routine.id)"
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

            <!-- 상태 차트 -->
            <div class="grid grid-cols-2 gap-4">

                <!-- 주간 운동 현황 -->
                <div class="stat-card bg-black p-4 shadow-lg col-span-2">
                    <div class="flex items-center justify-between mb-2">
                    <h3 class="text-sm font-medium text-white">주간 운동 현황</h3>
                    <div class="px-2 py-1 rounded-full text-xs font-medium text-black" style="background-color: #dcff1f;">
                        This Week
                    </div>
                    </div>
                    <div class="h-24">
                        <Bar
                            :data="chartData"
                            :options="chartOptions"
                        />
                    </div>
                </div>

                <!-- 부위별 운동 현황 -->
                <div class="stat-card bg-black p-4 shadow-lg">
                    <h3 class="text-sm font-medium text-white mb-4">운동 부위</h3>
                    <div class="space-y-3">
                    <div v-for="part in exerciseParts" :key="part.name">
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

                <!-- 이번달 기록 -->
                <div class="stat-card bg-black p-4 shadow-lg">
                    <h3 class="text-sm font-medium text-white mb-1">이번달 기록</h3>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <div>
                            <div class="text-2xl">
                            <span class="font-bold" style="color: #dcff1f">{{ monthlyStats.workoutDays }}</span>
                            <span class="text-white">일</span>
                            </div>
                            <div class="text-xs text-gray-500">운동일수</div>
                        </div>
                        <div>
                            <div class="text-2xl">
                            <span class="font-bold" style="color: #dcff1f">{{ monthlyStats.totalHours }}</span>
                            <span class="text-white">시간</span>
                            </div>
                            <div class="text-xs text-gray-500">총 운동시간</div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 루틴 모달 -->
    <div v-if="showRoutineModal" class="modal-overlay">
    <div class="modal-container">
        <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold">루틴 등록</h3>
        <button @click="closeRoutineModal">
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
            @click="selectedCategory = cat.id"
        >
            {{ cat.name }}
        </button>
        </div>

        <div class="space-y-3">
        <div v-for="exercise in filteredExercises" 
            :key="exercise.id" 
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span class="font-medium">{{ exercise.name }}</span>
            <button @click="addExercise(exercise)" 
                    class="px-3 py-1 text-sm bg-black text-[#dcff1f] rounded-full">
            추가
            </button>
        </div>
        </div>
    </div>
    </div>

    <!-- AI 모달 -->
    <div v-if="showAiModal" class="modal-overlay" @click.self="closeAiModal">
    <div class="ai-modal-container">
        <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold">AI 맞춤 루틴 생성</h3>
        <button @click="closeAiModal">
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
            @click="selectedExperience = level.value"
            >
            {{ level.label }}
            </button>
        </div>
        </div>

        <div class="flex justify-between mt-8">
        <button 
            v-if="currentStep > 1" 
            @click="currentStep--"
            class="px-4 py-2 text-sm"
        >
            이전
        </button>
        <button 
            v-if="currentStep < 5"
            @click="nextStep"
            class="px-4 py-2 bg-black text-[#dcff1f] rounded-full text-sm"
        >
            다음
        </button>
        </div>
    </div>
    </div>

    <!-- 영상 모달 -->
    <div v-if="showVideoModal" class="modal-overlay" @click="closeVideoModal">
        <div class="modal-container" @click.stop>
            <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">운동 가이드</h3>
            <button @click="closeVideoModal">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>
            <div class="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
            <!-- Video player -->
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar  } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale
)


// 임시 차트 데이터
const chartData = {
  labels: ['월', '화', '수', '목', '금', '토', '일'],
  datasets: [
    {
      data: [60, 45, 30, 90, 60, 0, 45],
      backgroundColor: '#dcff1f',
      borderRadius: 4
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#333'
      },
      ticks: {
        color: '#666'
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#666'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}

const exerciseParts = ref([
  { name: '가슴', percentage: 25 },
  { name: '등', percentage: 20 },
  { name: '하체', percentage: 30 },
  { name: '어깨', percentage: 15 },
  { name: '팔', percentage: 10 },
])

const monthlyStats = ref({
  workoutDays: 12,
  totalHours: 48
})
// 임시데이터 여기까지

const currentDate = new Date()
const currentYear = ref(currentDate.getFullYear())
const currentMonth = ref(currentDate.getMonth() + 1)
const selectedDate = ref(null)
const routines = ref([])
const showRoutineModal = ref(false)
const showAiModal = ref(false)
const showVideoModal = ref(false)
const currentStep = ref(1)
const selectedCategory = ref(null)
const selectedExperience = ref(null)

const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value, 0)
  
  const firstDayOfWeek = firstDay.getDay()
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ 
      date: new Date(firstDay).setDate(firstDay.getDate() - firstDayOfWeek + i),
      isCurrentMonth: false 
    })
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: i === currentDate.getDate() && 
               currentMonth.value === currentDate.getMonth() + 1 &&
               currentYear.value === currentDate.getFullYear(),
      isSelected: i === selectedDate.value
    })
  }
  
  return days
})

const previousMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const selectDate = (day) => {
  if (day.isCurrentMonth) {
    selectedDate.value = day.date
  }
}

const getDayClasses = (day) => {
  return {
    'text-gray-400': !day.isCurrentMonth,
    'bg-[#dcff1f]': day.isToday,
    'bg-black text-white': day.isSelected && !day.isToday
  }
}

const hasWorkout = (day) => {
  // Logic to check if the day has workout
  return false
}

const closeRoutineModal = () => {
  showRoutineModal.value = false
}

const closeAiModal = () => {
  showAiModal.value = false
  currentStep.value = 1
}

const closeVideoModal = () => {
  showVideoModal.value = false
}

const nextStep = () => {
  if (currentStep.value < 5) {
    currentStep.value++
  }
}

onMounted(() => {
  
})
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-container {
  @apply bg-white rounded-xl p-6 w-full max-w-md mx-4;
}

.ai-modal-container {
  @apply bg-white rounded-xl p-6 w-full max-w-lg mx-4;
}

.calendar-day {
  @apply p-2 text-center cursor-pointer hover:bg-gray-100 relative;
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
.stat-card {
    border-radius: 16px;
    transition: all 0.3s ease;
}
.stat-card:hover {
    transform: translateY(-2px);
}
</style>
