// stores/group.js
import { defineStore } from 'pinia'
import api from '@/api'

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: [],
    totalPages: 0,
    currentPage: 1,
    selectedGroup: null
  }),

  actions: {
    async fetchGroups(pageRequest) {
      try {
        const requestData = {
          pageNum: pageRequest?.pageNum || 1,
          pageSize: pageRequest?.pageSize || 9,
          search: pageRequest?.search || null,
          mateStatus: pageRequest?.mateStatus || null,
          orderBy: pageRequest?.orderBy || 'created_at',
          orderDir: pageRequest?.orderDir || 'DESC'
        }
        
        const response = await api.post('/groupinfo/page', requestData)
        this.groups = response.data.list
        this.totalPages = response.data.pages
        this.currentPage = requestData.pageNum
        return response.data
      } catch (error) {
        console.error('그룹 목록 로드 에러:', error)
        throw error
      }
    },

    async getGroupDetail(groupId) {
      try {
        const response = await api.get(`/groupinfo/${groupId}`)
        this.selectedGroup = response.data
        return response.data
      } catch (error) {
        console.error('그룹 상세 조회 에러:', error)
        throw error
      }
    },

    async createGroup(groupData, imageFile) {
      try {
        const formData = new FormData()
        
        // GroupInfo 데이터 추가
        const groupInfo = {
          groupName: groupData.groupName,
          description: groupData.description,
          adminId: groupData.adminId,
          region: groupData.region,
          exerciseType: groupData.exerciseType,
          memberCount: groupData.memberCount,
          currentMembers: 1, // 생성 시 관리자 1명
          mateStatus: '모집중'
        }

        formData.append('groupInfo', new Blob([JSON.stringify(groupInfo)], {
          type: 'application/json'
        }))
        
        // 이미지 파일 추가
        formData.append('imageFile', imageFile)

        const response = await api.post('/groupinfo', formData)
        return response.data
      } catch (error) {
        console.error('그룹 생성 에러:', error)
        throw error
      }
    },

    async updateGroup(groupData, imageFile = null) {
      try {
        const formData = new FormData()
        
        formData.append('groupInfo', new Blob([JSON.stringify(groupData)], {
          type: 'application/json'
        }))
        
        if (imageFile) {
          formData.append('imageFile', imageFile)
        }

        const response = await api.put('/groupinfo', formData)
        return response.data
      } catch (error) {
        console.error('그룹 수정 에러:', error)
        throw error
      }
    },

    async deleteGroup(groupId) {
      try {
        const response = await api.delete(`/groupinfo/${groupId}`)
        return response.data
      } catch (error) {
        console.error('그룹 삭제 에러:', error)
        throw error
      }
    },

    async getUserGroups(userId) {
      try {
        const response = await api.get(`/groupinfo/user/${userId}`)
        return response.data
      } catch (error) {
        console.error('사용자 그룹 조회 에러:', error)
        throw error
      }
    }
  }
})