// stores/user.js
import { defineStore } from 'pinia'
import api from '@/api'
import router from '@/router' 

export const useUserStore = defineStore('user', {
 state: () => ({
   user: null,
   isAuthenticated: false,
   userProfile: null,
   profileImageUrl: null,
   token: null
 }),
 actions: {
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials)
      const { access_token } = response.data

      // 토큰 저장
      localStorage.setItem('token', access_token)
      this.token = access_token
      
      // 토큰에서 사용자 정보 추출
      const decoded = JSON.parse(atob(access_token.split('.')[1]))
      this.user = {
        id: decoded.id,
        email: decoded.sub  // JWT에서의 subject는 email
      }

      this.isAuthenticated = true

      await this.getCurrentUserProfile()
      if (this.userProfile?.profileImageId) {
        await this.getProfileImage(this.userProfile.profileImageId)
      }

      console.log('로그인 성공')
    } catch (error) {
      console.error('로그인 실패:', error)
      throw error
    }
  },
  async logout() {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await api.post('/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
      
      console.log('로그아웃 성공')
    } catch (error) {
      console.error('로그아웃 실패:',error)
    } finally {
      // 상태 초기화
      localStorage.removeItem('token')
      this.token = null
      this.user = null
      this.userProfile = null
      this.profileImageUrl = null
      this.isAuthenticated = false
    }
  },

  async checkAuth() {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        this.token = token
        const decoded = JSON.parse(atob(token.split('.')[1]))
        this.user = {
          id: decoded.id,
          email: decoded.sub
        }
        this.isAuthenticated = true

        await this.getCurrentUserProfile()
        if (this.userProfile?.profileImageId) {
          this.getProfileImage(this.userProfile.profileImageId)
        }
        return true
      } catch (error) {
        console.error('Token decode error:', error)
        await this.logout()
        return false
      }
    }
    return false
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
      const response = await api.get(`/user/vaildname/${username}`);
      return response.data.message === 'success';  // success면 true 반환
    } catch (error) {
      if (error.response?.status === 409) {  // CONFLICT
        return false;  // 이미 존재하는 닉네임
      }
      console.error('닉네임 중복 체크 실패:', error);
      throw error;
    }
  },

  async checkEmailAvailable(email) {
    try {
      const response = await api.get(`/user/vaildemail/${email}`);  // vaildemail로 수정
      return response.data.message === 'success';  // success면 true 반환
    } catch (error) {
      if (error.response?.status === 409) {  // CONFLICT
        return false;  // 이미 존재하는 이메일
      }
      console.error('이메일 중복 체크 실패:', error);
      throw error;
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
  },
  
  async deleteAccount(userId) {
    try {
      const response = await api.delete(`/user/${userId}`)
      return response.data
    } catch(error) {
      console.error('탈퇴 에러 :', error)
      throw error
    }
  },

  // 회원가입 
  async signup(userData) {
    try {
      const userDto = {
        email: userData.email,
        password: userData.password,
        username: userData.username
      }
  
      const response = await api.post('/register', userDto)
      return response.data
    } catch (error) {
      console.error('회원가입 에러:', error)
      throw error
    }
  },
  async verifyPassword(password) {
    try {
      const response = await api.post('/user/validpassword', {
        id: this.userProfile.id,
        password: password
      });
      return response.data; // true/false 반환
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      throw error;
    }
  }
 }
})
