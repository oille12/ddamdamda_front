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
  weeklyData: {
    type: Object,
    required: true
  },
  fullWidth: {
    type: Boolean,
    default: true  // 다이어리 페이지를 위해 기본값은 true
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: '#ffffff',
        font: {
          size: 10
        }
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        color: '#ffffff',
        font: {
          size: 10
        }
      }
    }
  },
  plugins: {
    legend: { display: false }
  }
}
</script>

<template>
  <div class="stat-card bg-black p-4 shadow-lg col-span-2 rounded-2xl"
    :class="{ 'col-span-2': fullWidth }"
  >
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-medium text-white">주간 운동 현황</h3>
      <div class="px-2 py-1 rounded-full text-xs font-medium text-black" 
           style="background-color: #dcff1f;">
        This Week
      </div>
    </div>
    <div class="h-24">
      <Bar
        :data="weeklyData"
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