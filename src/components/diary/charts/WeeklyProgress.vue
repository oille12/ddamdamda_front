<script setup>
import { Bar } from 'vue-chartjs'
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

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  chartOptions: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="stat-card bg-black p-4 shadow-lg col-span-2 rounded-2xl">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-medium text-white">주간 운동 현황</h3>
      <div class="px-2 py-1 rounded-full text-xs font-medium text-black" 
           style="background-color: #dcff1f;">
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
</template>

<style scoped>
.stat-card {
  transition: all 0.3s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
}
</style>