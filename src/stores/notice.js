import { defineStore } from 'pinia'
import api from '@/api'

export const useNoticeStore = defineStore('notice', {
  state: () => ({
    notifications: []
  }),

  actions: {
    // 알림 목록 조회
    async getNotifications(userId) {
      try {
        const response = await api.get(`/notice/${userId}`)
        return response.data
      } catch (error) {
        console.error('알림 목록 조회 에러:', error)
        throw error
      }
    },

    // 알림 읽음 처리
    async markAsRead(noticeId) {
      try {
        const response = await api.put(`/notice/${noticeId}`)
        return response.data
      } catch (error) {
        console.error('알림 읽음 처리 에러:', error)
        throw error
      }
    },

    // 알림 정보 조회
    async getNoticeInfo(notice) {
      try {
        const response = await api.post('/notice/info', notice)
        return response.data
      } catch (error) {
        console.error('알림 정보 조회 에러:', error)
        throw error
      }
    },

    // 알림 삭제
    async deleteNotification(noticeId) {
      try {
        const response = await api.delete(`/notice/${noticeId}`)
        return response.data
      } catch (error) {
        console.error('알림 삭제 에러:', error)
        throw error
      }
    }
  }
})