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
              :routines="routines"
              @previous-month="previousMonth"
              @next-month="nextMonth"
              @select-date="selectDate"
            />
  
            <div class="space-y-6">
              <!-- 루틴 컴포넌트 -->
              <DiaryRoutines
                :selected-date="selectedDate"
                :current-date="currentDate"
                :routines="selectedDateRoutines"
                @update-routine-status="handleRoutineStatusUpdate"
                @show-routine-modal="showRoutineModal = true"
                @show-ai-modal="showAiModal = true"
                @update-routine="updateRoutine"
                @delete-routine="deleteRoutine"
                @show-video="handleShowVideo"
                @show-set-count-modal="handleShowSetCountModal"
              />
  
              <!-- 차트 그리드 -->
              <StatsChart
                :selected-date="new Date(currentYear, currentMonth - 1, selectedDate)"
                :user-id="currentUser.id"
              />
            </div>
          </div>
        </div>
      </div>
  
      <RoutineModal 
        v-if="showRoutineModal"
        :categories="categories"
        :exercises="exercisesList"
        :selected-date="new Date(currentYear, currentMonth - 1, selectedDate)"
        @close="showRoutineModal = false"
        @add-routines="handleAddRoutines"
      />

      <SetCountModal
        v-if="showSetCountModal"
        :exercise-title="editingRoutine?.title"
        :initial-sets="editingRoutine?.sets"
        :initial-reps="editingRoutine?.reps"
        :is-edit="true"
        @close="showSetCountModal = false"
        @confirm="handleSetCountConfirm"
      />

      <AiRoutineModal
        v-if="showAiModal"
        @close="handleCloseAiModal"
        :current-step="1"
        :selected-date="new Date(currentYear, currentMonth-1, selectedDate)"
        @routines-saved="handleRoutinesSaved"
      />
      
      <VideoModal
        v-if="showVideoModal"
        :exercise-title="selectedExerciseTitle"
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
import StatsChart from '@/components/diary/StatsChart.vue'
import RoutineModal from '@/components/diary/modals/RoutineModal.vue'
import AiRoutineModal from '@/components/diary/modals/AiRoutineModal.vue'
import VideoModal from '@/components/diary/modals/VideoModal.vue'
import SetCountModal from '@/components/diary/modals/SetCountModal.vue'
import { routine } from '@/stores/routine'
import { exercises } from '@/stores/exercise'
import { useAiRoutineStore } from '@/stores/aiRoutine'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const routines = ref([])
const exercisesList = ref([])
const selectedExerciseTitle = ref('')
const { user: currentUser } = storeToRefs(userStore)

const userRoutines = computed(() => {
  if (!Array.isArray(routines.value)) return []
  return routines.value.filter(routine => routine.userId === currentUser.value?.id)
})

const categories = [
  { id: 1, title: '가슴' },
  { id: 2, title: '등' },
  { id: 3, title: '어깨' },
  { id: 4, title: '팔' },
  { id: 5, title: '코어' },
  { id: 6, title: '하체' },
  { id: 7, title: '전신' }
]

// 운동 데이터 가져오기
const fetchExercises = async () => {
  try {
    const data = await exercises.getAllExercises()
      // API 응답 데이터를 컴포넌트에 맞는 형식으로 변환
      exercisesList.value = data.map(exercise => ({
        id: exercise.exercisesId,
        title: exercise.name,
        categoryId: categories.find(cat => cat.title === exercise.part)?.id
      }))
  } catch (error) {
    console.error('운동 데이터 불러오기 실패:', error)
  }
}

const handleAddRoutines = async (newRoutines) => {
  try {
    const addedRoutines = await routine.addRoutines(newRoutines)
    if (addedRoutines && Array.isArray(addedRoutines)) {
      routines.value.push(...addedRoutines)
    } else if (addedRoutines) {
      routines.value.push(addedRoutines)
    }
    await loadRoutines()
    showRoutineModal.value = false
  } catch (error) {
    console.error('루틴 추가 실패:', error)
  }
}

const handleRoutineStatusUpdate  = async ({ routineId }) => {
  try {
    await routine.updateRoutineStatus(routineId)
    await loadRoutines()
  } catch (error) {
    console.error('루틴 상태 업데이트 실패:', error)
    alert('루틴 상태 업데이트에 실패했습니다.')
  }
}

const handleShowVideo = (title) => {
  selectedExerciseTitle.value = title
  showVideoModal.value = true
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

const aiRoutineStore = useAiRoutineStore()

const handleShowAiModal = () => {
  showAiModal.value = true
}

const handleCloseAiModal = () => {
  showAiModal.value = false
  aiRoutineStore.reset()
}

// 특정 날짜의 루틴만 로드하는 함수
const loadRoutinesByDate = async (date) => {
  try {
    if (userStore.isAuthenticated && date) {
      const userId = userStore.user.id
      const formattedDate = format(date, 'yyyy-MM-dd')

      const data = await routine.getRoutinesByDate(userId, formattedDate)

      if (Array.isArray(data)) {
        // 현재 날짜의 루틴만 필터링 (서버에서 like 검색으로 인해 다른 날짜도 포함될 수 있음)
        const exactDateRoutines = data.filter(r => r.exerciseDate === formattedDate)
        
        const currentRoutines = routines.value || []
        const filteredRoutines = currentRoutines.filter(r => r.exerciseDate !== formattedDate)
        routines.value = [...filteredRoutines, ...exactDateRoutines]
      }
    }
  } catch (error) {
    console.error('선택 날짜 루틴 로드 실패:', error)
  }
}

// 월 변경 시 해당 월의 모든 루틴 로드
const loadMonthRoutines = async () => {
  try {
    if (userStore.isAuthenticated) {
      const userId = userStore.user.id
      const data = await routine.getRoutinesByMonth(
        userId, 
        currentYear.value, 
        currentMonth.value
      )
      
      if (Array.isArray(data)) {
        const yearMonth = format(new Date(currentYear.value, currentMonth.value - 1), 'yyyy-MM')
        const monthRoutines = data.filter(r => r.exerciseDate.startsWith(yearMonth))
        
        const otherMonthRoutines = routines.value?.filter(r => !r.exerciseDate.startsWith(yearMonth)) || []
        routines.value = [...otherMonthRoutines, ...monthRoutines]
      }
    }
  } catch (error) {
    console.error('월별 루틴 로드 실패:', error)
  }
}

const handleRoutinesSaved = async ({ routines: newRoutines, date }) => {
  try {
    if (Array.isArray(newRoutines)) {
      handleCloseAiModal()
      await loadRoutinesByDate(new Date(date))
    }
    
    handleCloseAiModal()
    alert('AI 추천 루틴이 저장되었습니다!')
  } catch (error) {
    console.error('루틴 저장 후 처리 실패:', error)
    alert('루틴 저장에 실패했습니다. 다시 시도해주세요.')
  }
}

const handleShowSetCountModal = (routine) => {
  editingRoutine.value = routine
  showSetCountModal.value = true
}

const saveRoutines = () => {
  const key = `routines_${currentUser.value.id}`
  localStorage.setItem(key, JSON.stringify(routines.value))
}

const updateRoutine = async (updatedRoutine) => {
  try {
    const updated = await routine.updateRoutine(updatedRoutine)
    if (updated) {
      const index = routines.value.findIndex(r => r.id === updatedRoutine.id)
      if (index !== -1) {
        routines.value[index] = { ...routines.value[index], ...updatedRoutine }
      }
      await loadRoutines()
    }
  } catch (error) {
    console.error('루틴 수정 실패:', error)
  }
}

const deleteRoutine = async (routineId) => {

  try {
    await routine.deleteRoutine(routineId)
    routines.value = routines.value.filter(r => r.id !== routineId)
    saveRoutines()
  } catch (error) {
    console.error('루틴 삭제 실패:', error)
  }
}

const handleSetCountConfirm = async (setCount) => {
  if (editingRoutine.value) {
    const routineToUpdate = {
      ...editingRoutine.value,
      sets: setCount.sets,
      reps: setCount.reps
    }
    await updateRoutine(routineToUpdate)
  }
  showSetCountModal.value = false
  editingRoutine.value = null
}

// 선택된 날짜의 루틴 필터링
const selectedDateRoutines = computed(() => {
  if (!selectedDate.value || !Array.isArray(routines.value)) return []

  const year = currentYear.value
  const month = String(currentMonth.value).padStart(2, '0')
  const day = String(selectedDate.value).padStart(2, '0')
  const selectedDateStr = `${year}-${month}-${day}`
  const filtered = routines.value.filter(routine => routine.exerciseDate === selectedDateStr &&
      routine.userId === currentUser.value?.id
  )
  return filtered
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

const previousMonth = async () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
  selectedDate.value = null
  await loadMonthRoutines()
}

const nextMonth = async () => {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
  selectedDate.value = null
  await loadMonthRoutines()
}

const selectDate = async (date) => {
  selectedDate.value = date
  await loadRoutinesByDate(new Date(currentYear.value, currentMonth.value - 1, date))
}

const loadStatistics = async () => {
  try {
    const currentDate = new Date(currentYear.value, currentMonth.value - 1, selectedDate.value)
    const formattedDate = format(currentDate, 'yyyy-MM-dd')

    // 루틴 개수와 완료된 루틴 개수 동시에 조회
    const [totalCount, completedCount] = await Promise.all([
      routine.getRoutineCount(userStore.user.id, formattedDate),
      routine.getCompletedRoutineCount(userStore.user.id, formattedDate)
    ])

  } catch (error) {
    console.error('통계 데이터 로드 실패:', error)
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
  selectedExerciseTitle.value = ''
}

const nextStep = () => {
  if (currentStep.value < 5) {
    currentStep.value++
  }
}

const loadRoutines = async () => {
  try {
    if (userStore.isAuthenticated) {
      const data = await routine.getRoutines()
      routines.value = Array.isArray(data) ? data : []
      console.log('불러온 루틴:', routines.value)
    }
  } catch (error) {
    console.error('루틴 로드 실패:', error)
    routines.value = []
  }
}

onMounted(async () => {
  window.scrollTo(0, 0)
  await fetchExercises()
  await loadMonthRoutines()
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