// stores/exercise.js
import { defineStore } from 'pinia'
import api from '@/api'

export const exercises = {
  // 모든 운동 목록 조회
  getAllExercises: async () => {
    try {
      const response = await api.get('/exercises')
      return response.data
    } catch (error) {
      console.error('운동 목록 조회 실패:', error)
      throw error
    }
  },

  // 특정 부위의 운동 목록 조회
  getExercisesByPart: async (partId) => {
    try {
      const response = await api.get(`/exercises/${partId}`)
      return response.data
    } catch (error) {
      console.error('부위별 운동 목록 조회 실패:', error)
      throw error
    }
  }
}