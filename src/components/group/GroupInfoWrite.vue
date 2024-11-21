<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Banner Section -->
    <section class="shadow-sm mb-3">
      <div class="max-w-7xl mx-auto px-8 pt-16">
        <div class="py-12">
          <h1 class="text-4xl font-bold text-gray-900">그룹 메이트 만들기</h1>
          <p>새로운 운동 그룹을 만들어 보세요!</p>
        </div>
      </div>
    </section>

    <!-- Main Form -->
    <main class="pt-6 pb-20">
      <div class="max-w-3xl mx-auto px-6">
        <form @submit.prevent="handleSubmit">
          <!-- Image Upload -->
          <div class="mb-8">
            <label class="block text-gray-700 mb-2">그룹 이미지</label>
            <div 
              class="image-upload-wrapper border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400"
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
              <div v-else class="text-gray-700">
                <p class="mb-2">{{ formData.imageFile.name }}</p>
                <button 
                  type="button"
                  class="text-red-500 hover:text-red-600"
                  @click.stop="removeImage"
                >
                  삭제
                </button>
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
            <label class="block text-gray-700 mb-2">그룹 이름</label>
            <input 
              v-model="formData.groupName"
              type="text"
              class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
          </div>

          <!-- Description -->
          <div class="mb-6">
            <label class="block text-gray-700 mb-2">그룹 소개</label>
            <textarea 
              v-model="formData.description"
              class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
              rows="4"
              required
            ></textarea>
          </div>

          <!-- Region and Exercise Type -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-gray-700 mb-2">지역</label>
              <input 
                v-model="formData.region"
                type="text"
                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
            </div>
            <div>
              <label class="block text-gray-700 mb-2">운동 종목</label>
              <input 
                v-model="formData.exerciseType"
                type="text"
                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
                required
              >
            </div>
          </div>

          <!-- Member Count -->
          <div class="mb-6">
            <label class="block text-gray-700 mb-2">모집 인원</label>
            <input 
              v-model="formData.memberCount"
              type="number"
              min="2"
              class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
              required
            >
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-4 pt-4">
            <router-link 
              to="/group"
              class="px-6 py-3 text-gray-600 hover:text-gray-900"
            >
              취소
            </router-link>
            <button 
              type="submit"
              class="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              등록
            </button>
          </div>
        </form>
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

const formData = ref({
  groupName: '',
  description: '',
  region: '',
  exerciseType: '',
  memberCount: 2,
  imageFile: null
})

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.imageFile = file
  }
}

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) {
    formData.value.imageFile = file
  }
}

const removeImage = () => {
  formData.value.imageFile = null
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
</script>

<style scoped>
.image-upload-wrapper {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>