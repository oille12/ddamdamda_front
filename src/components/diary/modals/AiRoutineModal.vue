<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useAiRoutineStore } from '@/stores/aiRoutine'
import { storeToRefs } from 'pinia'
import { format } from 'date-fns'

const props = defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  selectedDate: {
    type: Date,
    required: true
  }
})

const emit = defineEmits(['close', 'routines-saved'])

const userStore = useUserStore()
const aiRoutineStore = useAiRoutineStore()
const { isLoading, error, recommendedRoutines } = storeToRefs(aiRoutineStore)

const currentStepLocal = ref(props.currentStep)
const isRequesting = ref(false)  // AI 추천 요청 상태
const isSaving = ref(false)      // 저장 프로세스 상태
const selectedExperience = ref(null)
const selectedPurposes = ref([])
const selectedAreas = ref([])
const selectedDuration = ref(60)

const experienceLevels = [
  { value: 'beginner', label: '초보자 (1년 미만)' },
  { value: 'intermediate', label: '중급자 (1-3년)' },
  { value: 'advanced', label: '상급자 (3년 이상)' }
]

const purposeOptions = [
  { value: 'muscle', label: '근비대' },
  { value: 'strength', label: '근력 향상' },
  { value: 'endurance', label: '지구력 향상' },
  { value: 'weight', label: '체중 감량' },
  { value: 'balance', label: '체형 교정' }
]

const areaOptions = [
  { value: 'chest', label: '가슴' },
  { value: 'back', label: '등' },
  { value: 'shoulder', label: '어깨' },
  { value: 'arms', label: '팔' },
  { value: 'core', label: '코어' },
  { value: 'legs', label: '하체' },
  { value: 'full', label: '전신' }
]

const durationOptions = [
  { value: 30, label: '30분' },
  { value: 60, label: '60분' },
  { value: 90, label: '90분' },
  { value: 120, label: '120분' }
]

// 로딩
const steps = [
  '운동 데이터베이스 검색 중...',
  '추천 루틴 생성 중...',
  '세트와 횟수 계산 중...',
  '결과 최적화 중...'
]
const currentLoadingStep = ref(0)
let loadingInterval

const isCurrentStepValid = computed(() => {
  switch (currentStepLocal.value) {
    case 1:
      return !!selectedExperience.value
    case 2:
      return selectedPurposes.value.length > 0
    case 3:
      return selectedAreas.value.length > 0
    case 4:
      return selectedDuration.value >= 30 && selectedDuration.value <= 120
    default:
      return true
  }
})

// 로딩 애니메이션
const startLoadingAnimation = () => {
  currentLoadingStep.value = 0
  loadingInterval = setInterval(() => {
    if (currentLoadingStep.value < steps.length - 1) {
      currentLoadingStep.value++
    } else {
      currentLoadingStep.value = 0
    }
  }, 8000)
}

const stopLoadingAnimation = () => {
  clearInterval(loadingInterval)
  currentLoadingStep.value = 0
}

// AI 추천 요청
const requestRecommendation = async () => {
  if (isRequesting.value) return

  try {
    isRequesting.value = true
    startLoadingAnimation()

    await aiRoutineStore.getRecommendation({
      experienceLevel: selectedExperience.value,
      purposes: selectedPurposes.value,
      targetAreas: selectedAreas.value,
      duration: selectedDuration.value
    })
    currentStepLocal.value = 5
  } catch (err) {
    console.error('AI 루틴 추천 실패:', err)
  } finally {
    isRequesting.value = false
    stopLoadingAnimation()
  }
}

// 루틴 저장
const saveRoutines = async () => {
  if (!recommendedRoutines.value) return

  try {
    isSaving.value = true
    const formattedDate = format(props.selectedDate, 'yyyy-MM-dd')

    const savedRoutines = await aiRoutineStore.saveRecommendation({
      userId: userStore.user.id,
      exerciseDate: formattedDate
    })
    
    if (savedRoutines && Array.isArray(savedRoutines)) {
      emit('routines-saved', {
        routines: savedRoutines,
        date: formattedDate
      })
    }
  } catch (err) {
    console.error('루틴 저장 실패:', err)
    alert('루틴 저장에 실패했습니다. 다시 시도해주세요.')
  } finally {
    isSaving.value = false
  }
}

const regenerateRoutine = () => {
  currentStepLocal.value = 1
  aiRoutineStore.reset()
}

const handleClose = () => {
  aiRoutineStore.reset()
  emit('close')
}

const previousStep = () => {
  if (currentStepLocal.value > 1) {
    currentStepLocal.value--
  }
}

const nextStep = () => {
  if (currentStepLocal.value === 4) {
    requestRecommendation()
  } else if (currentStepLocal.value < 5) {
    currentStepLocal.value++
  }
}

onUnmounted(() => {
  stopLoadingAnimation()
})
</script>

<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="ai-modal-container relative">
      <!-- 헤더 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-2">
          <div class="ai-badge">AI</div>
          <h3 class="text-xl font-bold">맞춤 루틴 생성</h3>
        </div>
        <button @click="handleClose" class="hover:opacity-70">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 로딩 오버레이 -->
      <div v-if="isRequesting" 
           class="absolute inset-0 bg-white rounded-xl z-50 flex items-center justify-center">
        <div class="text-center px-4 max-w-md">
          <!-- 로딩 애니메이션 컨테이너 -->
          <div class="relative w-32 h-32 mx-auto mb-8">
            <!-- 회전하는 원형 프로그레스 -->
            <svg class="loading-progress" viewBox="0 0 100 100">
              <circle
                class="loading-circle"
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
              />
              <!-- 별 -->
              <g class="loading-stars">
                <path class="star-1" d="M80,50 l5,-5 l-5,-5 l5,5 l5,-5 l-5,5 l5,5 l-5,-5 l-5,5"
                      fill="none" stroke="currentColor" stroke-width="2"/>
                <path class="star-2" d="M30,70 l5,-5 l-5,-5 l5,5 l5,-5 l-5,5 l5,5 l-5,-5 l-5,5"
                      fill="none" stroke="currentColor" stroke-width="2"/>
              </g>
            </svg>
            
            <!-- 중앙 텍스트 -->
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-2xl font-bold text-purple-600">AI</span>
            </div>
          </div>

          <!-- 메인 텍스트 -->
          <h3 class="text-2xl font-bold mb-6 text-purple-600">
            Generating...
          </h3>

          <!-- 단계별 텍스트 -->
          <div class="space-y-3 text-left">
            <div v-for="(step, index) in steps" :key="index"
                 :class="[
                   'flex items-center space-x-2 transition-all duration-500',
                   currentLoadingStep >= index ? 'opacity-100' : 'opacity-30'
                 ]"
            >
              <div class="flex-shrink-0 w-5 h-5">
                <svg v-if="currentLoadingStep > index" class="w-full h-full text-purple-600" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <div v-else-if="currentLoadingStep === index" 
                     class="w-full h-full border-2 border-purple-600 border-t-transparent rounded-full animate-spin">
                </div>
                <div v-else class="w-2 h-2 mx-1.5 my-1.5 bg-gray-300 rounded-full"></div>
              </div>
              <span :class="[
                'text-sm',
                currentLoadingStep >= index ? 'text-gray-800' : 'text-gray-400'
              ]">{{ step }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 컨텐츠 영역 -->
      <div class="min-h-[300px]">
        <!-- Step 1: 운동 경험 -->
        <div v-if="currentStepLocal === 1">
          <h4 class="font-medium mb-4">Q1. 운동 경험</h4>
          <div class="grid grid-cols-3 gap-3">
            <button 
              v-for="level in experienceLevels"
              :key="level.value"
              :class="[
                'px-4 py-2 rounded-lg text-sm transition-colors',
                selectedExperience === level.value 
                  ? 'bg-black text-[#dcff1f]' 
                  : 'bg-gray-100 hover:bg-gray-200'
              ]"
              @click="selectedExperience = level.value"
            >
              {{ level.label }}
            </button>
          </div>
        </div>

        <!-- Step 2: 운동 목적 -->
        <div v-else-if="currentStepLocal === 2">
          <h4 class="font-medium mb-4">Q2. 운동 목적 (복수 선택 가능)</h4>
          <div class="space-y-3">
            <label 
              v-for="option in purposeOptions" 
              :key="option.value"
              class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="option.value"
                v-model="selectedPurposes"
                class="w-5 h-5 rounded text-black focus:ring-black mr-3"
              >
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Step 3: 운동 부위 -->
        <div v-else-if="currentStepLocal === 3">
          <h4 class="font-medium mb-4">Q3. 운동 부위 (복수 선택 가능)</h4>
          <div class="space-y-3">
            <label 
              v-for="option in areaOptions" 
              :key="option.value"
              class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="option.value"
                v-model="selectedAreas"
                class="w-5 h-5 rounded text-black focus:ring-black mr-3"
              >
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- Step 4: 운동 시간 -->
        <div v-else-if="currentStepLocal === 4">
          <h4 class="font-medium mb-4">Q4. 운동 시간</h4>
          <div class="grid grid-cols-2 gap-3">
            <button 
              v-for="option in durationOptions"
              :key="option.value"
              :class="[
                'px-4 py-3 rounded-lg text-sm transition-colors',
                selectedDuration === option.value 
                  ? 'bg-black text-[#dcff1f]' 
                  : 'bg-gray-100 hover:bg-gray-200'
              ]"
              @click="selectedDuration = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

      <!-- Step 5: 결과 화면 -->
      <div v-else-if="currentStepLocal === 5" class="space-y-6">
        <div v-if="recommendedRoutines">
          <!-- AI 추천 헤더 -->
          <div class="relative overflow-hidden bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-100">
            <div class="flex items-start space-x-4">
              <!-- AI 아이콘 -->
              <div class="flex-shrink-0">
                <div class="relative">
                  <div class="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <span class="text-white font-bold text-lg">AI</span>
                  </div>
                  <div class="absolute -top-1 -right-1">
                    <div class="animate-pulse">
                      <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 추천 메시지 -->
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-3">
                  <span class="text-sm font-semibold text-purple-600">GPT-4 AI 트레이너</span>
                  <span class="text-xs text-gray-400"> | </span>
                  <span class="text-xs text-gray-400">맞춤형 루틴 생성 완료</span>
                </div>
                <p class="text-gray-700 leading-relaxed">{{ recommendedRoutines.recommendation }}</p>
              </div>
            </div>

            <!-- 장식용 패턴 -->
            <div class="absolute -right-4 -bottom-4 opacity-10">
              <svg class="w-16 h-16" viewBox="0 0 22 22" fill="currentColor">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z"/>
              </svg>
            </div>
          </div>
          <hr class="my-6">

          <!-- 운동 루틴 카드 리스트 -->
          <div class="grid gap-4">
            <div v-for="(routine, index) in recommendedRoutines.routines" 
                :key="routine.exerciseId"
                class="group bg-white p-4 rounded-xl border border-gray-200 transition-all duration-300 hover:shadow-md"
            >
              <!-- 운동 정보 헤더 -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-3">
                  <div class="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 text-sm font-semibold">
                    {{ index + 1 }}
                  </div>
                  <h5 class="font-semibold text-gray-700 transition-colors">
                    {{ routine.title }}
                  </h5>
                </div>
                <div class="flex items-center space-x-2 text-sm text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{{ routine.sets }}세트 {{ routine.reps }}회 반복</span>
                </div>
              </div>

              <!-- 세부 정보 -->
              <div class="pt-1">
                <!-- 운동 팁 -->
                <div v-if="routine.note" class="mt-2 p-3 bg-blue-50 rounded-lg">
                  <div class="flex items-start space-x-2">
                    <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-sm text-blue-700">{{ routine.note }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI 신뢰도 표시 -->
          <div class="bg-gray-50 rounded-xl p-4 mt-6">
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>GPT-4 AI 분석 기반 루틴</span>
              </div>
              <div class="flex items-center space-x-1 text-green-600">
                <span>99% Match</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- 버튼 그룹 -->
          <div class="space-y-3 mt-8">
            <button 
              @click="saveRoutines"
              class="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] focus:scale-[0.98]"
              :disabled="isSaving"
            >
              <span class="flex items-center justify-center space-x-2">
                <svg v-if="!isSaving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span class="font-medium">{{ isSaving ? '루틴 저장 중...' : 'AI 루틴으로 결정하기' }}</span>
              </span>
            </button>

            <button 
              @click="regenerateRoutine"
              class="w-full py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300"
              :disabled="isSaving"
            >
              <span class="flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span class="font-medium">루틴 다시 생성하기</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- 네비게이션 버튼 -->
      <div v-if="currentStepLocal < 5" class="flex justify-end mt-8 space-x-3">
        <button 
          v-if="currentStepLocal > 1" 
          @click="previousStep"
          class="px-4 py-2 text-sm hover:text-gray-600 transition-colors"
          :disabled="isRequesting"
        >
          이전
        </button>
        <button 
          @click="nextStep"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm hover:opacity-90 transition-colors disabled:opacity-50"
          :disabled="!isCurrentStepValid || isRequesting"
        >
          {{ currentStepLocal === 4 ? 'AI 루틴 생성하기' : '다음' }}
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.loading-progress {
  @apply w-full h-full text-purple-600;
  animation: spin 2s linear infinite;
  transform-origin: center;
}

.loading-circle {
  stroke-dasharray: 260;
  stroke-dashoffset: 100;
  transform-origin: center;
  animation: progress 4s ease-out infinite;
}

.loading-stars path {
  opacity: 0;
}

.star-1 {
  animation: twinkle 2s ease-in-out infinite;
}

.star-2 {
  animation: twinkle 2s ease-in-out infinite 1s;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes progress {
  0% {
    stroke-dashoffset: 260;
  }
  50% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 260;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

.ai-badge {
  @apply bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.ai-modal-container {
  @apply bg-white rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto;
}

.ai-modal-container::-webkit-scrollbar {
  width: 8px;
}

.ai-modal-container::-webkit-scrollbar-track {
  @apply bg-gray-100 rounded-full;
}

.ai-modal-container::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded-full hover:bg-gray-400;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
}

button:not(:disabled):active {
  transform: translateY(0);
}

button:hover svg {
  transform: scale(1.1);
}

button svg {
  transition: transform 0.2s ease;
}

.group:hover {
  transform: translateY(-2px);
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>