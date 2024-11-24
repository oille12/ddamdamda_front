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
                class="w-32 h-32 mx-auto relative rounded-full"
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
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-gray-500"
                :class="{ 'border-gray-300': !hasUsernameError, 'border-red-500': hasUsernameError }"
                @blur="checkUsernameValidity"
                @input="isUsernameTouched = true"
              />
              <p v-if="hasUsernameError" class="text-sm text-red-500 mt-1">
                {{ hasUsernameError }}
              </p>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
              <input
                v-model="password"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                :class="{ 'border-gray-300': !hasPasswordError, 'border-red-500': hasPasswordError }"
                @blur="checkPasswordValidity"
                @input="isPasswordTouched = true"
              />
              <p v-if="hasPasswordError"  class="text-sm text-gray-500 mt-1">비밀번호는 6-14자로 입력해주세요</p>
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
                class="px-6 py-2 text-red-600 hover:text-red-700 rounded-full border border-red-600 hover:border-red-700"
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

            <!-- 비밀번호 확인 모달을 버튼 밖으로 이동 -->
            <div v-if="showPasswordConfirmDialog" 
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div class="bg-white rounded-lg p-6 w-96 shadow-xl">
                <div class="mb-4">
                  <h3 class="text-lg font-medium text-gray-900">회원 탈퇴</h3>
                  <p class="text-sm text-gray-500 mt-1">회원 탈퇴를 위해 현재 비밀번호를 입력해주세요.</p>
                </div>
                
                <div class="mt-4">
                  <input
                    v-model="currentPassword"
                    type="password"
                    placeholder="현재 비밀번호"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                    @keyup.enter="handleDeleteAccount"
                  />
                </div>
                
                <div class="flex justify-end space-x-3 mt-6">
                  <button 
                    @click="closePasswordDialog"
                    class="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    취소
                  </button>
                  <button 
                    @click="handleDeleteAccount"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    확인
                  </button>
                </div>
              </div>
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
  import router from '@/router';
    
  const userStore = useUserStore()
  const { userProfile, profileImageUrl } = storeToRefs(userStore)

  const fileInput = ref(null)
  const selectedFile = ref(null)
  const imageUrl = ref(null);

  const isUsernameTouched = ref(false)
  const originalUsername = ref('') 
  const hasUsernameError = ref('')

  const password = ref('')
  const passwordConfirm = ref('')
  const isPasswordTouched = ref(false);

  const showPasswordConfirmDialog = ref(false)
const currentPassword = ref('')
  
  const passwordMatch = computed(() => {
    if (!passwordConfirm.value) return true
    return password.value === passwordConfirm.value
  })

  const isPasswordValid = computed(() => {
    return password.value.length >= 6 && password.value.length <= 14;
  })
  
  const hasPasswordError = computed(() => {
    return isPasswordTouched.value && !isPasswordValid.value;
  });

  const checkPasswordValidity = () => {
    isPasswordTouched.value = true;
  };

  const currentImageUrl = computed(() => {
    return profileImageUrl.value || imageUrl.value
  })

  const checkUsernameValidity = async () => {
    isUsernameTouched.value = true
    
    // 본인의 닉네임과 같으면 유효
    if (userProfile.value.username === originalUsername.value) {
      hasUsernameError.value = ''
      return
    }

    try {
      await userStore.checkUsernameAvailable(userProfile.value.username)
      hasUsernameError.value = ''
    } catch (error) {
      if (error.response?.data?.text) {
        hasUsernameError.value = error.response.data.text
      } else {
        hasUsernameError.value = '닉네임 중복 확인에 실패했습니다.'
      }
    }
}

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

      // 이미지 업로드 및 ID 받기
      const imageId = await userStore.uploadProfileImage(file)
      console.log('새로운 이미지 업로드 결과:', imageId)

      if(imageId) {
        // 프로필 수정
        await userStore.updateProfile({
          username: userProfile.value.username,
          profileImageId: imageId,
          imageFile: file
        })
      }

      await loadProfileImage()
      
      } catch(error) {
        console.error('이미지 처리 실패:', error)
        if (error.response) {
          console.log('에러 응답:', error.response)
        }
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
    if(hasUsernameError.value) {
      alert('사용할 수 없는 닉네임입니다.')
      return
    }
    if (password.value && !isPasswordValid.value) {
      alert('비밀번호는 6-14자로 입력해주세요.')
      return
    }
    if (password.value && !passwordMatch.value) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
  
    try {
      await userStore.updateProfile({
        email: userProfile.value.email,
        username: userProfile.value.username,
        password: password.value || null,
        profileImageId: userProfile.value.profileImageId // 현재 프로필 이미지 ID 전달
      })

      originalUsername.value = userProfile.value.username
      
      password.value = ''
      passwordConfirm.value = ''
      selectedFile.value = null
      isPasswordTouched.value = false 
      isUsernameTouched.value = false
      hasUsernameError.value = false
      await loadProfileImage() // 이미지 재로드

      alert('프로필이 수정되었습니다.')
    } catch (error) {
      console.error('프로필 수정 실패:', error)
      alert('프로필 수정에 실패했습니다.')
    }
  }
  
  const closePasswordDialog = () => {
  showPasswordConfirmDialog.value = false
  currentPassword.value = ''
}

// confirmDelete 함수 수정
const confirmDelete = async () => {
  showPasswordConfirmDialog.value = true
}

// handleDeleteAccount 함수 추가
const handleDeleteAccount = async () => {
  try {
    const isValid = await userStore.verifyPassword(currentPassword.value)
    if (isValid) {
      if (confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        const userId = userProfile.value.id
        await userStore.deleteAccount(userId)
        await userStore.logout()
        alert('탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.')
        router.push('/signup')
      }
    } else {
      alert('비밀번호가 일치하지 않습니다.')
    }
    closePasswordDialog()
  } catch (error) {
    console.error('회원 탈퇴 처리 실패:', error)
    if (error.response && error.response.status === 400) {
      alert('비밀번호가 일치하지 않습니다.')
    } else {
      alert('처리 중 오류가 발생했습니다.')
    }
    closePasswordDialog()
  }
}
  
  onMounted(async () => {
    try {
      await userStore.getCurrentUserProfile()
      await loadProfileImage()

      originalUsername.value = userProfile.value.username
      isPasswordTouched.value = false
      isUsernameTouched.value = false
      hasUsernameError.value = false
      password.value = ''
      passwordConfirm.value = ''
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