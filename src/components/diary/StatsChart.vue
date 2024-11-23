<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStatsStore } from '@/stores/stats'
import { storeToRefs } from 'pinia'
import WeeklyProgress from './charts/WeeklyProgress.vue';

const props = defineProps({
  selectedDate: {
    type: Date,
    required: true
  },
  userId: {
    type: Number,
    required: true
  }
})

const statsStore = useStatsStore()
const { weeklyProgress, topParts, monthlyStats, isLoading } = storeToRefs(statsStore)

// 차트 데이터 포맷팅 - 주간 운동 현황
const weeklyChartData = computed(() => ({
  labels: weeklyProgress.value.map(d => d.date),
  datasets: [{
    data: weeklyProgress.value.map(d => d.progressRate),
    backgroundColor: '#dcff1f',
    borderRadius: 4
  }]
}))

// 데이터 로드
const loadStats = () => {
  if (props.userId && props.selectedDate) {
    statsStore.loadAllStats(props.selectedDate, props.userId)
  }
}

// 날짜 변경 감지
watch(() => props.selectedDate, loadStats)

// 초기 로드
onMounted(loadStats)
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <!-- 주간 운동 현황 -->
    <WeeklyProgress 
    :weekly-data="weeklyChartData"
    />

    <!-- 오늘의 득근 부위 -->
    <div class="stats-card bg-black p-4 shadow-lg rounded-2xl">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-md font-medium text-white mb-1">오늘의 득근 부위</h3>
      </div>
      
      <div v-if="isLoading" class="loading">
        <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
        <span>분석 중...</span>
      </div>
      
      <div v-else-if="topParts.length === 0" class="no-data">
        등록된 운동이 없습니다
      </div>
      
      <div v-else class="space-y-2">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-[#dcff1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                 d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span class="stat-value text-purple-600">
            {{ topParts.join(', ') }}
          </span>
        </div>
        <p class="stat-label">오늘 가장 집중한 운동 부위입니다</p>
      </div>
    </div>

    <!-- 이달의 기록 -->
    <div class="stats-card bg-black p-4 shadow-lg rounded-2xl">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-md font-medium text-white mb-1">이달의 기록</h2>
      </div>
      
      <div v-if="isLoading" class="loading">
        <span>로딩 중...</span>
      </div>
      
      <div v-else class="flex gap-16">
        <div>
          <div class="stat-label">운동 일수</div>
          <div class="stat-value">{{ monthlyStats.workoutDays }}일</div>
        </div>
        <div>
          <div class="stat-label">목표 성취율</div>
          <div class="stat-value text-green-600">
            {{ monthlyStats.achievementRate }}%
          </div>
        </div>
    </div>
    
  </div>
  </div>
</template>

<style scoped>
.stats-cards-container {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.stats-card {
  @apply bg-black p-4 shadow-lg rounded-2xl;
}

.stats-card h3 {
  @apply text-sm font-medium text-white;
}

.stats-card .stat-value {
  @apply text-xl font-bold text-[#dcff1f];
}

.stats-card .stat-label {
  @apply text-sm text-gray-400;
}

.stats-card .loading {
  @apply flex items-center justify-center h-20 text-white;
}

.stats-card .no-data {
  @apply flex items-center justify-center h-20 text-gray-400;
}
</style>