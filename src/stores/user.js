// stores/user.js
import { defineStore } from 'pinia'
import api from '@/api'

export const useUserStore = defineStore('user', {
 state: () => ({
   user: null,
   isAuthenticated: false,
   userProfile: null,
   profileImageUrl: null
 }),
 actions: {
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials)
      const { access_token } = response.data

      // 토큰 저장
      localStorage.setItem('token', access_token)
      
      // 토큰에서 사용자 정보 추출
      const decoded = JSON.parse(atob(access_token.split('.')[1]))
      this.user = {
        id: decoded.id,
        email: decoded.sub  // JWT에서의 subject는 email
      }

      this.isAuthenticated = true
      console.log('Login success')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },
  async logout() {
    try {
      const token = localStorage.getItem('token')

      await api.post('/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // 로그아웃 성공 후 토큰 제거
      localStorage.removeItem('token');

    } catch (error) {
      console.error('로그아웃 실패:',error)
    }
  },
  checkAuth() {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        this.user = {
          id: decoded.id,
          email: decoded.sub
        }
        this.isAuthenticated = true
      } catch (error) {
        console.error('Token decode error:', error)
        this.logout()
      }
    }
  },
  async getUserProfile(userId) {
    try {
      const response = await api.get(`/user/${userId}`)
      this.userProfile = response.data
      return response.data
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error)
      throw error
    }
  },

  // 현재 로그인한 사용자 정보 조회
  async getCurrentUserProfile() {
    try {
      if (!this.user?.id) return null
      return await this.getUserProfile(this.user.id)
    } catch (error) {
      console.error('현재 사용자 정보 조회 실패:', error)
      throw error
    }
  },
  
  // 이미지 업로드
  async uploadProfileImage(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('이미지 업로드 응답:', response)

      if (response.data) {
        return response.data  // imageId 반환
      } else {
        throw new Error('이미지 업로드 실패: ID를 못 받았습니다.')
      }
    } catch(error) {
      console.error('이미지 업로드 실패:',error)
      throw error
    }
  },

  // 이미지 조회
  async getProfileImage(imageId) {
    try {
      const response = await api.get(`/images/${imageId}`, {
        responseType: 'blob'
      })
      this.profileImageUrl = URL.createObjectURL(response.data)
      return this.profileImageUrl
    } catch (error) {
      console.error('이미지 조회 실패:',error)
      throw error
    }
  },

  // 닉네임 중복 체크
  async checkUsernameAvailable(username) {
    try {
      const response = await api.get(`/user/vaildname/${username}`)
      return true
    } catch (error) {
      if(error.response?.state === 409) {
        return false
      }
      console.error('닉네임 중복 체크 실패:', error)
      throw error
    }
  },

  // 프로필 수정
  async updateProfile(profileData) {
    try {
      const formData = new FormData()
      const userData = {
        id: this.userProfile.id,
        email: this.userProfile.email,
        username: profileData.username,
        password: profileData.password || null,
        profileImageId: profileData.profileImageId || this.userProfile.profileImageId
      }

      formData.append('userData', new Blob([JSON.stringify(userData)], {
        type: 'application/json'
      }))

      if (profileData.imageFile) {
        formData.append('imageFile', profileData.imageFile)
      }
      
      const response = await api.post('/user/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      await this.getCurrentUserProfile()
      return response.data

    } catch(error) {
      console.error('프로필 업데이트 실패:',error)
      throw error
    }
  }

 }
})
