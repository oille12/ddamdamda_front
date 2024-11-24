<template>
    <main class="pt-20 pb-20" role="main">
      <div class="max-w-4xl mx-auto px-6">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">공지글 수정</h1>
          <p class="text-gray-600">작성했던 공지글의 내용을 수정할 수 있습니다.</p>
        </div>
  
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <!-- 제목 입력 -->
          <div class="mb-6">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">제목</label>
            <input
              type="text"
              id="title"
              v-model="title"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="제목을 입력하세요"
            >
          </div>
  
          <!-- 내용 입력 -->
          <div class="mb-6">
            <label for="content" class="block text-sm font-medium text-gray-700 mb-2">내용</label>
            <textarea
              id="content"
              v-model="content"
              rows="6"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              placeholder="내용을 입력하세요"
            ></textarea>
          </div>
  
          <!-- 이미지 영역 -->
          <div class="mb-8">
            <label class="block text-sm font-medium text-gray-700 mb-2">이미지</label>
            
            <!-- 기존 이미지 -->
            <div v-if="existingImages.length > 0" class="mb-6">
              <h4 class="text-sm text-gray-500 mb-2">기존 이미지</h4>
              <div class="grid grid-cols-2 gap-4">
                <div 
                  v-for="image in existingImages" 
                  :key="image.id"
                  class="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img 
                    :src="image.url" 
                    :alt="image.fileName"
                    class="w-full h-full object-cover"
                  >
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all">
                    <button 
                      @click="removeExistingImage(image)"
                      class="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                    >
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- 새 이미지 업로드 영역 -->
            <div
              class="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors hover:cursor-pointer"
              @click="$refs.fileInput.click()"
              @dragover.prevent
              @drop.prevent="handleImageDrop"
              :class="{ 'pointer-events-none opacity-50': totalImagesCount >= 5 }"
            >
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                class="hidden"
                @change="handleImageSelect"
              >
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p class="mt-2">클릭하여 이미지 선택 또는 드래그앤드롭</p>
              <p class="text-sm text-gray-500">최대 5개까지 업로드 가능</p>
            </div>
  
            <!-- 새로 추가된 이미지 미리보기 -->
            <div v-if="newImagePreviews.length > 0" class="mt-4">
              <h4 class="text-sm text-gray-500 mb-2">새로 추가된 이미지</h4>
              <div class="grid grid-cols-2 gap-4">
                <div 
                  v-for="(preview, index) in newImagePreviews" 
                  :key="index"
                  class="relative aspect-square rounded-lg overflow-hidden"
                >
                  <img :src="preview" :alt="'preview'" class="w-full h-full object-cover">
                  <button 
                    @click="removeNewImage(index)"
                    class="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- 버튼 영역 -->
          <div class="flex justify-end space-x-4">
            <button
              @click="$router.go(-1)"
              class="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-all"
            >
              취소
            </button>
            <button
              @click="submitEdit"
              class="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all"
              :disabled="!isFormValid || submitting"
            >
              수정하기
            </button>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useGroupStore } from '@/stores/group'
  
  const route = useRoute()
  const router = useRouter()
  const groupStore = useGroupStore()
  
  // 상태 관리
  const title = ref('')
  const content = ref('')
  const existingImages = ref([])
  const newImageFiles = ref([])
  const newImagePreviews = ref([])
  const deletedImageIds = ref([])
  const submitting = ref(false)
  
  // 총 이미지 개수 계산
  const totalImagesCount = computed(() => {
    return existingImages.value.length + newImageFiles.value.length
  })
  
  // 폼 유효성 검사
  const isFormValid = computed(() => {
    return title.value.trim() && content.value.trim()
  })
  
  // 기존 공지사항 데이터 로드
  const loadNoticeData = async () => {
    try {
      const notice = await groupStore.getGroupNoticeDetail(route.params.gnoticeId)
      title.value = notice.title
      content.value = notice.content
  
      // 기존 이미지 로드
      if (notice.images && notice.images.length > 0) {
        const loadedImages = await Promise.all(
          notice.images.map(async (image) => {
            const url = await groupStore.getGnoticeImageUrl(image.id)
            return { ...image, url }
          })
        )
        existingImages.value = loadedImages
      }
    } catch (error) {
      console.error('공지사항 데이터 로드 실패:', error)
      alert('공지사항을 불러오는데 실패했습니다.')
      router.go(-1)
    }
  }
  
  // 새 이미지 선택 처리
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files)
    addNewImages(files)
  }
  
  // 이미지 드롭 처리
  const handleImageDrop = (event) => {
    const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'))
    addNewImages(files)
  }
  
  // 새 이미지 추가
  const addNewImages = (files) => {
    if (totalImagesCount.value + files.length > 5) {
      alert('이미지는 최대 5개까지만 업로드 가능합니다.')
      return
    }
  
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        newImageFiles.value.push(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          newImagePreviews.value.push(e.target.result)
        }
        reader.readAsDataURL(file)
      }
    })
  }
  
  // 기존 이미지 제거
  const removeExistingImage = (image) => {
    const index = existingImages.value.findIndex(img => img.id === image.id)
    if (index !== -1) {
      deletedImageIds.value.push(image.id)
      existingImages.value.splice(index, 1)
    }
  }
  
  // 새 이미지 제거
  const removeNewImage = (index) => {
    newImageFiles.value.splice(index, 1)
    newImagePreviews.value.splice(index, 1)
  }
  
  // 수정사항 제출
  const submitEdit = async () => {
    if (!isFormValid.value) return
  
    try {
      submitting.value = true
  
      const noticeData = {
        gnoticeId: parseInt(route.params.gnoticeId),
        title: title.value,
        content: content.value
      }
  
      // FormData 생성
      const formData = new FormData()
      formData.append('groupNotice', new Blob([JSON.stringify(noticeData)], { type: 'application/json' }))
      
      // 새로운 이미지 파일 추가
      newImageFiles.value.forEach(file => {
        formData.append('images', file)
      })
  
      // 삭제할 이미지 ID 추가
      if (deletedImageIds.value.length > 0) {
        formData.append('deleteImageIds', new Blob([JSON.stringify(deletedImageIds.value)], { type: 'application/json' }))
      }
  
      // API 호출
      await groupStore.updateGroupNotice(formData)
      router.go(-1)
    } catch (error) {
      console.error('공지사항 수정 실패:', error)
      alert('공지사항 수정에 실패했습니다. 다시 시도해주세요.')
    } finally {
      submitting.value = false
    }
  }
  
  // 초기 데이터 로드
  onMounted(() => {
    loadNoticeData()
  })
  </script>