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

    async uploadGroupImage(file) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post('/images/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        return response.data  // imageId 반환
      } catch(error) {
        console.error('이미지 업로드 실패:', error)
        throw error
      }
    },

    async getGroupImage(imageId) {
      if (!imageId) return null
      
      try {
        const response = await api.get(`/images/${imageId}`, {
          responseType: 'blob'
        })
        return URL.createObjectURL(response.data)
      } catch (error) {
        console.error('이미지 조회 실패:', error)
        return null
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

    // stores/group.js의 createGroup 메서드
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
          currentMembers: 1,
          mateStatus: '모집중'
        }

        // 순서 중요: groupInfo를 먼저 추가하고 imageFile을 추가
        formData.append('groupInfo', new Blob([JSON.stringify(groupInfo)], {
          type: 'application/json'
        }))

        // 이미지 파일 추가
        if (imageFile) {
          formData.append('imageFile', imageFile, imageFile.name)  // 파일 이름도 함께 전송
        }

        // FormData 내용 확인 (디버깅용)
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1]) 
        }

        const response = await api.post('/groupinfo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // 다른 헤더는 axios interceptor에서 처리
          }
        })
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