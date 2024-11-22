// src/routine.js
import api from '@/api'
import { useUserStore } from '@/stores/user'

export const routine = {
  // 루틴 목록 조회
  getRoutines: async () => {
    try {
      const userStore = useUserStore()
      const response = await api.get(`/routine/detail/${userStore.user.id}`)
      console.log('API getRoutines response:', response) // 응답 확인
      return response.data
    } catch (error) {
      console.error('루틴 조회 실패:', error)
      throw error
    }
  },

  // 루틴 추가
  addRoutines: async (routines) => {
    try {
      const userStore = useUserStore()
      
      const routinesWithUser = routines.map(routine => ({
        userId: userStore.user.id,
        title: routine.title,
        sets: routine.sets,
        reps: routine.reps,
        exerciseDate: routine.exerciseDate,
        exercisesId: routine.id,
        completed: false
      }))

      const addPromises = routinesWithUser.map(async routine => {
        const response = await api.post('/routine', routine)
        if (response.status === 201) {
          return response.data
        }
        throw new Error('루틴 추가 실패')
      })

      const response = await Promise.all(addPromises)
      return response
    } catch (error) {
      console.error('루틴 추가 실패:', error)
      throw error
    }
  },

  // 루틴 수정
  updateRoutine: async (routine) => {
    try {
      const response = await api.put(`/routine/edit`, routine)
      return response.data
    } catch (error) {
      console.error('루틴 수정 실패:', error)
      throw error
    }
  },

  // 루틴 삭제
  deleteRoutine: async (routineId) => {
    try {
      await api.delete(`/routine/${routineId}`)
      return true
    } catch (error) {
      console.error('루틴 삭제 실패:', error)
      throw error
    }
  },

  // 루틴 완료 처리
  updateRoutineStatus: async (routineId, completed) => {
    try {
        const response = await api.put(`/routine/complete/${routineId}`, {
          completed
        })
        return response.data
    } catch (error) {
        console.error('루틴 상태 업데이트 실패:', error)
        throw error
    }
  }
}