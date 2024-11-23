<template>
    <main class="pt-20 pb-20" role="main">
      <div class="max-w-4xl mx-auto px-6">
        <!-- 상단 네비게이션 -->
        <div class="flex justify-between items-center mb-8">
          <button 
            @click="$router.go(-1)"
            class="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            소통방으로 돌아가기
          </button>
  
          <div class="flex gap-3" v-if="isAdmin">
            <button
              @click="editNotice"
              class="px-4 py-2 text-sm border rounded-full hover:bg-gray-50 transition-all"
            >
              수정
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-all"
            >
              삭제
            </button>
          </div>
        </div>
  
        <!-- 공지사항 내용 -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <!-- 공지사항 헤더 -->
          <div class="p-8 border-b border-gray-100">
            <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ notice.title }}</h1>
            <div class="flex items-center justify-between text-sm text-gray-500">
              <div class="flex items-center gap-4">
                <span>{{ formatDate(notice.createdAt) }}</span>
              </div>
            </div>
          </div>
  
          <!-- 공지사항 본문 -->
          <div class="p-8">
            <div class="prose max-w-none mb-8" v-html="notice.content"></div>
  
            <!-- 이미지 그리드 -->
            <div v-if="images.length > 0" class="grid grid-cols-2 gap-4 mb-8">
                <div
                    v-for="image in images"
                    :key="image.id"
                    class="rounded-lg overflow-hidden aspect-square cursor-pointer"
                    @click="openImagePreview(image)"
                >
                    <img 
                    :src="image.url"
                    :alt="image.fileName"
                    class="w-full h-full object-cover"
                    >
                </div>
            </div>

            <!-- 이미지 프리뷰 모달 -->
            <div 
            v-if="selectedImage"
            class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            @click="selectedImage = null"
            >
                <div class="relative max-w-4xl max-h-[90vh] mx-4">
                    <img 
                    :src="selectedImage.url"
                    :alt="selectedImage.fileName"
                    class="max-w-full max-h-[90vh] object-contain"
                    >
                    <button 
                    class="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
                    @click.stop="selectedImage = null"
                    >
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    </button>
                </div>
            </div>
          </div>
        </div>
  
        <!-- 댓글 섹션 -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="p-8">
            <h2 class="text-lg font-bold text-gray-900 mb-6">
              댓글 {{ comments.length }}
            </h2>
  
            <!-- 댓글 작성 -->
            <div class="mb-8">
              <div class="flex gap-4">
                <input
                  v-model="newComment"
                  type="text"
                  placeholder="댓글을 입력하세요"
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                <button
                  @click="submitComment"
                  :disabled="!newComment.trim()"
                  class="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  댓글 등록
                </button>
              </div>
            </div>
  
            <!-- 댓글 목록 -->
            <div class="space-y-6">
              <div
                v-for="comment in comments"
                :key="comment.id"
                class="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
              >
                <!-- 댓글 보기 모드 -->
                <div v-if="!comment.isEditing">
                  <div class="flex justify-between items-start mb-2">
                    <div>
                      <span class="font-medium text-gray-900">{{ comment.author }}</span>
                      <span class="text-sm text-gray-500 ml-2">{{ formatDate(comment.createdAt) }}</span>
                    </div>
                    
                    <div class="flex gap-2">
                        <!-- 작성자만 수정 가능 -->
                        <button
                            v-if="canEditComment(comment)"
                            @click="startEdit(comment)"
                            class="text-sm text-gray-500 hover:text-gray-700"
                        >
                            수정
                        </button>
                        <!-- 작성자와 관리자 모두 삭제 가능 -->
                        <button
                            v-if="canManageComment(comment)"
                            @click="deleteComment(comment.id)"
                            class="text-sm text-red-500 hover:text-red-700"
                        >
                            삭제
                        </button>
                    </div>
                  </div>
  
                  <p class="text-gray-700">{{ comment.content }}</p>
                </div>
  
                <!-- 댓글 수정 모드 -->
                <div v-else class="space-y-4">
                  <input
                    v-model="comment.editContent"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                  <div class="flex justify-end gap-2">
                    <button
                      @click="cancelEdit(comment)"
                      class="px-4 py-1 text-sm border rounded-full hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      @click="updateComment(comment)"
                      class="px-4 py-1 text-sm bg-black text-white rounded-full hover:bg-gray-800"
                    >
                      수정하기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="totalPages > 1" class="mt-6 flex justify-center gap-2">
                <button 
                    v-for="page in totalPages" 
                    :key="page"
                    class="px-3 py-1 rounded-md"
                    :class="page === currentPage ? 'bg-black text-[#dcff1f]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                    @click="fetchComments(page)"
                >
                    {{ page }}
                </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useGroupStore } from '@/stores/group'
  import { useUserStore } from '@/stores/user'
  import { storeToRefs } from 'pinia'
  
  const route = useRoute()
  const router = useRouter()
  const groupStore = useGroupStore()
  const userStore = useUserStore()
  
  // 상태 관리
  const notice = ref({})
  const comments = ref([])
  const newComment = ref('')
  const currentPage = ref(1)
  const totalPages = ref(0)
  const groupInfo = ref(null)
  
  const gnoticeId = computed(() => route.params.gnoticeId)
  const isAdmin = computed(() => userStore.user?.id === groupInfo.value?.adminId)

  const images = ref([])
  const selectedImage = ref(null)
  
  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const fetchGroupInfo = async () => {
  try {
    const response = await groupStore.getGroupDetail(notice.value.groupId)
    groupInfo.value = response
  } catch (error) {
    console.error('그룹 정보 로드 실패:', error)
  }
}
  
  // 공지사항 조회
  const fetchNotice = async () => {
  try {
    const response = await groupStore.getGroupNoticeDetail(gnoticeId.value)
    notice.value = response
    // 공지사항 정보를 받아온 후 그룹 정보도 조회
    await fetchGroupInfo()
  } catch (error) {
    console.error('공지사항 로드 실패:', error)
  }
}
  
// 댓글 조회 부분을 수정
const fetchComments = async (page = 1) => {
  try {
    const response = await groupStore.getGroupNoticeComments({
      gnoticeId: gnoticeId.value,
      pageNum: page,
      pageSize: 5  // 한 페이지당 5개 댓글
    })
    
    // 각 댓글에 대해 사용자 정보를 가져와서 추가
    comments.value = await Promise.all(
      response.list.map(async (comment) => {
        try {
          const userInfo = await userStore.getUserProfile(comment.userId)
          return {
            ...comment,
            isEditing: false,
            editContent: comment.content,
            author: userInfo.username
          }
        } catch (error) {
          console.error('사용자 정보 로드 실패:', error)
          return {
            ...comment,
            isEditing: false,
            editContent: comment.content,
            author: '알 수 없음'
          }
        }
      })
    )
    
    totalPages.value = response.pages
    currentPage.value = page
  } catch (error) {
    console.error('댓글 로드 실패:', error)
  }
}
  
const canManageComment = (comment) => {
  if (isAdmin.value) return true  // 관리자는 모든 댓글 관리 가능
  return userStore.user?.id === comment.userId  // 작성자는 자신의 댓글만 관리 가능
}

const canEditComment = (comment) => {
  return userStore.user?.id === comment.userId
}
  
  // 댓글 작성
  const submitComment = async () => {
    if (!newComment.value.trim()) return
  
    try {
      await groupStore.createComment({
        gnoticeId: gnoticeId.value,
        userId: userStore.user.id,
        content: newComment.value
      })
      newComment.value = ''
      await fetchComments(currentPage.value)
    } catch (error) {
      console.error('댓글 작성 실패:', error)
      alert('댓글 작성에 실패했습니다. 다시 시도해주세요.')
    }
  }
  
  // 댓글 수정 시작
  const startEdit = (comment) => {
    comment.isEditing = true
    comment.editContent = comment.content
  }
  
  // 댓글 수정 취소
  const cancelEdit = (comment) => {
    comment.isEditing = false
    comment.editContent = comment.content
  }
  
  // 댓글 수정 완료
  const updateComment = async (comment) => {
    try {
      await groupStore.updateComment({
        id: comment.id,
        content: comment.editContent
      })
      comment.isEditing = false
      comment.content = comment.editContent
    } catch (error) {
      console.error('댓글 수정 실패:', error)
      alert('댓글 수정에 실패했습니다. 다시 시도해주세요.')
    }
  }
  
  // 댓글 삭제
  const deleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
  
    try {
      await groupStore.deleteComment(commentId)
      await fetchComments(currentPage.value)
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
      alert('댓글 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }
  
  // 공지사항 수정
  const editNotice = () => {
    router.push(`/group-notice-edit/${gnoticeId.value}`)
  }
  
  // 공지사항 삭제
  const confirmDelete = async () => {
    if (!window.confirm('공지사항을 삭제하시겠습니까?')) return
  
    try {
      await groupStore.deleteGroupNotice(gnoticeId.value)
      router.go(-1)
    } catch (error) {
      console.error('공지사항 삭제 실패:', error)
      alert('공지사항 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }

// 이미지 URL 가져오기
const fetchImages = async () => {
try {
    const imageList = await groupStore.getGnoticeImages(gnoticeId.value)
    images.value = await Promise.all(
    imageList.map(async (image) => {
        const url = await groupStore.getGnoticeImageUrl(image.id)
        return { ...image, url }
    })
    )
} catch (error) {
    console.error('이미지 로드 실패:', error)
}
}

// 이미지 프리뷰 열기
const openImagePreview = (image) => {
selectedImage.value = image
}
  
  onMounted(async () => {
    await Promise.all([
      fetchNotice(),
      fetchComments(),
      fetchImages()
    ])
  })
  </script>