<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentYear: {
    type: Number,
    required: true
  },
  currentMonth: {
    type: Number,
    required: true
  },
  selectedDate: {
    type: Number,
    default: null
  },
  routines: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['previous-month', 'next-month', 'select-date'])

// 요일 배열
const weekDays = ['일', '월', '화', '수', '목', '금', '토']

// 달력 날짜 계산
const calendarDays = computed(() => {
  const days = []
  const firstDay = new Date(props.currentYear, props.currentMonth - 1, 1)
  const lastDay = new Date(props.currentYear, props.currentMonth, 0)
  
  // 이전 달의 날짜 추가
  const firstDayOfWeek = firstDay.getDay()
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevDate = new Date(firstDay)
    prevDate.setDate(firstDay.getDate() - firstDayOfWeek + i)
    days.push({
      date: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: false,
      isSelected: false,
      hasRoutine: hasRoutineOnDate(prevDate)
    })
  }
  
  // 현재 달의 날짜 추가
  const today = new Date()
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: i === today.getDate() && 
               props.currentMonth === today.getMonth() + 1 &&
               props.currentYear === today.getFullYear(),
      isSelected: i === props.selectedDate,
      hasRoutine: hasRoutineOnDate(new Date(props.currentYear, props.currentMonth - 1, i))
    })
  }
  
  return days
})

// 특정 날짜에 루틴이 있는지 확인
const hasRoutineOnDate = (date) => {
  return props.routines.some(routine => {
    const routineDate = new Date(routine.date)
    return routineDate.getDate() === date.getDate() &&
           routineDate.getMonth() === date.getMonth() &&
           routineDate.getFullYear() === date.getFullYear()
  })
}

// 날짜별 클래스 계산
const getDayClasses = (day) => {
  return {
    'text-gray-400': !day.isCurrentMonth,
    'bg-[#dcff1f]': day.isToday,
    'bg-black text-white': day.isSelected && !day.isToday,
    'after:absolute after:top-9 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-red-400 after:rounded-full': day.hasRoutine
  }
}
</script>

<template>
  <div class="stat-card bg-white p-6 shadow-lg h-full rounded-2xl">
    <!-- 달력 헤더(년 월) -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold">{{ currentYear }}년 {{ currentMonth }}월</h2>
      <div class="flex space-x-2">
        <button @click="emit('previous-month')" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button @click="emit('next-month')" class="p-1 hover:bg-gray-100 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 달력 내부 -->
    <div class="grid grid-cols-7 gap-1">
      <!-- 요일 헤더 -->
      <template v-for="(day, index) in weekDays" :key="index">
        <div 
          class="text-center text-sm font-medium py-2"
          :class="{'text-red-500': index === 0, 'text-blue-500': index === 6}"
        >
          {{ day }}
        </div>
      </template>

      <!-- 날짜 표시 -->
      <template v-for="(day, index) in calendarDays" :key="index">
        <div 
          class="aspect-square p-2 text-center cursor-pointer relative rounded-full transition-all hover:bg-gray-50"
          :class="getDayClasses(day)"
          @click="emit('select-date', day.date)"
        >
          {{ day.date }}
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