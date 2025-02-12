<template>
  <!-- 페이지 타이틀 섹션 -->
  <div class="shadow-sm">
    <div class="max-w-7xl mx-auto px-8 pt-20">
      <div class="py-12">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold text-gray-900">커뮤니티</h1>
            <p class="mt-2 text-gray-600">함께 운동하는 즐거움, 자유롭게 소통하세요</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-6 pt-8 pb-20">
    <!-- 게시글 컨테이너 -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <!-- 게시글 헤더 -->
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 rounded-full text-xs font-medium" 
                style="background-color: #dcff1f">
            {{ board?.category }}
          </span>
          <span class="text-sm text-gray-500">{{ board?.createdAt }}</span>
        </div>

        <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ board?.title }}</h2>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="text-gray-700">{{ boardStore.username }}</span>
            <span class="text-sm text-gray-500">조회 {{ board?.viewCount }}</span>
          </div>

          <div class="flex gap-2" v-if="isAuthor">
            <button @click="editBoard" 
              class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm">
              수정
            </button>
            <button @click="deleteBoard" 
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">
              삭제
            </button>
          </div>
        </div>
      </div>

      <!-- 게시글 내용 -->
      <div class="p-6">
        <div class="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {{ board?.content }}
        </div>

        <!-- 이미지 갤러리 -->
        <div v-if="boardStore.boardImages.length > 0" 
          class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div v-for="image in boardStore.boardImages" 
              :key="image.id" 
              class="relative aspect-square rounded-lg overflow-hidden shadow">
            <!-- 로딩 중 표시 -->
            <div v-if="!image.imageUrl" 
                class="w-full h-full flex items-center justify-center bg-gray-100">
              <span class="text-gray-500">Loading...</span>
            </div>
            <!-- 이미지 -->
            <img v-else
              :src="image.imageUrl"
              :alt="image.fileName"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <!-- 좋아요 & 목록 버튼 섹션 -->
      <div class="p-6 border-t border-gray-100">
        <div class="flex items-center justify-between">
          <button 
            @click="toggleLike" 
            class="group flex items-center hover:bg-pink-50 gap-2 px-4 py-2 rounded-full transition-all duration-300"
            :class="{
              // 'hover:bg-pink-50': !hasLiked,
              // 'bg-pink-50': hasLiked
            }"
          >
            <!-- 하트 아이콘 -->
            <svg 
              class="w-6 h-6 transition-all duration-300" 
              :class="{
                'text-gray-400 group-hover:text-pink-500 transform group-hover:scale-110': !hasLiked,
                'text-pink-500 transform scale-110': hasLiked
              }"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                :class="{ 'fill-current': hasLiked }"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <!-- 좋아요 카운트 -->
            <span 
              class="font-medium transition-all duration-300"
              :class="{
                'text-gray-600 group-hover:text-pink-500': !hasLiked,
                'text-pink-500': hasLiked
              }"
            >
              {{ board?.likesCount }}
            </span>
          </button>

          <router-link 
            to="/board" 
            class="px-12 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-300 text-sm"
          >
            목록으로
          </router-link>
        </div>
      </div>
    </div>

    <!-- 댓글 섹션 -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <!-- 댓글 작성 폼 -->
      <div class="p-6 border-b border-gray-100">
        <div class="flex gap-4 items-center">
          <textarea
            v-model="commentContent"
            rows="3"
            class="flex-1 p-3 border rounded-lg"
            placeholder="댓글을 입력하세요"
          ></textarea>
          <button 
            @click="addComment" 
            class="px-8 py-3 bg-black text-[#dcff1f] rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap"
          >
            등록
          </button>
        </div>
      </div>

      <!-- 댓글 목록 -->
      <div class="divide-y divide-gray-100">
        <div v-if="boardStore.comments.length > 0">
          <div v-for="comment in comments" 
               :key="comment.id" 
               class="p-6">
            <!-- 수정 모드가 아닐 때 -->
            <div v-if="!isEditing(comment.id)" class="flex justify-between">
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <span class="font-medium text-sm">{{ comment.username }}</span> 
                  <span class="text-sm text-gray-500"> &nbsp;|  &nbsp; {{ comment.createdAt }}</span>
                </div>
                <div>{{ comment.content }}</div>
              </div>
              <!-- 내 댓글일 경우에만 수정/삭제 버튼 표시 -->
              <div v-if="comment.userId === userStore.user?.id" class="flex gap-2">
                <button @click="startEdit(comment)" 
                        class="text-sm text-gray-600 hover:text-gray-500">
                  수정
                </button>
                <button @click="deleteComment(comment.id)" 
                        class="text-sm text-gray-500 hover:text-red-500">
                  삭제
                </button>
              </div>
            </div>

            <!-- 수정 모드일 때 -->
            <div v-else class="space-y-3">
              <textarea
                v-model="editingComments.get(comment.id).editContent"
                rows="3"
                class="w-full p-2 border rounded-lg"
              ></textarea>
              <div class="flex justify-end gap-2">
                <button @click="editingComments.delete(comment.id)"
                        class="text-sm text-gray-600 hover:text-gray-900">
                  취소
                </button>
                <button @click="updateComment(comment)" 
                        class="text-sm text-gray-600 hover:text-gray-900">
                  등록
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-6 text-center text-gray-500">
          작성된 댓글이 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBoardStore } from '@/stores/board'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const userStore = useUserStore()

const { board, comments } = storeToRefs(boardStore)
const { user } = storeToRefs(userStore) 

const boardId = computed(() => parseInt(route.params.id))
const commentContent = ref('')
const hasLiked = ref(false)
const editingComments = ref(new Map())

const isAuthor = computed(() => {
  return board.value?.userId === user.value?.id
})

const loadBoard = async () => {
  await boardStore.getBoard(boardId.value)
}

const editBoard = () => {
  router.push(`/board/${boardId.value}/edit`)
}

const deleteBoard = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    try {
      await boardStore.deleteBoard(boardId.value)
      router.push('/board')
    } catch (error) {
      console.error('Error deleting board:', error)
      alert('게시글 삭제에 실패했습니다.')
    }
  }
}

const toggleLike = async () => {
  try {
    if (hasLiked.value) {
      await boardStore.unlikeBoard(boardId.value)
    } else {
      await boardStore.likeBoard(boardId.value)
    }
    await checkLikeStatus()
    await loadBoard()
  } catch (error) {
    console.error('좋아요 토글 실패:', error)
  }
}

const checkLikeStatus = async () => {
  try {
    const response = await boardStore.checkLikeStatus(boardId.value)
    hasLiked.value = response
  } catch (error) {
    console.error('좋아요 상태 체크 에러:', error)
    hasLiked.value = false
  }
}

const loadComments = async () => {
  try {
    await boardStore.getComments({
      boardId: boardId.value,
      pageNum: 1,
      pageSize: 20
    })
  } catch (error) {
    console.error('Error loading comments:', error)
  }
}

const addComment = async () => {
  if (!commentContent.value.trim()) return
  
  try {
    const commentData = {
      boardId: boardId.value,
      content: commentContent.value.trim()
    }
    
    await boardStore.addComment(commentData)
    commentContent.value = ''
    await loadComments()
  } catch (error) {
    console.error('Error adding comment:', error)
    alert('댓글 작성에 실패했습니다.')
  }
}

const startEdit = (comment) => {
  editingComments.value.set(comment.id, {
    isEditing: true,
    editContent: comment.content
  })
}

const isEditing = (commentId) => {
  return editingComments.value.has(commentId)
}

const updateComment = async (comment) => {
  try {
    const editingComment = editingComments.value.get(comment.id)
    if (!editingComment) return

    await boardStore.updateComment({
      id: comment.id,
      boardId: parseInt(route.params.id),
      content: editingComment.editContent
    })

    editingComments.value.delete(comment.id)
    await loadComments()
  } catch (error) {
    console.error('Error updating comment:', error)
    alert('댓글 수정에 실패했습니다.')
  }
}

const deleteComment = async (commentId) => {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    try {
      await boardStore.deleteComment(commentId)
      await loadComments()
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('댓글 삭제에 실패했습니다.')
    }
  }
}

watch(() => route.params.id, async (newId) => {
  if (newId) {
    boardStore.clearComments()
    await loadBoard()
    await boardStore.loadBoardImages(newId)
    await loadComments()
    await checkLikeStatus()
  }
}, { immediate: true })

onUnmounted(() => {
  boardStore.boardImages.forEach(image => {
    if (image.imageUrl) {
      URL.revokeObjectURL(image.imageUrl)
    }
  })
})

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>