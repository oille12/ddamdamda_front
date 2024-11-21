<template>
  <div class="max-w-4xl mx-auto px-6 py-8">
    <div class="mb-8 pt-20">
      <h1 class="text-2xl font-bold text-gray-900">게시글 수정</h1>
      <p>게시글 내용을 수정할 수 있습니다.</p>
    </div>

    <div class="bg-white rounded-2xl shadow-sm p-8 mb-20">
      <!-- 카테고리 -->
      <div class="mb-6">
        <span class="block mb-2">카테고리</span>
        <div class="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700">
          {{ board?.category }}
        </div>
      </div>

      <!-- 제목 -->
      <div class="mb-6">
        <span class="block mb-2">제목</span>
        <input
          v-model="title"
          type="text"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          placeholder="제목을 입력하세요"
        />
      </div>

      <!-- 내용 -->
      <div class="mb-6">
        <span class="block mb-2">내용</span>
        <textarea
          v-model="content"
          rows="10"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>

      <!-- 첨부 파일 영역 -->
      <div class="mb-8">
        <span class="block mb-2">첨부 파일</span>
        
        <!-- 기존 첨부 파일 -->
        <div v-if="existingFiles.length > 0" class="mb-4">
          <h4 class="text-sm text-gray-500 mb-2">기존 첨부 파일</h4>
          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="file in existingFiles" 
              :key="file.id" 
              class="file-preview relative p-3 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span class="text-sm text-gray-600 truncate">{{ file.fileName }}</span>
              </div>
              <button 
                @click="removeExistingFile(file.id)" 
                class="absolute top-3 right-3"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- 파일 드래그 & 드롭 영역 -->
        <div 
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors"
          @click="$refs.fileInput.click()"
          @dragover.prevent
          @drop.prevent="handleFileDrop"
        >
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <p class="mt-1 text-sm text-gray-500">파일을 드래그하여 업로드하거나 클릭하여 선택</p>
          </div>
        </div>

        <!-- 새로 추가된 파일 -->
        <div v-if="newFiles.length > 0" class="mt-4">
          <h4 class="text-sm text-gray-500 mb-2">새로 추가된 파일</h4>
          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="(file, index) in newFiles" 
              :key="index"
              class="file-preview relative p-3 border border-gray-200 rounded-lg"
            >
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span class="text-sm text-gray-600 truncate">{{ file.name }}</span>
              </div>
              <button 
                @click="removeNewFile(index)" 
                class="absolute top-3 right-3"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <input
          type="file"
          ref="fileInput"
          multiple
          accept="image/*"
          @change="handleFileChange"
          class="hidden"
        />
      </div>

      <!-- 버튼 영역 -->
      <div class="flex justify-end space-x-4 p-6">
        <button 
          @click="cancel" 
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          취소
        </button>
        <button 
          @click="submit" 
          class="px-4 py-2 bg-black text-[#dcff1f] rounded-full hover:bg-gray-800"
        >
          수정하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBoardStore } from '@/stores/board'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const boardStore = useBoardStore()
const { board } = storeToRefs(boardStore)

const category = ref('')
const title = ref('')
const content = ref('')
const existingFiles = ref([])
const newFiles = ref([])
const boardId = parseInt(route.params.id)

const loadBoard = async () => {
  await boardStore.getBoard(boardId)
  category.value = board.value?.category
  title.value = board.value?.title
  content.value = board.value?.content
  await loadExistingImages()
}

const loadExistingImages = async () => {
  await boardStore.loadBoardImages(boardId)
  existingFiles.value = boardStore.boardImages
}

const handleFileDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  newFiles.value = [...newFiles.value, ...files.filter(file => file.type.startsWith('image/'))]
}

const handleFileChange = (event) => {
 const files = Array.from(event.target.files)
 newFiles.value = [...newFiles.value, ...files]
}

const removeExistingFile = async (fileId) => {
  if (confirm('이미지를 삭제하시겠습니까?')) {
    try {
      await boardStore.deleteImage(fileId)
      existingFiles.value = existingFiles.value.filter(f => f.id !== fileId)
    } catch (error) {
      console.error('이미지 삭제 실패:', error)
      alert('이미지 삭제에 실패했습니다.')
    }
  }
}

const removeNewFile = (index) => {
 newFiles.value.splice(index, 1)
}

const submit = async () => {
 if (!title.value || !content.value) {
   alert('제목과 내용을 입력해주세요')
   return
 }

 try {
  const boardData = {
      id: boardId,
      title: title.value,
      content: content.value,
      newImages: newFiles.value
    }
    console.log('수정할 게시글 ID:', boardId)
    console.log('수정할 데이터:', boardData)
    await boardStore.updateBoard(boardData)
    router.push(`/board/${boardId}`)
 } catch (error) {
   console.error('게시글 수정 실패:', error)
   alert('게시글 수정에 실패했습니다.')
 }
}

const cancel = () => {
 router.push(`/board/${boardId}`)
}

onMounted(() => {
 loadBoard()
})
</script>