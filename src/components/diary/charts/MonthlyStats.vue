<script setup>
const props = defineProps({
  stats: {
    type: Object,
    required: true,
    validator: (value) => {
      return 'workoutDays' in value && 'totalHours' in value
    }
  }
})
</script>

<template>
  <div class="stat-card bg-black p-4 shadow-lg rounded-2xl">
    <h3 class="text-sm font-medium text-white mb-1">이번달 기록</h3>
    <div class="grid grid-cols-2 gap-2 mt-2">
      <div>
        <div class="text-2xl">
          <span class="font-bold" style="color: #dcff1f">{{ stats.workoutDays }}</span>
          <span class="text-white">일</span>
        </div>
        <div class="text-xs text-gray-500">운동일수</div>
      </div>
      <div>
        <div class="text-2xl">
          <span class="font-bold" style="color: #dcff1f">{{ stats.totalHours }}</span>
          <span class="text-white">시간</span>
        </div>
        <div class="text-xs text-gray-500">총 운동시간</div>
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
</style>