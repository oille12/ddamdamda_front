
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
              :selected-date="selectedDate"
              :routines="userRoutines"
              @previous-month="previousMonth"
              @next-month="nextMonth"
              @select-date="selectDate"
            />
  
            <div class="space-y-6">
              <!-- 루틴 컴포넌트 -->
              <DiaryRoutines
                :selected-date="selectedDate"
                :current-date="currentDate"
                :routines="userRoutines"
                @show-routine-modal="showRoutineModal = true"
                @show-ai-modal="showAiModal = true"
                @update-routine="updateRoutine"
                @delete-routine="deleteRoutine"
                @show-video="showVideoModal = true"
                @show-set-count-modal="handleShowSetCountModal"
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
  
      <RoutineModal 
        v-if="showRoutineModal"
        :categories="categories"
        :exercises="exercises"
        :selected-date="new Date(currentYear, currentMonth - 1, selectedDate)"
        @close="showRoutineModal = false"
        @add-routines="handleAddRoutines"
      />

      <SetCountModal
        v-if="showSetCountModal"
        :exercise-name="editingRoutine?.name"
        :initial-sets="editingRoutine?.sets"
        :initial-reps="editingRoutine?.reps"
        :is-edit="true"
        @close="showSetCountModal = false"
        @confirm="handleSetCountConfirm"
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

import { useUserStore } from '@/stores/user'
import DiaryCalendar from '@/components/diary/DiaryCalendar.vue'
import DiaryRoutines from '@/components/diary/DiaryRoutines.vue'
import WeeklyProgress from '@/components/diary/charts/WeeklyProgress.vue'
import ExerciseParts from '@/components/diary/charts/ExerciseParts.vue'
import MonthlyStats from '@/components/diary/charts/MonthlyStats.vue'
import RoutineModal from '@/components/diary/modals/RoutineModal.vue'
import AiRoutineModal from '@/components/diary/modals/AiRoutineModal.vue'
import VideoModal from '@/components/diary/modals/VideoModal.vue'
import SetCountModal from '@/components/diary/modals/SetCountModal.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const routines = ref([])

const userRoutines = computed(() => {
  return routines.value.filter(routine => routine.userId === currentUser.value.id)
})

const categories = ref([
  { id: 1, name: '가슴' },
  { id: 2, name: '등' },
  // ...
])

const exercises = ref([
  { id: 1, name: '벤치프레스', categoryId: 1 },
  { id: 2, name: '푸시업', categoryId: 1 },
  // ...
])

const handleAddRoutines = async (newRoutines) => {
  try {
    const addedRoutines = await routineApi.addRoutines(newRoutines)
    routines.value.push(...addedRoutines)
    showRoutineModal.value = false
  } catch (error) {
    console.error('루틴 추가 실패:', error)
  }
}

const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)
const selectedDate = ref(currentDate.value.getDate())
// const routines = ref(JSON.parse(localStorage.getItem('routines')) || [])

const showRoutineModal = ref(false)
const showAiModal = ref(false)
const showVideoModal = ref(false)
const currentStep = ref(1)
const selectedCategory = ref(null)
const selectedExperience = ref(null)
const showSetCountModal = ref(false)
const editingRoutine = ref(null)

const handleShowSetCountModal = (routine) => {
  editingRoutine.value = routine
  showSetCountModal.value = true
}

const saveRoutines = () => {
  const key = `routines_${currentUser.value.id}`
  localStorage.setItem(key, JSON.stringify(routines.value))
}

const addRoutine = (routine) => {
  routines.value.push(routine)
  saveRoutines()
  showRoutineModal.value = false
}

const updateRoutine = (updatedRoutine) => {
  const index = routines.value.findIndex(r => r.id === updatedRoutine.id && 
    r.userId === currentUser.value.id) 
  if (index !== -1) {
    routines.value[index] = {
      ...updatedRoutine,
      userId: currentUser.value.id
    }
    saveRoutines() // localStorage에 저장
  }
}

const deleteRoutine = (id) => {
  routines.value = routines.value.filter(routine => 
    !(routine.id === routineId && routine.userId === currentUser.value.id)
  )
  saveRoutines()
}

const handleSetCountConfirm = (setCount) => {
  if (editingRoutine.value) {
    updateRoutine({
      ...editingRoutine.value,
      sets: setCount.sets,
      reps: setCount.reps
    })
  }
  showSetCountModal.value = false
  editingRoutine.value = null
}

// 선택된 날짜의 루틴 필터링
const selectedDateRoutines = computed(() => {
  if (!selectedDate.value) return []
  
  const selectedDateObj = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth(),
    selectedDate.value
  )
  
  return routines.value.filter(routine => {
    const routineDate = new Date(routine.date)
    return routineDate.toDateString() === selectedDateObj.toDateString()
  })
})

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
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  // 날짜가 변경되면 선택된 날짜 초기화
  selectedDate.value = null
}

const nextMonth = () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  // 날짜가 변경되면 선택된 날짜 초기화
  selectedDate.value = null
}

const selectDate = (date) => {
  selectedDate.value = date
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

const loadRoutines = async () => {
  try {
    if (userStore.isAuthenticated) {
      const data = await routineApi.getRoutines()
      routines.value = data
    }
  } catch (error) {
    console.error('루틴 로드 실패:', error)
  }
}

onMounted(() => {
  loadRoutines()
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