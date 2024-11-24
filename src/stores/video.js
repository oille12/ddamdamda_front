import { defineStore } from 'pinia'
import api from '@/api'
import { exercises } from './exercise' // exercise.js에서 가져옴

export const useVideoStore = defineStore('video', {
  state: () => ({
    videos: [],
    loading: false,
    error: null,
    selectedCategory: null
  }),

  actions: {
    async fetchVideos() {
        this.loading = true
        this.error = null
        try {
            const allExercises = await exercises.getAllExercises()
            this.videos = allExercises.map(exercise => ({
            id: exercise.exercisesId,
            title: exercise.name,
            description: exercise.part,
            videoUrl: exercise.videoUrl
            }))
        } catch (error) {
            console.error('비디오 로드 실패:', error)
            this.error = '운동 영상을 불러오는 데 실패했습니다.'
        } finally {
            this.loading = false
        }
    },
    async getVideosByCategory(partId) {
        this.loading = true
        this.error = null
        try {
          const filteredExercises = await exercises.getExercisesByPart(partId)
          this.videos = filteredExercises.map(exercise => ({
            id: exercise.exercisesId,
            title: exercise.name,
            description: exercise.part,
            thumbnailUrl: '/api/placeholder/400/225',
            videoUrl: exercise.videoUrl
          }))
        } catch (error) {
          console.error('카테고리별 비디오 로드 실패:', error)
          this.error = '해당 부위의 영상을 불러오는 데 실패했습니다.'
        } finally {
          this.loading = false
        }
    },
    // 선택된 카테고리에 따라 데이터 변경
    async handleCategoryChange(partId) {
        this.selectedCategory = partId
        if (partId === null) {
        await this.fetchVideos() // 모든 데이터 로드
        } else {
        await this.getVideosByCategory(partId) // 부위별 데이터 로드
        }
    }
  }
})