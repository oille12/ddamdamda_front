<script setup>
const props = defineProps({
  currentYear: {
    type: Number,
    required: true
  },
  currentMonth: {
    type: Number,
    required: true
  },
  calendarDays: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['previous-month', 'next-month', 'select-date'])

// 날짜별 클래스 계산
const getDayClasses = (day) => {
  return {
    'text-gray-400': !day.isCurrentMonth,
    'bg-[#dcff1f]': day.isToday,
    'bg-black text-white': day.isSelected && !day.isToday
  }
}

// 운동 여부 체크 (임시)
const hasWorkout = (day) => {
  return false
}
</script>

<template>
  <div class="stat-card bg-white p-6 shadow-lg h-full rounded-2xl">
    <!-- 달력 헤더(년 월) -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">{{ currentYear }}년 {{ currentMonth }}월</h2>
      <div class="flex space-x-2">
        <button @click="emit('previous-month')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button @click="emit('next-month')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 달력 내부 -->
    <div class="grid grid-cols-7 gap-1">
      <!-- 요일 헤더 -->
      <div class="text-center text-sm font-medium text-red-500">일</div>
      <div class="text-center text-sm font-medium">월</div>
      <div class="text-center text-sm font-medium">화</div>
      <div class="text-center text-sm font-medium">수</div>
      <div class="text-center text-sm font-medium">목</div>
      <div class="text-center text-sm font-medium">금</div>
      <div class="text-center text-sm font-medium text-blue-500">토</div>

      <!-- 날짜 표시 -->
      <template v-for="(day, index) in calendarDays" :key="index">
        <div 
          class="aspect-square p-2 text-center cursor-pointer relative rounded-full"
          :class="getDayClasses(day)"
          @click="emit('select-date', day)"
        >
          {{ day.date }}
          <div v-if="hasWorkout(day)" class="absolute bottom-1 left-1/2 transform -translate-x-1/2">
            <div class="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
          </div>
        </div>
      </template>
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
</style>