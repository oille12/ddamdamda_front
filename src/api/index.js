// api/index.js
import axios from 'axios'

const api = axios.create({
 baseURL: 'http://localhost:8080',
 headers: {
  //  'Content-Type': 'application/json'
 }
})

// JWT 토큰 인터셉터
api.interceptors.request.use(
 config => {
   const token = localStorage.getItem('token')
   console.log('현재 토큰:', token)

  // multipart/form-data 처리
  if (config.data instanceof FormData) {
    // Content-Type 헤더 삭제 (브라우저가 자동으로 설정하도록)
    delete config.headers['Content-Type']
  } else {
    config.headers['Content-Type'] = 'application/json'
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  //  if (token) {
  //   // console.log('Sending token:', token)
  //    config.headers.Authorization = `Bearer ${token}`
  //    console.log('요청 헤더:', config.headers)
  //  }
   return config
 },
 error => {
   return Promise.reject(error)
 }
)

// 응답 인터셉터 추가
api.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log('API 에러 상세:', {
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
      data: error.config?.data,
      response: error.response?.data
    })
    return Promise.reject(error)
  }
)

export default api