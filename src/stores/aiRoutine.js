// src/stores/aiRoutine.js
import api from '@/api'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAiRoutineStore = defineStore('aiRoutine', () => {
  const isLoading = ref(false)
  const error = ref(null)
  const recommendedRoutines = ref(null)

  // AI 루틴 추천 요청
  const getRecommendation = async (requestData) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.post('/routine/ai-recommendation', {
        experienceLevel: requestData.experienceLevel,
        purposes: requestData.purposes,
        targetAreas: requestData.targetAreas,
        duration: requestData.duration
      })
      recommendedRoutines.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'AI 루틴 추천을 받는데 실패했습니다.'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  // 추천받은 루틴 저장
  const saveRecommendation = async (routineData) => {
    if (!recommendedRoutines.value) return null
    
    try {
      // 1. 먼저 루틴을 Routine 객체로 변환
      const convertResponse = await api.post('/routine/ai-recommendation/convert', {
        routines: recommendedRoutines.value.routines,
        totalDuration: recommendedRoutines.value.totalDuration,
        recommendation: recommendedRoutines.value.recommendation,
        userId: routineData.userId
      })

      if (!convertResponse.data || !Array.isArray(convertResponse.data)) {
        throw new Error('루틴 변환에 실패했습니다.')
      }

      // console.log('변환된 루틴:', convertResponse.data)

      // 2. 변환된 각 루틴을 실제 루틴으로 저장
      const savePromises = convertResponse.data.map(async (routine) => {
        // 각 요청 전 데이터 로깅
        const routineToSave = {
          userId: routineData.userId,
          title: routine.title,
          exerciseDate: routineData.exerciseDate,
          sets: routine.sets,
          reps: routine.reps,
          exercisesId: routine.exercisesId,
          isCompleted: 0
        }
        // console.log('저장할 루틴 데이터:', routineToSave)

        try {
          const response = await api.post('/routine', routineToSave)
          return response.data
        } catch (err) {
          console.error('개별 루틴 저장 실패:', err)
          throw err
        }
      })

      // 3. 모든 루틴 저장
      const savedRoutines = await Promise.all(savePromises)
      // console.log('저장 성공한 루틴들:', savedRoutines)

      return savedRoutines

    } catch (err) {
      console.error('루틴 저장 실패:', err)
      if (err.response) {
        // console.error('에러 응답:', {
        //   data: err.response.data,
        //   status: err.response.status,
        //   headers: err.response.headers
        // })
      }
      error.value = err.response?.data?.message || '루틴 저장에 실패했습니다.'
      throw error.value
    }
  }

  const reset = () => {
    isLoading.value = false
    error.value = null
    recommendedRoutines.value = null
  }

  return {
    isLoading,
    error,
    recommendedRoutines,
    getRecommendation,
    saveRecommendation,
    reset
  }
})