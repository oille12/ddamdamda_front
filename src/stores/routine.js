// src/api/routine.js
import api from '@/api'
import { useUserStore } from '@/stores/user'

export const routine = {
  // 루틴 목록 조회
  getRoutines: async () => {
    try {
      const userStore = useUserStore()
      const response = await api.get(`/routines?userId=${userStore.user.id}`)
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
        ...routine,
        userId: userStore.user.id
      }))
      const response = await api.post('/routines', routinesWithUser)
      return response.data
    } catch (error) {
      console.error('루틴 추가 실패:', error)
      throw error
    }
  },

  // 루틴 수정
  updateRoutine: async (routine) => {
    try {
      const response = await api.put(`/routines/${routine.id}`, routine)
      return response.data
    } catch (error) {
      console.error('루틴 수정 실패:', error)
      throw error
    }
  },

  // 루틴 삭제
  deleteRoutine: async (routineId) => {
    try {
      await api.delete(`/routines/${routineId}`)
      return true
    } catch (error) {
      console.error('루틴 삭제 실패:', error)
      throw error
    }
  }
}