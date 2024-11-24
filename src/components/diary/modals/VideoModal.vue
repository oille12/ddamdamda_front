<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- 배경 오버레이 -->
    <div class="fixed inset-0 bg-black/50" @click="emit('close')"></div>

    <!-- 모달 컨텐츠 -->
    <div class="relative min-h-screen flex items-center justify-center p-4">
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <!-- 모달 헤더 -->
        <div class="flex items-center justify-between p-4 border-b">
          <h2 class="text-xl font-bold">{{ exerciseTitle }} 가이드</h2>
          <button @click="emit('close')" class="p-1 hover:text-gray-700">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>

        <!-- 모달 본문 -->
        <div class="p-6">
          <!-- 로딩 스피너 -->
          <div v-if="isLoading" class="flex justify-center items-center py-10">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-black"></div>
          </div>

          <!-- 영상 컨텐츠 -->
          <div v-else>
            <div class="aspect-video w-full">
              <iframe 
                v-if="videoUrl"
                :src="videoUrl"
                class="w-full h-full rounded-lg"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
              <div v-else class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                <p class="text-gray-500">영상을 찾을 수 없습니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { exercises } from '@/stores/exercise'

const props = defineProps({
  exerciseTitle: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const videoUrl = ref('')
const isLoading = ref(true)

watchEffect(async () => {
  if (props.exerciseTitle) {
    isLoading.value = true
    try {
      const allExercises = await exercises.getAllExercises()
      const exercise = allExercises.find(ex => ex.name === props.exerciseTitle)
     
      if (exercise?.videoUrl) {
        videoUrl.value = exercise.videoUrl
      }
    } catch (error) {
      console.error('운동 영상 데이터 로드 실패:', error)
    } finally {
      isLoading.value = false
    }
  }
})
</script>

<style scoped>
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>