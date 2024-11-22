<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Banner Section (바깥 영역) -->
    <section class="shadow-sm mb-3">
      <div class="max-w-7xl mx-auto px-8 pt-16">
        <div class="py-12">
          <h1 class="text-4xl font-bold text-gray-900">그룹 메이트 만들기</h1>
          <br>
          <p>새로운 운동 그룹을 만들어 보세요!</p>
        </div>
      </div>
    </section>

    <!-- Form Section (작성폼 영역) -->
    <main class="pt-6 pb-20">
      <div class="max-w-3xl mx-auto px-6">
        <div class="bg-white rounded-2xl shadow-sm p-8">
          <form @submit.prevent="handleSubmit">
            <!-- Image Upload -->
            <div class="mb-8">
              <label class="block text-gray-900 font-semibold mb-2">그룹 이미지</label>
              <div 
                class="image-upload-wrapper border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all"
                @click="triggerFileInput"
                @dragover.prevent
                @drop.prevent="handleFileDrop"
              >
                <div v-if="!formData.imageFile" class="text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>이미지를 선택하세요</p>
                  <p class="text-sm text-gray-400">또는 여기로 드래그앤드롭 하세요</p>
                </div>
                <div v-else>
                  <div class="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-4">
                    <img 
                      :src="previewUrl" 
                      alt="Preview" 
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="flex items-center justify-between px-2">
                    <span class="text-sm text-gray-600">{{ formData.imageFile.name }}</span>
                    <button 
                      type="button"
                      class="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                      @click.stop="removeImage"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      삭제
                    </button>
                  </div>
                </div>
              </div>
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                accept="image/*"
                @change="handleFileChange"
              >
            </div>

            <!-- Group Name -->
            <div class="mb-6">
              <label class="block text-gray-900 font-semibold mb-2">그룹 이름</label>
              <input 
                v-model="formData.groupName"
                type="text"
                class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="그룹 이름을 입력하세요"
                required
              >
            </div>

            <!-- Description -->
            <div class="mb-6">
              <label class="block text-gray-900 font-semibold mb-2">그룹 소개</label>
              <textarea 
                v-model="formData.description"
                class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                rows="4"
                placeholder="그룹에 대한 소개를 입력하세요"
                required
              ></textarea>
            </div>

            <!-- Region and Exercise Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-gray-900 font-semibold mb-2">지역</label>
                <input 
                  v-model="formData.region"
                  type="text"
                  class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="활동 지역을 입력하세요"
                  required
                >
              </div>
              <div>
                <label class="block text-gray-900 font-semibold mb-2">운동 종목</label>
                <input 
                  v-model="formData.exerciseType"
                  type="text"
                  class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="운동 종목을 입력하세요"
                  required
                >
              </div>
            </div>

            <!-- Member Count -->
            <div class="mb-8">
              <label class="block text-gray-900 font-semibold mb-2">모집 인원</label>
              <input 
                v-model="formData.memberCount"
                type="number"
                min="2"
                class="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="최소 2명 이상만 입력이 가능합니다."
                required
              >
            </div>

            <!-- Buttons -->
            <div class="flex justify-end space-x-4 pt-4">
              <button 
                type="button"
                @click="handleCancel"
                class="px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button 
                type="submit"
                class="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                등록
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '@/stores/group'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const groupStore = useGroupStore()
const userStore = useUserStore()
const fileInput = ref(null)
const previewUrl = ref(null)

const formData = ref({
  groupName: '',
  description: '',
  region: '',
  exerciseType: '',
  memberCount: 2,
  imageFile: null
})

const createImagePreview = (file) => {
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else {
    previewUrl.value = null
  }
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.imageFile = file
    createImagePreview(file)
  }
}

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    formData.value.imageFile = file
    createImagePreview(file)
  }
}

const removeImage = () => {
  formData.value.imageFile = null
  previewUrl.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  if (!userStore.isAuthenticated) {
    alert('로그인이 필요합니다.')
    router.push('/login')
    return
  }

  if (!formData.value.imageFile) {
    alert('그룹 이미지를 선택해주세요.')
    return
  }

  try {
    const userId = userStore.user.id
    await groupStore.createGroup({
      ...formData.value,
      adminId: userId
    }, formData.value.imageFile)
    
    router.push('/group')
  } catch (error) {
    console.error('그룹 생성 실패:', error)
    alert('그룹 생성에 실패했습니다.')
  }
}

const handleCancel = () => {
  if (formData.value.groupName || formData.value.description || 
      formData.value.region || formData.value.exerciseType || 
      formData.value.imageFile || formData.value.memberCount !== 2) {
    const confirmed = window.confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')
    if (confirmed) {
      router.push('/group')
    }
  } else {
    router.push('/group')
  }
}
</script>

<style scoped>
.image-upload-wrapper {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-upload-wrapper:hover {
  background-color: rgba(0, 0, 0, 0.01);
}
</style>