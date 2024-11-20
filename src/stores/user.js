// stores/user.js
import { defineStore } from 'pinia'
import api from '@/api'
import axios from 'axios'

export const useUserStore = defineStore('user', {
 state: () => ({
   user: null,
   isAuthenticated: false
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
        //  console.log('토큰 확인:', access_token)

       console.log('Login success')
      //  return response.data
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
      
      // 로그아웃 성공 후 처리
      localStorage.removeItem('token'); // 토큰 제거

    } catch (error) {
      console.error('로그아웃 실패:',error)
    }
    //  localStorage.removeItem('token')
    //  this.user = null
    //  this.isAuthenticated = false
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
   }
 }
})
