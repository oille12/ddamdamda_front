// src/routine.js
import api from '@/api'
import { useUserStore } from '@/stores/user'

export const routine = {
  // 루틴 목록 조회
  getRoutines: async () => {
    try {
      const userStore = useUserStore()
      const response = await api.get(`/routine/detail/${userStore.user.id}`)
      // console.log('API 응답 확인:', response)
      return response.data
    } catch (error) {
      console.error('루틴 조회 실패:', error)
      throw error
    }
  },

  // 특정 날짜의 루틴 조회 (like 검색 방식 적용)
  getRoutinesByDate: async (userId, date) => {
    try {
      const response = await api.post('/routine/date', {
        userId: Number(userId),
        exerciseDate: date
      })
      return response.data
    } catch (error) {
      console.error('특정 날짜 루틴 조회 실패:', error.response?.data || error)
      throw error
    }
  },

  // 월별 루틴 조회 추가
  getRoutinesByMonth: async (userId, year, month) => {
    const formattedMonth = String(month).padStart(2, '0')
    try {
      const response = await api.post('/routine/date', {
        userId: Number(userId),
        exerciseDate: `${year}-${formattedMonth}`  // YYYY-MM 형식
      })
      return response.data
    } catch (error) {
      console.error('월별 루틴 조회 실패:', error)
      throw error
    }
  },

  // 특정 날짜의 루틴 개수 조회
  getRoutineCount: async (userId, date) => {
    try {
      const response = await api.post('/routine/count', {
        userId: Number(userId),
        exerciseDate: date
      })
      return response.data
    } catch (error) {
      console.error('루틴 개수 조회 실패:', error)
      throw 0
    }
  },

  // 특정 날짜의 완료된 루틴 개수 조회
  getCompletedRoutineCount: async (userId, date) => {
    try {
      const response = await api.post('/routine/count/complete', {
        userId: Number(userId),
      exerciseDate: date
      })
      return response.data
    } catch (error) {
      console.error('완료된 루틴 개수 조회 실패:', error)
      throw 0
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
  updateRoutineStatus: async (routineId) => {
    try {
        const response = await api.put(`/routine/complete/${routineId}`)
        return response.data
    } catch (error) {
        console.error('루틴 상태 업데이트 실패:', error)
        throw error
    }
  }
  
}