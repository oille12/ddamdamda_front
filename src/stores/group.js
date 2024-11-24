import { defineStore } from 'pinia'
import api from '@/api'

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: [],
    totalPages: 0,
    currentPage: 1,
    selectedGroup: null,
    groupMembers: new Map(),
    myGroups: [],
    loading: false
  }),

  actions: {
    async fetchGroups(pageRequest) {
      try {
        const requestData = {
          pageNum: pageRequest?.pageNum || 1,
          pageSize: pageRequest?.pageSize || 3,
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

    // stores/group.js의 fetchMyGroups 수정
    async fetchMyGroups(userId) {
      this.loading = true
      try {
        const response = await api.get(`/groupinfo/user/${userId}`)
        this.myGroups = response.data
        return response.data
      } catch (error) {
        console.error('내 그룹 목록 로드 실패:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // stores/group.js
    async getLatestNotice(groupId) {
      try {
        console.log('공지사항 요청 ID:', groupId) // 요청 ID 확인
        
        const response = await api.get(`/groupnotice/latest/${groupId}`)
        console.log('공지사항 응답:', response.data) // 응답 데이터 확인
        
        return response.data
      } catch (error) {
        if (error.response?.status === 400) {
          console.log('공지사항 없음 (그룹 ID:', groupId, ')') // 400 에러 확인
          return null
        }
        console.error(`최신 공지 로드 실패 (그룹 ${groupId}):`, error)
        return null
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

    async createGroup(groupData, imageFile) {
      try {
        const formData = new FormData()
        
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

        formData.append('groupInfo', new Blob([JSON.stringify(groupInfo)], {
          type: 'application/json'
        }))

        if (imageFile) {
          formData.append('imageFile', imageFile)
        }

        const response = await api.post('/groupinfo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data
      } catch (error) {
        console.error('그룹 생성 에러:', error)
        throw error
      }
    },

    async updateGroup(formData) {
      try {
        const response = await api.put('/groupinfo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
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

    async getGroupMembers(groupId) {
      try {
        const response = await api.get(`/groupmembers/${groupId}`)
        this.groupMembers.set(groupId, response.data)
        return response.data
      } catch (error) {
        console.error('그룹 멤버 조회 실패:', error)
        return []
      }
    },

    async getGroupMemberCreatedAt(groupId, userId) {
      try {
        const response = await api.post(`/groupmembers/${groupId}`, {
          groupId,
          userId
        })
        return response.data
      } catch (error) {
        console.error('멤버 가입일 조회 실패:', error)
        return null
      }
    },

    async checkMembershipStatus(groupId, userId) {
      try {
        let members = this.groupMembers.get(groupId)
        if (!members) {
          members = await this.getGroupMembers(groupId)
        }
        return members.some(member => member.id === userId)
      } catch (error) {
        console.error('멤버십 상태 확인 실패:', error)
        return false
      }
    },

    async joinGroup(groupId, userId) {
      try {
        const response = await api.post('/groupmembers', {
          groupId,
          userId
        })
        await this.getGroupMembers(groupId)
        await this.refreshGroupInfo(groupId)
        return response.data
      } catch (error) {
        console.error('그룹 참가 실패:', error)
        throw error
      }
    },

    async leaveGroup(groupId, userId) {
      try {
        const response = await api.delete('/groupmembers', {
          data: { groupId, userId }
        })
        await this.getGroupMembers(groupId)
        await this.refreshGroupInfo(groupId)
        return response.data
      } catch (error) {
        console.error('그룹 탈퇴 실패:', error)
        throw error
      }
    },

    async refreshGroupInfo(groupId) {
      try {
        const response = await api.get(`/groupinfo/${groupId}`)
        const index = this.groups.findIndex(g => g.id === groupId)
        if (index !== -1) {
          this.groups[index] = response.data
        }
        return response.data
      } catch (error) {
        console.error('그룹 정보 갱신 실패:', error)
        throw error
      }
    },

    async fetchGroupNotices(pageRequest) {
      try {
        const response = await api.post('/groupnotice/page', {
          ...pageRequest,
          pageSize: pageRequest.pageSize || 5
        })
        return response.data
      } catch (error) {
        console.error('공지사항 목록 로드 실패:', error)
        throw error
      }
    },

    async createGroupNotice(formData) {
      try {
        const response = await api.post('/groupnotice', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data
      } catch (error) {
        console.error('공지사항 생성 에러:', error)
        throw error
      }
    },

        // 공지사항 상세 조회
    async getGroupNoticeDetail(gnoticeId) {
      try {
        const response = await api.get(`/groupnotice/${gnoticeId}`)
        return response.data
      } catch (error) {
        console.error('공지사항 상세 조회 에러:', error)
        throw error
      }
    },

    // 공지사항 삭제
    async deleteGroupNotice(gnoticeId) {
      try {
        const response = await api.delete(`/groupnotice/${gnoticeId}`)
        return response.data
      } catch (error) {
        console.error('공지사항 삭제 에러:', error)
        throw error
      }
    },

    async updateGroupNotice(formData) {
      try {
        const response = await api.put('/groupnotice', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data
      } catch (error) {
        console.error('공지사항 수정 에러:', error)
        throw error
      }
    },

    // 댓글 목록 조회
    async getGroupNoticeComments(pageRequest) {
      try {
        const response = await api.post('/gcomment/page', pageRequest)
        return response.data
      } catch (error) {
        console.error('댓글 목록 조회 에러:', error)
        throw error
      }
    },

    // 댓글 작성
    async createComment(commentData) {
      try {
        const response = await api.post('/gcomment', commentData)
        return response.data
      } catch (error) {
        console.error('댓글 작성 에러:', error)
        throw error
      }
    },

    // 댓글 수정
    async updateComment(commentData) {
      try {
        const response = await api.put('/gcomment', commentData)
        return response.data
      } catch (error) {
        console.error('댓글 수정 에러:', error)
        throw error
      }
    },

    // 댓글 삭제
    async deleteComment(commentId) {
      try {
        const response = await api.delete(`/gcomment/${commentId}`)
        return response.data
      } catch (error) {
        console.error('댓글 삭제 에러:', error)
        throw error
      }
    },

    // 공지사항 이미지 목록 조회
    async getGnoticeImages(gnoticeId) {
      try {
        const response = await api.get(`/gnoticeimage/gnotice/${gnoticeId}`)
        return response.data
      } catch (error) {
        console.error('공지사항 이미지 목록 조회 에러:', error)
        throw error
      }
    },

    // 이미지 URL 가져오기
    async getGnoticeImageUrl(imageId) {
      try {
        const response = await api.get(`/gnoticeimage/${imageId}`, {
          responseType: 'blob'
        })
        return URL.createObjectURL(response.data)
      } catch (error) {
        console.error('이미지 URL 생성 에러:', error)
        throw error
      }
    },

    clearMyGroups() {
      this.myGroups = []
      this.loading = false
    }
  }
})