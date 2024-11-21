
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
  
      <!-- Main Content -->
      <div class="pt-6 pb-20" role="main">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid md:grid-cols-2 gap-6">
            <!-- 달력 컴포넌트 -->
            <DiaryCalendar 
              :current-year="currentYear"
              :current-month="currentMonth"
              :calendar-days="calendarDays"
              @previous-month="previousMonth"
              @next-month="nextMonth"
              @select-date="selectDate"
            />
  
            <div class="space-y-6">
              <!-- 루틴 컴포넌트 -->
              <DiaryRoutines 
                :routines="routines"
                :selected-date="selectedDate"
                :today-date="currentDate.getDate()"
                @show-routine-modal="showRoutineModal = true"
                @show-ai-modal="showAiModal = true"
                @show-video="showVideoModal = true"
              />
  
              <!-- 차트 그리드 -->
              <div class="grid grid-cols-2 gap-4">
                <WeeklyProgress 
                  :chart-data="chartData"
                  :chart-options="chartOptions"
                  class="col-span-2"
                />
                <ExerciseParts :parts="exerciseParts" />
                <MonthlyStats :stats="monthlyStats" />
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modals -->
      <RoutineModal
        v-if="showRoutineModal"
        @close="closeRoutineModal"
        :categories="categories"
        :filtered-exercises="filteredExercises"
        :selected-category="selectedCategory"
      />
      
      <AiRoutineModal
        v-if="showAiModal"
        @close="closeAiModal"
        :current-step="currentStep"
        :experience-levels="experienceLevels"
        :selected-experience="selectedExperience"
        @previous-step="currentStep--"
        @next-step="nextStep"
      />
      
      <VideoModal
        v-if="showVideoModal"
        @close="closeVideoModal"
      />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import DiaryCalendar from '@/components/diary/DiaryCalendar.vue'
import DiaryRoutines from '@/components/diary/DiaryRoutines.vue'
import WeeklyProgress from '@/components/diary/charts/WeeklyProgress.vue'
import ExerciseParts from '@/components/diary/charts/ExerciseParts.vue'
import MonthlyStats from '@/components/diary/charts/MonthlyStats.vue'
import RoutineModal from '@/components/diary/modals/RoutineModal.vue'
import AiRoutineModal from '@/components/diary/modals/AiRoutineModal.vue'
import VideoModal from '@/components/diary/modals/VideoModal.vue'

const route = useRoute()
const router = useRouter()

// 기본 상태
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

// 차트 관련 데이터
const chartData = ref({
  labels: ['월', '화', '수', '목', '금', '토', '일'],
  datasets: [{
    data: [60, 45, 30, 90, 60, 0, 45],
    backgroundColor: '#dcff1f',
    borderRadius: 4
  }]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#333' },
      ticks: { color: '#666' }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#666' }
    }
  },
  plugins: {
    legend: { display: false }
  }
})

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

// Computed
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

// Methods
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
.stat-card {
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
}
</style>