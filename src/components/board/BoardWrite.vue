<template>
  <div class="max-w-3xl mx-auto px-6">
   <!-- 페이지 타이틀 섹션 -->
    <div class="max-w-7xl mx-auto px-8 pt-16">
      <div class="py-10">
        <h1 class="text-4xl font-bold text-gray-900">글쓰기</h1>
        <p class="mt-2 text-gray-600">새로운 게시글을 작성하세요</p>
      </div>
    </div>
 
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
      <div class="p-6 mb-6">
        <select v-model="form.category" class="w-full p-3 border rounded-lg mb-6">
          <option value="" disabled>카테고리 선택</option>
          <option value="자유">자유</option>
          <option value="운동인증">운동인증</option>
        </select>
 
        <input
          v-model="form.title"
          type="text"
          class="w-full p-3 border rounded-lg mb-6"
          placeholder="제목을 입력하세요"
        />
 
        <textarea
          v-model="form.content"
          rows="10"
          class="w-full p-3 border rounded-lg mb-6"
          placeholder="내용을 입력하세요"
        ></textarea>
 
        <div class="mb-6">
          <input
            type="file"
            ref="fileInput"
            multiple
            accept="image/*"
            @change="handleFileChange"
            class="hidden"
          />
          <button @click="$refs.fileInput.click()" class="px-4 py-2 border rounded-lg">
            파일 업로드
          </button>
          
          <!-- 이미지 미리보기 추가 -->
          <div class="grid grid-cols-3 gap-4 mt-4">
            <div v-for="(preview, index) in previews" :key="index" 
                 class="relative group">
              <img :src="preview" class="w-full h-32 object-cover rounded-lg">
              <button @click="removeFile(index)" 
                      class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 
                             flex items-center justify-center opacity-0 group-hover:opacity-100">
                ×
              </button>
            </div>
          </div>
 
          <!-- 파일 이름 목록 -->
          <div class="flex flex-wrap mt-4">
            <div v-for="(file, index) in form.images" :key="index" 
                 class="flex items-center mb-2 mr-4">
              <span class="text-sm text-gray-700">{{ file.name }}</span>
            </div>
          </div>
        </div>
 
        <div class="flex justify-between">
          <button @click="cancel" class="px-4 py-2 text-gray-600">
            취소
          </button>
          <button @click="submit" class="px-4 py-2 bg-black text-[#dcff1f] rounded-full">
            등록
          </button>
        </div>
      </div>
    </div>
  </div>
 </template>
 
 <script setup>
 import { ref, reactive } from 'vue'
 import { useRouter } from 'vue-router'
 import { useBoardStore } from '@/stores/board'
 import { useUserStore } from '@/stores/user'
 
 const router = useRouter()
 const boardStore = useBoardStore()
 
 const form = reactive({
   category: '',
   title: '',
   content: '',
   images: []
 })
 
 const previews = ref([])
 const fileInput = ref(null)
 
 const handleFileChange = (event) => {
   const newFiles = Array.from(event.target.files)
   form.images = [...form.images, ...newFiles]
   
   // 이미지 미리보기 생성
   newFiles.forEach(file => {
     const reader = new FileReader()
     reader.onload = (e) => {
       previews.value.push(e.target.result)
     }
     reader.readAsDataURL(file)
   })
 }
 
 const removeFile = (index) => {
   form.images.splice(index, 1)
   previews.value.splice(index, 1)
 }
 
 const submit = async () => {
  if (!form.category || !form.title || !form.content) {
    alert('모든 필드를 입력해주세요')
    return
  }

  try {
    const formData = {
      category: form.category,
      title: form.title,
      content: form.content,
      images: form.images
    }
    
    console.log('전송 데이터:', formData)
    await boardStore.createBoard(formData)
    router.push('/board')
  } catch(error) {
    console.error('Error creating board:', error)
    alert('게시글 등록에 실패했습니다.')
  }
}
 
 const cancel = () => {
   router.push('/board')
 }
 </script>
 
 <style scoped>
 .group:hover img {
   opacity: 0.7;
 }
 </style>