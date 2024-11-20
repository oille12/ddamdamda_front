// stores/board.js
import { defineStore } from 'pinia'
import api from '@/api'

export const useBoardStore = defineStore('board', {
 state: () => ({
   boards: [],
   board: null,
   totalPages: 0,
   currentPage: 1,
   comments: [],
   boardImages: []
 }),


 actions: {
   async getBoards(pageRequest) {
    try{
      const requestData = {
        pageNum: pageRequest.pageNum || 1,
        pageSize: 5,
        search: pageRequest.search || null,
        keyword: pageRequest.keyword || null,
        orderBy: pageRequest.orderBy || 'created_at',
        orderDir: pageRequest.orderDir || 'DESC'
      }
      console.log('게시글 목록 요청 데이터:', requestData)
      const response = await api.post('/board/page', requestData)

      if (response.data) {
        this.boards = response.data.list
        this.totalPages = response.data.pages
        this.currentPage = pageRequest.pageNum
        return response.data
      }
    } catch (error) {
      console.error('게시글 목록 로드 에러:',error)
      this.boards = []
      this.totalPages = 0
      this.currentPage = 1
      throw error
    }
  },

  async increaseViewCount(boardId) {
    try {
      console.log('조회수 증가 요청 ID:', boardId)
      const response = await api.put(`/board/${boardId}`)
      return response.data
    } catch (error) {
      console.error('조회수 증가 실패:', error)
      throw error
    }
  },

  async getBoard(id) {
    try {
      await this.increaseViewCount(id)
      const response = await api.get(`/board/${id}`)
      this.board = response.data
      return response.data
    } catch (error) {
      console.error('Get board error:', error)
      throw error
    }
  },

  async getBoardImage(imageId) {
    try {
      const response = await api.get(`/boardimage/${imageId}`, {
        responseType: 'blob'
      })
      return URL.createObjectURL(response.data)
    } catch(error) {
      console.error('이미지 로딩 에러:', error)
      return null
    }
  },

  // 게시글의 모든 이미지 가져오기
  async loadBoardImages(boardId) {
    try {
      const response = await api.get(`/boardimage/board/${boardId}`)
      const imagesInfo = response.data

      const imagesWithUrls = await Promise.all(
        imagesInfo.map(async (image) => {
          const imageUrl = await this.getBoardImage(image.id)
          return {
            ...image,
            imageUrl
          }
        })
      )
      this.boardImages = imagesWithUrls
      return imagesWithUrls
    } catch(error) {
      console.error('게시글 이미지 로드 에러:', error)
      this.boardImages = []
      return []
    }
  },

  async deleteImage(imageId) {
    const response = await api.delete(`/boardimage/${imageId}`)
    return response.data
  },
  
  async createBoard(boardData) {
    try {
      // 1. JWT 토큰에서 userId 추출
      const token = localStorage.getItem('token')
      const userId = JSON.parse(atob(token.split('.')[1])).id
  
      // 2. FormData 생성
      const formData = new FormData()
      
      // 3. 게시글 데이터를 JSON으로 변환하여 추가
      const boardInfo = {
        userId: userId,
        category: boardData.category,
        title: boardData.title,
        content: boardData.content
      }
      formData.append('board',  new Blob([JSON.stringify(boardInfo)], {
        type: 'application/json'}))
      
      // 이미지 추가
      if (boardData.images && boardData.images.length > 0) {
        boardData.images.forEach(file => {
          formData.append('images', file)
        })
      }
      const response = await api.post('/board', formData)
      return response.data
      
    } catch(error) {
      console.error('게시글 생성 에러:', error)
      throw error
    }
  },

  async updateBoard(boardData) {
    try {
      const requestData = {
        id: boardData.id,
        title: boardData.title,
        content: boardData.content
      }

      console.log('게시글 수정 요청 데이터:', requestData)
      const response = await api.put('/board', requestData)
      return response.data
    } catch (error) {
      console.error('Update board error:', error)
      throw error
    }
  },

  async deleteBoard(boardId) {
    try {
      console.log('게시글 삭제 요청 ID:', boardId)
      const response = await api.delete(`/board/${boardId}`)
      return response.data
    } catch (error) {
      console.error('Delete board error:', error)
      throw error
    }
  },

  // 좋아요 관련
  async likeBoard(boardId) {
    try {
      // JWT 토큰에서 userId 추출
      const token = localStorage.getItem('token')
      const userId = JSON.parse(atob(token.split('.')[1])).id

      const requestData = {
        userId: userId,
        boardId: boardId
      }

      console.log('좋아요 요청 데이터:', requestData)
      const response = await api.post('/likes', requestData)
      await this.getBoard(boardId) 
      return response.data
    } catch (error) {
      console.error('좋아요 추가 에러:', error)
      throw error
    }
  },

  async unlikeBoard(boardId) {
    try {
      // JWT 토큰에서 userId 추출
      const token = localStorage.getItem('token')
      const userId = JSON.parse(atob(token.split('.')[1])).id

      const requestData = {
        userId: userId,
        boardId: boardId
      }

      console.log('좋아요 취소 요청 데이터:', requestData)
      const response = await api.delete('/likes', { data: requestData })
      // 게시글 정보 새로고침
      await this.getBoard(boardId)
      return response.data
    } catch (error) {
      console.error('좋아요 취소 에러:', error)
      throw error
    }
  },

  async checkLikeStatus(boardId) {
    try {
      const token = localStorage.getItem('token')
      const userId = JSON.parse(atob(token.split('.')[1])).id

      const requestData = {
        userId: userId,
        boardId: boardId
      }

      console.log('좋아요 상태 체크 요청 데이터:', requestData)
      const response = await api.post('/likes/info', requestData)
      console.log('좋아요 응답체크:',response.data)
      return Boolean(response.data)
      
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 400) {
        return false
      }
      console.error('좋아요 상태 확인 실패:', error)
      return false
    }
  },

  // 댓글 관련
  async getComments(pageRequest) {
    this.comments = [];
    const response = await api.post('/comment/page', pageRequest)
    this.comments = response.data.list
    return response.data
  },

  clearComments() {
    this.comments = []
  },

  async addComment(commentData) {
    try {
      // JWT 토큰에서 userId 추출
      const token = localStorage.getItem('token')
      const userId = JSON.parse(atob(token.split('.')[1])).id

      const requestData = {
        userId: userId,
        boardId: commentData.boardId,
        content: commentData.content
      }
      
      console.log('댓글 전송 데이터:', requestData)
      const response = await api.post('/comment', requestData)
      return response.data
    } catch(error) {
      console.error('Add comment error:', error)
      throw error
    }
  },

   async updateComment(commentData) {
    try {
      const requestData = {
        boardId: commentData.boardId,
        content: commentData.content
      }
      
      console.log('댓글 수정 요청 데이터:', requestData)
      const response = await api.post('/comment', requestData)
      return response.data
    } catch(error) {
      console.error('Update comment error:', error)
      throw error
    }
   },

   async deleteComment(commentId) {
    try {
      console.log('댓글 삭제 요청 ID:', commentId)
      const response = await api.delete(`/comment/${commentId}`)
      return response.data
    } catch (error) {
      console.error('Delete comment error:', error)
      throw error
    }
  },

  // // 이미지 관련
  // async uploadImage(file) {
  //   try {
  //     const formData = new FormData()
  //     formData.append('file', file)
  
  //     // const response = await api.post('/images/upload', formData, {
  //     //   headers: {
  //     //     'Content-Type': 'multipart/form-data'
  //     //   }
  //     // })

  //     // console.log('이미지 업로드 응답:', response.data)
  //     // 이미지 ID 추출
  //     // return parseInt(response.data.text.match(/(\d+)/)[0])


  //   } catch (error) {
  //     console.error('이미지 업로드 에러:', error)
  //     throw error
  //   }
  // },
  }
})