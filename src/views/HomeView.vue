<template>
    <div class="min-h-screen">    
        <main class="pt-14 mb-14" role="main">
            <section class="pt-8">
                <div class="max-w-6xl mx-auto px-2">
                    <div class="flex items-center justify-between mb-10">
                    <!-- Title -->
                    <div class="space-y-4 flex-2 pr-8">
                        <h1 class="text-6xl font-bold leading-tight text-gray-900">
                        Track Your <span class="text-black bg-[#dcff1f] rounded-lg px-2">Health</span>
                        </h1>
                        <p class="text-gray-600">매일매일 성장하는 당신의 운동 기록을 관리하세요.</p>
                    </div>

                    <!-- Character Image -->
                    <div class="flex items-center relative w-48 h-80">
                        <div class="absolute top-12 -left-4 w-12 h-12 rounded-lg bg-gray-900"></div>
                        <div class="relative character-bg rounded-lg p-3">
                        <img src="@/assets/images/home_top.png" alt="Character" class="w-full h-full object-contain object-center max-w-[140px] mx-auto" />
                        </div>
                    </div>
                    </div>

                    <!-- Stats Grid -->
                    <div class="grid md:grid-cols-3 gap-5 mb-5">
                        <!-- Today's Workout -->
                        <div class="stat-card p-5 bg-white shadow-lg hover:shadow-xl rounded-2xl">
                            <div class="flex items-center justify-between">
                                <div>
                                <h3 class="font-semibold text-base mb-1 text-gray-900">오늘의 운동 수행</h3>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-2xl font-bold text-gray-900">
                                    {{ todayProgress }}%
                                    </span>
                                    <!-- <span class="text-sm text-gray-500">&nbsp; 수행 완료율</span> -->
                                </div>
                                </div>
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
                                <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Monthly Workout -->
                        <div class="stat-card p-4 bg-white shadow-lg hover:shadow-xl rounded-2xl">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-semibold text-base mb-1 text-gray-900">월간 운동</h3>
                                    <div class="flex items-baseline gap-1">
                                    <span class="text-2xl font-bold text-gray-900">{{ monthlyWorkoutDays }}</span>
                                    <span class="text-gray-500">일</span>
                                    </div>
                                </div>
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
                                    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <!-- Weekly Workout -->
                        <div class="stat-card p-4 bg-white shadow-lg hover:shadow-xl rounded-2xl">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="font-semibold text-base mb-1 text-gray-900">주간 운동</h3>
                                    <div class="flex items-baseline gap-1">
                                        <span class="text-2xl font-bold text-gray-900">
                                        {{ weeklyWorkoutDays }}
                                        </span>
                                        <span class="text-lg text-gray-400">/ 7</span>
                                        <span class="text-gray-500">회</span>
                                    </div>
                                </div>
                                <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
                                    <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </section>

            <!-- Charts Section -->
            <div class="grid grid-cols-2 gap-5 max-w-6xl mx-auto px-2">
                <!-- Weekly Progress Chart -->
                <div class="stat-card p-5 bg-black rounded-2xl">
                    <WeeklyProgress 
                        v-if="isAuthenticated && weeklyChartData"
                        :weekly-data="weeklyChartData"
                        :full-width="false"
                        class="h-36"
                    />
                    <div 
                        v-else 
                        class="stat-card p-5 bg-black rounded-2xl flex items-center justify-center text-gray-400"
                    >
                      로그인 후 확인 가능합니다
                    </div>
                    </div>

                <!-- Exercise Parts Distribution -->
                <div class="stat-card bg-black p-4 shadow-lg rounded-2xl">
                  <div class="flex items-center justify-between mb-2 p-4">
                    <h3 class="text-sm font-medium text-white">운동 부위 현황</h3>
                    <div class="px-2 py-1 rounded-full text-xs font-medium text-black" 
                        style="background-color: #dcff1f;">
                      Distribution
                    </div>
                  </div>
                                    
                  <div v-if="isLoading" class="h-24 flex items-center justify-center">
                    <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>분석 중...</span>
                  </div>
                    
                  <div v-else-if="!isAuthenticated" class="h-36 flex items-center justify-center text-gray-400">
                    로그인 후 확인 가능합니다
                  </div>
                  
                  <div v-else-if="partStats.length === 0" class="h-36 flex items-center justify-center text-gray-400">
                    운동 기록이 없습니다
                  </div>
                  
                  <div v-else class="space-y-2 px-4">
                    <div class="flex items-center space-x-2">
                        <svg class="w-5 h-5 text-[#dcff1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                        <span class="text-2xl font-semibold stat-value text-[#dcff1f]">
                          {{ partStats.slice(0, 3).map(stat => stat.part).join(' , ') }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-400">이번 달 가장 많이 운동한 부위입니다</p>
                    </div>
                </div>
            </div>
        </main>

        <!-- Diary Section -->
        <div class="grid md:grid-cols-2 gap-5 mt-5 mb-16 max-w-6xl mx-auto px-2">
        <!-- Monthly Calendar -->
        <div class="stat-card p-5 bg-white shadow-lg hover:shadow-xl rounded-2xl">
        <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-base text-gray-900">월간 다이어리</h3>
            <router-link 
            to="/diary" 
            class="text-sm text-gray-500 hover:text-gray-700"
            >
            다이어리로 이동
            </router-link>
        </div>

        <div class="bg-gray-50 rounded-lg">
            <DiaryCalendar
            v-if="isAuthenticated"
            :current-year="currentYear"
            :current-month="currentMonth"
            :selected-date="selectedDate"
            :routines="routines"
            @previous-month="previousMonth"
            @next-month="nextMonth"
            @select-date="selectDate"
            />
            <div 
            v-else 
            class="h-48 flex items-center justify-center text-gray-500"
            >
            로그인 후 확인 가능합니다
            </div>
        </div>
        </div>

        <!-- Selected Date Routines -->
        <DiaryRoutines
        v-if="isAuthenticated"
        :selected-date="selectedDate"
        :current-date="currentDate"
        :routines="routines"
        @show-routine-modal="showRoutineModal = true"
        @show-ai-modal="showAiModal = true"
        @show-set-count-modal="handleShowSetCountModal"
        @show-video="handleShowVideo"
        @update-routine="updateRoutine"
        @delete-routine="deleteRoutine"
        @update-routine-status="handleRoutineStatusUpdate"
        />
        <div 
        v-else 
        class="stat-card p-5 bg-white shadow-lg hover:shadow-xl rounded-2xl flex items-center justify-center text-gray-500"
        >
        로그인 후 확인 가능합니다
        </div>
    </div>

    <!-- Modals -->
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
        v-if="selectedVideo"
        :exercise-title="selectedExerciseTitle"
        @close="closeVideoModal"
    />

    <!-- Recommended Videos Section -->
    <div class="mb-16 col-span-2 max-w-6xl mx-auto px-2">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-3">
        <h2 class="font-bold text-3xl text-gray-900 mb-6">추천 운동 영상</h2>
        
        <!-- Category Filter -->
        <div class="flex gap-2">
            <button
            v-for="category in categories"
            :key="category.id"
            @click="handleCategoryChange(category.id)"
            class="px-4 py-2 rounded-full text-sm"
            :class="selectedCategory === category.id 
                ? 'bg-black text-[#dcff1f]' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
            {{ category.title }}
            </button>
        </div>
        </div>

        <!-- Loading State -->
        <div 
        v-if="videoStore.loading"
        class="grid md:grid-cols-3 gap-5"
        >
        <div 
            v-for="n in 6" 
            :key="n"
            class="animate-pulse bg-gray-200 rounded-2xl h-64"
        ></div>
        </div>

        <!-- Error State -->
        <div 
        v-else-if="videoStore.error"
        class="text-center py-10 text-gray-500"
        >
        영상을 불러오는데 실패했습니다.
        </div>

        <!-- Empty State -->
        <div 
        v-else-if="videoStore.videos.length === 0"
        class="text-center py-10 text-gray-500"
        >
        등록된 영상이 없습니다.
        </div>

        <!-- Videos Grid -->
        <div 
          v-else
          class="grid md:grid-cols-3 gap-5"
        >
          <div 
            v-for="video in limitedVideos" 
            :key="video.id"
            class="stat-card bg-white shadow-lg hover:shadow-xl overflow-hidden rounded-2xl cursor-pointer "
            @click="handleShowVideo(video)"
          >
            <!-- Video -->
            <div class="relative w-full aspect-video">
              <iframe 
                :src="video.videoUrl" 
                frameborder="0"
                class="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
              <div class="absolute inset-0 flex items-center justify-center bg-black/20 hover:opacity-100 transition-opacity">
                  
              </div>
            </div>

            <!-- Video Info -->
            <div class="p-6 flex items-center justify-between">
            <h4 class="font-medium text-gray-900 mb-1">{{ video.title }}</h4>
            <span class="px-3 py-1 text-xs bg-gray-100 rounded-full text-gray-600">
              {{ video.description }}
            </span>
            </div>
          </div>
        </div>
    </div>

    <VideoModal
        v-if="showVideoModal"
        :exercise-title="selectedExerciseTitle"
        @close="closeVideoModal"
      />
    
    <!-- Group & Board Section -->
    <div class="mb-28 max-w-6xl mx-auto px-2">
      <!-- Section Header -->
      <h2 class="font-bold text-3xl text-gray-900 mb-6">커뮤니티</h2>

      <!-- Grid Layout -->
      <div class="grid md:grid-cols-2 gap-5">
        <!-- Recent Group Posts -->
        <div class="stat-card p-5 bg-white shadow-lg hover:shadow-xl rounded-2xl">
        <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-base text-gray-900">최근 그룹 메이트 모집글</h3>
            <router-link 
            to="/group" 
            class="text-sm text-gray-500 hover:text-gray-700"
            >
            더보기
            </router-link>
        </div>

        <div class="space-y-3">
            <div 
            v-if="groups.length === 0" 
            class="p-3 bg-gray-50 rounded-lg text-center text-gray-500"
            >
            등록된 모집글이 없습니다
            </div>

            <div 
              v-for="group in groups" 
              :key="group.id"
              class="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              @click="router.push(`/group`)"
            >
            <div class="flex items-center gap-3 mb-2">
                <img 
                :src="group.imageUrl" 
                :alt="group.groupName"
                class="w-8 h-8 rounded-full object-cover"
                >
                <div>
                <div class="font-medium">{{ group.groupName }}</div>
                <div class="text-sm text-gray-500">{{ group.region }}</div>
                </div>
            </div>
            <div class="flex gap-2">
                <span 
                class="px-2 py-0.5 text-xs rounded-full"
                :class="group.mateStatus === '모집중' 
                    ? 'bg-[#dcff1f] text-black' 
                    : 'bg-gray-200 text-gray-600'"
                >
                {{ group.mateStatus }}
                </span>
                <span class="text-xs text-gray-500">
                {{ group.memberCount - group.currentMembers }}명 모집
                </span>
            </div>
            </div>
        </div>
        </div>

        <!-- Popular Board Posts -->
        <div class="stat-card p-5 bg-white shadow-lg hover:shadow-xl rounded-2xl">
        <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-base text-gray-900">인기 게시글</h3>
            <router-link 
            to="/board" 
            class="text-sm text-gray-500 hover:text-gray-700"
            >
            더보기
            </router-link>
        </div>

        <div class="space-y-3">
            <div 
            v-if="popularPosts.length === 0" 
            class="p-3 bg-gray-50 rounded-lg text-center text-gray-500"
            >
            등록된 게시글이 없습니다
            </div>

            <div 
            v-for="post in popularPosts" 
            :key="post.id"
            class="p-3 bg-gray-50 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-100"
            @click="router.push(`/board/${post.id}`)"
            >
            <div>
                <div class="font-medium">{{ post.title }}</div>
                <div class="text-sm text-gray-500">
                조회수 {{ post.viewCount }} · 댓글 {{ post.commentsCount }}
                </div>
            </div>
            <img 
                v-if="post.thumbnail"
                :src="post.thumbnail" 
                :alt="post.title"
                class="w-12 h-12 rounded-lg object-cover"
            >
            </div>
        </div>
        </div>
    </div>
    </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useStatsStore } from '@/stores/stats'
import WeeklyProgress from '@/components/diary/charts/WeeklyProgress.vue'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import DiaryCalendar from '@/components/diary/DiaryCalendar.vue'
import DiaryRoutines from '@/components/diary/DiaryRoutines.vue'
import RoutineModal from '@/components/diary/modals/RoutineModal.vue'
import SetCountModal from '@/components/diary/modals/SetCountModal.vue'
import AiRoutineModal from '@/components/diary/modals/AiRoutineModal.vue'
import VideoModal from '@/components/diary/modals/VideoModal.vue'
import { routine } from '@/stores/routine'
import { exercises } from '@/stores/exercise'
import { useAiRoutineStore } from '@/stores/aiRoutine'
import { useGroupStore } from '@/stores/group'
import { useBoardStore } from '@/stores/board'
import { useVideoStore } from '@/stores/video'

const router = useRouter()
const userStore = useUserStore()
const statsStore = useStatsStore()
const { user, isAuthenticated } = storeToRefs(userStore)
// const groupStore = useGroupStore()
const boardStore = useBoardStore()
const videoStore = useVideoStore()

const selectedVideo = ref(null)
const selectedCategory = ref(1)
const groups = ref([])
const popularPosts = ref([])
const currentDate = ref(new Date())
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonth = computed(() => currentDate.value.getMonth() + 1)
const selectedDate = ref(currentDate.value.getDate())
const routines = ref([])
const showRoutineModal = ref(false)
const showSetCountModal = ref(false)
const showAiModal = ref(false)
const showVideoModal = ref(false)
const editingRoutine = ref(null)
const selectedExerciseTitle = ref('')
const partStats = ref([])
const isLoading = ref(false)
const exercisesList = ref([])

const notifications = ref([])
const showNotifications = ref(false)
const showProfileMenu = ref(false)

const limitedVideos = computed(()=> {
  return videoStore.videos.slice(0,3)
})

const loadMonthlyExerciseParts = async () => {
  if (!isAuthenticated.value || !user.value?.id) {
    console.log('인증 확인:', { isAuthenticated: isAuthenticated.value, userId: user.value?.id })
    return
  }

  try {
    isLoading.value = true

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const exercisesData = await exercises.getAllExercises()    
    const routinesData = await routine.getRoutinesByMonth(user.value.id, year, month)
    // console.log('루틴 데이터:', routinesData)

    if (!routinesData || routinesData.length === 0) {
      console.log('루틴 데이터 없음')
      partStats.value = []
      return
    }

    const exerciseMap = new Map(
      exercisesData.map(exercise => {
        // console.log('운동 매핑:', { id: exercise.exercisesId, part: exercise.part })
        return [exercise.exercisesId, exercise.part]
      })
    )

    // 부위별 카운트
    const partCounts = {}
    routinesData.forEach(routine => {
      const part = exerciseMap.get(routine.exercisesId)
      if (part) {
        partCounts[part] = (partCounts[part] || 0) + 1
      }
    })

    partStats.value = Object.entries(partCounts)
      .map(([part, count]) => ({
        part,
        percentage: Math.round((count / routinesData.length) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)

  } catch (error) {
    console.error('월간 운동 부위 분석 실패:', error)
    partStats.value = []
  } finally {
    isLoading.value = false
  }
}

const categories = [
  { id: 1, title: '가슴' },
  { id: 2, title: '등' },
  { id: 3, title: '어깨' },
  { id: 4, title: '팔' },
  { id: 5, title: '코어' },
  { id: 6, title: '하체' },
  { id: 7, title: '전신' }
]

const handleCategoryChange = async (categoryId) => {
  try {
    selectedCategory.value = categoryId // 선택된 카테고리 상태 업데이트
    await videoStore.getVideosByCategory(categoryId)
  } catch (error) {
    console.error('카테고리별 비디오 로드 실패:', error)
  }
}

const aiRoutineStore = useAiRoutineStore()

const todayProgress = computed(() => {
  if (!statsStore.weeklyProgress.length) return 0

  const today = new Date().toLocaleDateString('ko-KR', { weekday: 'short' })
  const todayData = statsStore.weeklyProgress.find(day => day.date === today)
  return todayData?.progressRate || 0
})

const monthlyWorkoutDays = computed(() => {
  return statsStore.monthlyStats.workoutDays || 0
})

const weeklyWorkoutDays = computed(() => {
  if (!statsStore.weeklyProgress.length) return 0

  // progressRate가 0보다 큰 날짜의 수를 계산
  return statsStore.weeklyProgress.filter(day => day.progressRate > 0).length
})

const closeMenus = (e) => {
    if (!e.target.closest('.profile-menu')) {
        showProfileMenu.value = false
    }
    if (!e.target.closest('.notifications-menu')) {
        showNotifications.value = false
    }
}

const weeklyChartData = computed(() => {
  if (!statsStore.weeklyProgress.length) return null

  return {
    labels: statsStore.weeklyProgress.map(d => d.date),
    datasets: [{
      data: statsStore.weeklyProgress.map(d => d.progressRate),
      backgroundColor: '#dcff1f',
      borderRadius: 4
    }]
  }
})

const loadStats = async () => {
  if (!user.value?.id) return

  try {
    const currentDate = new Date()
    await statsStore.loadAllStats(currentDate, user.value.id)

    const exerciseList = await exercises.getAllExercises()
    const routinesByPart = {}
    let totalRoutines = 0

    for (const routine of statsStore.routines || []) {
      const exercise = exerciseList.find(ex => ex.exercisesId === routine.exercisesId)
      if (exercise) {
        routinesByPart[exercise.part] = (routinesByPart[exercise.part] || 0) + 1
        totalRoutines++
      }
    }

    partStats.value = Object.entries(routinesByPart)
      .map(([part, count]) => ({
        part,
        percentage: Math.round((count / totalRoutines) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4)  // Top 4 부위

  } catch (error) {
    console.error('통계 데이터 로드 실패:', error)
  }
}

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
  await loadRoutinesByDate(date)
}

const handleShowVideo = (video) => {
  if (!video) {
    console.error('Video object is undefined')
    return
  }
  
  selectedExerciseTitle.value = video.title
  showVideoModal.value = true
  console.log('Opening modal for video:', video.title)
}

const closeVideoModal = () => {
  showVideoModal.value = false
  selectedExerciseTitle.value = ''
}

const loadMonthRoutines = async () => {
  if (!isAuthenticated.value || !user.value?.id) return

  try {
    const monthlyRoutines = await routine.getRoutinesByMonth(
      user.value.id,
      currentYear.value,
      currentMonth.value
    )
    routines.value = monthlyRoutines
  } catch (error) {
    console.error('월별 루틴 로드 실패:', error)
  }
}

const loadRoutinesByDate = async (date) => {
  if (!isAuthenticated.value || !user.value?.id) return

  try {
    const selectedRoutines = await routine.getRoutinesByDate(
      user.value.id,
      format(new Date(currentYear.value, currentMonth.value - 1, date), 'yyyy-MM-dd')
    )
    const currentRoutines = routines.value || []
    const filteredRoutines = currentRoutines.filter(r => 
      !selectedRoutines.find(sr => sr.id === r.id)
    )
    routines.value = [...filteredRoutines, ...selectedRoutines]
  } catch (error) {
    console.error('날짜별 루틴 로드 실패:', error)
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
    await loadRoutinesByDate(selectedDate.value)
    showRoutineModal.value = false
  } catch (error) {
    console.error('루틴 추가 실패:', error)
  }
}

const handleShowSetCountModal = (routine) => {
  editingRoutine.value = routine
  showSetCountModal.value = true
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

const handleCloseAiModal = () => {
  showAiModal.value = false
  aiRoutineStore.reset()
}

const handleRoutinesSaved = async ({ routines: newRoutines, date }) => {
  try {
    if (Array.isArray(newRoutines)) {
      handleCloseAiModal()
      await loadRoutinesByDate(selectedDate.value)
    }
    handleCloseAiModal()
    alert('AI 추천 루틴이 저장되었습니다!')
  } catch (error) {
    console.error('루틴 저장 후 처리 실패:', error)
    alert('루틴 저장에 실패했습니다. 다시 시도해주세요.')
  }
}

const updateRoutine = async (updatedRoutine) => {
  try {
    const updated = await routine.updateRoutine(updatedRoutine)
    if (updated) {
      await loadRoutinesByDate(selectedDate.value)
    }
  } catch (error) {
    console.error('루틴 수정 실패:', error)
  }
}

const deleteRoutine = async (routineId) => {
  try {
    await routine.deleteRoutine(routineId)
    routines.value = routines.value.filter(r => r.id !== routineId)
  } catch (error) {
    console.error('루틴 삭제 실패:', error)
  }
}

const handleRoutineStatusUpdate = async ({ routineId }) => {
  try {
    await routine.updateRoutineStatus(routineId)
    await loadRoutinesByDate(selectedDate.value)
  } catch (error) {
    console.error('루틴 상태 업데이트 실패:', error)
    alert('루틴 상태 업데이트에 실패했습니다.')
  }
}

const fetchExercises = async () => {
  try {
    const data = await exercises.getAllExercises()
    exercisesList.value = data.map(exercise => ({
      id: exercise.exercisesId,
      title: exercise.name,
      categoryId: categories.find(cat => cat.title === exercise.part)?.id
    }))
  } catch (error) {
    console.error('운동 데이터 불러오기 실패:', error)
  }
}

// HomeView.vue의 loadGroups 함수 수정
const loadGroups = async () => {
  try {
    // 그룹 스토어 초기화
    const groupStore = useGroupStore()
    
    // 모집중인 그룹 데이터 가져오기
    const response = await groupStore.fetchGroups({
      pageNum: 1,
      pageSize: 3,
      mateStatus: '모집중'
    })
    
    // 각 그룹의 이미지 URL 가져오기
    const groupsWithImages = await Promise.all(
      response.list.map(async group => {
        let imageUrl = null
        try {
          // profileImageId가 있는 경우에만 이미지 로드
          if (group.groupImg) {
            imageUrl = await groupStore.getGroupImage(group.groupImg)
          }
        } catch (error) {
          console.error(`그룹 ${group.id}의 이미지 로드 실패:`, error)
          imageUrl = null // 이미지 로드 실패시 null로 설정
        }
        
        return {
          ...group,
          imageUrl: imageUrl
        }
      })
    )
    
    // 상태 업데이트
    groups.value = groupsWithImages
    
    // 디버깅을 위한 로그
    console.log('로드된 그룹:', groupsWithImages)
    
  } catch (error) {
    console.error('그룹 목록 로드 실패:', error)
    groups.value = []
  }
}

const loadPopularPosts = async () => {
  try {
    const response = await boardStore.getBoards({
      pageNum: 1,
      pageSize: 4,
      orderBy: 'view_count',
      orderDir: 'DESC'
    })
    
    const postsWithThumbnails = await Promise.all(
      response.list.map(async post => {
        const images = await boardStore.loadBoardImages(post.id)
        const thumbnail = images.length > 0 ? images[0].imageUrl : null
        return { ...post, thumbnail }
      })
    )
    
    popularPosts.value = postsWithThumbnails
  } catch (error) {
    console.error('인기 게시글 로드 실패:', error)
    popularPosts.value = []
  }
}

const loadInitialData = async () => {
  try {
    await Promise.all([
      loadGroups(),
      loadPopularPosts(),
      videoStore.getVideosByCategory(1), // 초기 카테고리(가슴) 비디오 로드
      loadMonthlyExerciseParts()
    ])
  } catch (error) {
    console.error('초기 데이터 로드 실패:', error)
  }
}

const loadAuthenticatedData = async () => {
  try {
    await Promise.all([
      fetchExercises(),
      loadMonthRoutines(),
      loadStats()
    ])
  } catch (error) {
    console.error('인증 데이터 로드 실패:', error)
  }
}

onMounted(async () => {
    await loadInitialData()
    await videoStore.fetchVideos()
    if (isAuthenticated.value) {
        await loadAuthenticatedData()
        await loadMonthlyExerciseParts()
    }
})

watch(() => groups.value, (newGroups) => {
  console.log('그룹 데이터 변경:', newGroups)
}, { deep: true })

watch(() => user.value?.id, async(newId) => {
  if (newId) {
    await loadAuthenticatedData()
    await loadMonthlyExerciseParts()
  }
})

watch(() => selectedCategory.value, async (newCategory) => {
  try {
    if (newCategory === 0) {
      await videoStore.fetchVideos()
    } else {
      await videoStore.getVideosByCategory(newCategory)
    }
  } catch (error) {
    console.error('카테고리별 비디오 로드 실패:', error)
  }
})

window.addEventListener('click', closeMenus)
</script>
  
<style scoped>
.notification-badge {
  @apply absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center;
}
.stat-card {
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
}
.character-bg {
  background: linear-gradient(45deg, #dcff1f 0%, #dcff1f 100%);
}
  </style>