<template>
    <div class="pt-20 pb-20" role="main">
      <div class="max-w-2xl mx-auto px-6">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">프로필 설정</h1>
          <p>프로필 정보를 수정할 수 있습니다.</p>
        </div>
  
        <div v-if="userProfile" class="bg-white p-8 rounded-xl shadow-lg">
          <!-- 프로필 이미지 업로드 -->
          <div class="mb-8">
            <div class="profile-image-upload">
              <div 
                class="w-32 h-32 mx-auto relative"
                @click="triggerFileInput"
              >
                <div class="w-full h-full rounded-full overflow-hidden bg-gray-200 cursor-pointer">
                  <img 
                    :src="currentImageUrl" 
                    class="w-full h-full object-cover"
                    alt="Profile"
                  />
                </div>
                <div class="upload-overlay absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden" 
                accept="image/*"
                @change="handleImageChange"
              />
            </div>
          </div>
  
          <!-- 프로필 폼 -->
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">아이디</label>
              <input
                v-model="userProfile.email"
                type="text"
                disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
              <input
                v-model="userProfile.username"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
              <input
                v-model="password"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
              />
              <p class="text-sm text-gray-500 mt-1">비밀번호는 6-14자로 입력해주세요</p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
              <input
                v-model="passwordConfirm"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
              />
              <p v-if="!passwordMatch && passwordConfirm" class="text-sm text-red-500 mt-1">
                비밀번호가 일치하지 않습니다
              </p>
            </div>
  
            <div class="flex justify-between pt-4">
              <button 
                @click="confirmDelete" 
                class="text-red-500 hover:text-red-600"
              >
                회원탈퇴
              </button>
              <button 
                @click="updateProfile" 
                class="px-4 py-2 bg-black text-[#dcff1f] rounded-full hover:bg-gray-800"
              >
                수정하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { useUserStore } from '@/stores/user'
  import { storeToRefs } from 'pinia'
  
  const userStore = useUserStore()
  const { userProfile, profileImageUrl } = storeToRefs(userStore)

  const fileInput = ref(null)
  const selectedFile = ref(null)
  const imageUrl = ref(null);

  const password = ref('')
  const passwordConfirm = ref('')
  
  const passwordMatch = computed(() => {
    if (!passwordConfirm.value) return true
    return password.value === passwordConfirm.value
  })
  
  const currentImageUrl = computed(() => {
    return profileImageUrl.value || imageUrl.value
  })

  const triggerFileInput = () => {
    fileInput.value.click()
  }
  
  const handleImageChange = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
      // 이미지 미리보기
      const reader = new FileReader()
      reader.onload = (e) => {
        imageUrl.value = e.target.result
      }
      reader.readAsDataURL(file)

      // 선택된 파일 저장
      selectedFile.value = file

      // // 이미지 업로드
      // const response = await userStore.uploadProfileImage(file)
      // uploadedImageId.value = response.id // 업로드된 이미지 ID 저장
      } catch(error) {
        console.error('이미지 처리 실패:', error)
        alert('이미지 처리에 실패했습니다.')
      }
    } 
  }

  const loadProfileImage = async () => {
    try {
      if (userProfile.value?.profileImageId) {
        console.log('프로필 이미지 ID 담겼니?',userProfile.value.profileImageId)
        await userStore.getProfileImage(userProfile.value.profileImageId);
      }
    } catch(error) {
      console.error('이미지 로드 실패:',error)
    }  
  }
  
  const updateProfile = async () => {
    if (password.value && !passwordMatch.value) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
  
    try {
      await userStore.updateProfile({
        email: userProfile.value.email,
        username: userProfile.value.username,
        password: password.value || null,
        imageFile: selectedFile.value || null
      })

      password.value = ''
      passwordConfirm.value = ''
      selectedFile.value = null

      alert('프로필이 수정되었습니다.')
    } catch (error) {
      console.error('프로필 수정 실패:', error)
      alert('프로필 수정에 실패했습니다.')
    }
  }
  
  const confirmDelete = () => {
    if (confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      // TODO: userStore에 deleteAccount 메서드 구현 필요
      userStore.deleteAccount()
    }
  }
  
  onMounted(async () => {
    // TODO: userStore에서 현재 사용자 정보 가져오기
    // const currentUser = await userStore.getCurrentUser()
    // if (currentUser) {
    //   userInfo.value = {
    //     email: currentUser.email,
    //     nickname: currentUser.nickname,
    //     profileImage: currentUser.profileImage
    //   }
    //   if (currentUser.profileImage) {
    //     previewImage.value = currentUser.profileImage
    //   }
    // }

    try {
      await userStore.getCurrentUserProfile()
      await loadProfileImage()
    } catch (error) {
      console.error('프로필 로드 실패:', error)
    }
  })

  onBeforeUnmount(() => {
    if(profileImageUrl.value) {
      URL.revokeObjectURL(profileImageUrl.value);
    }
    if(imageUrl.value && imageUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl.value)
    }
  })
  </script>
  
  <style scoped>
  .upload-overlay {
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
  }
  </style>