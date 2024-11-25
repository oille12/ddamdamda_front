<template>
    <div id="app" class="min-h-screen flex flex-col">
        <!-- Header -->
        <header class="fixed w-full z-50 shadow-sm bg-gray-50">
            <div class="max-w-7xl mx-auto px-6">
            <div class="flex items-center justify-between h-14">
                <div class="flex items-center space-x-12">
                <router-link to="/" class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center bg-black">
                    <span class="font-bold text-xl mb-2" style="color: #dcff1f">;</span>
                    </div>
                    <span class="font-bold text-lg">DdamDamDa</span>
                </router-link>
                </div>
            </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 flex items-center justify-center px-6 pt-10" role="main">
        <div class="w-full max-w-md">
            <div class="bg-white p-8 rounded-xl shadow-lg my-12">
            <div class="text-center mb-8">
                <h1 class="text-2xl font-bold text-gray-900">회원가입</h1>
                <p>DdamDamDa에 오신 것을 환영합니다!</p>
            </div>

           <!-- 이메일 입력 -->
            <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700">
                이메일 <span class="text-red-500">*</span>
            </label>
            <div class="relative">
                <input
                v-model="email"
                type="email"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                :class="{ 
                    'border-red-500': errors.email,
                    'border-green-500': email && !errors.email && !isEmailChecking
                }"
                />
                <!-- 체크 표시 또는 로딩 스피너 -->
                <div v-if="email" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span v-if="isEmailChecking" class="text-gray-400">
                    확인중...
                </span>
                <span v-else-if="!errors.email" class="text-green-500">
                    ✓
                </span>
                </div>
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <!-- 닉네임 입력 -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700">
                    닉네임 <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <input
                    v-model="username"
                    type="text"
                    class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                    :class="{ 
                        'border-red-500': errors.username,
                        'border-green-500': username && !errors.username && !isUsernameChecking 
                    }"
                    />
                    <!-- 체크 표시 또는 로딩 스피너 -->
                    <div v-if="username" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span v-if="isUsernameChecking" class="text-gray-400">
                        확인중...
                    </span>
                    <span v-else-if="!errors.username" class="text-green-500">
                        ✓
                    </span>
                    </div>
                </div>
                <p v-if="errors.username" class="mt-1 text-sm text-red-500">{{ errors.username }}</p>
            </div>

            <!-- 비밀번호 입력 -->
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700">
                비밀번호 <span class="text-red-500">*</span>
                </label>
                <input
                v-model="password"
                type="password"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                :class="{ 'border-red-500': errors.password }"
                />
                <div class="mt-2 bg-white rounded-full">
                <div 
                    class="password-strength"
                    :class="{
                    'strength-weak': passwordStrength === 'weak',
                    'strength-medium': passwordStrength === 'medium',
                    'strength-strong': passwordStrength === 'strong'
                    }"
                ></div>
                </div>
                <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
            </div>

            <!-- 비밀번호 확인 -->
            <div class="mb-8">
                <label class="block text-sm font-medium text-gray-700">
                비밀번호 확인 <span class="text-red-500">*</span>
                </label>
                <input
                v-model="passwordConfirm"
                type="password"
                class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500"
                :class="{ 'border-red-500': errors.passwordConfirm }"
                />
                <p v-if="errors.passwordConfirm" class="mt-1 text-sm text-red-500">{{ errors.passwordConfirm }}</p>
            </div>

            <!-- 회원가입 버튼 -->
            <button 
                @click="handleSignup"
                class="w-full py-2 px-4 bg-black text-[#dcff1f] rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                :disabled="isSubmitting"
            >
                {{ isSubmitting ? '처리중...' : '회원가입' }}
            </button>

            <!-- 로그인 링크 -->
            <div class="mt-10 text-center">
                <p>이미 계정이 있으신가요? 
                <router-link to="/login" class="text-blue-600 hover:underline">
                    로그인
                </router-link>
                </p>
            </div>
            </div>
        </div>
    </main>
</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { debounce } from 'lodash'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const isSubmitting = ref(false)
const isEmailChecking = ref(false)
const isUsernameChecking = ref(false)
const errors = ref({
    email: '',
    username: '',
    password: '',
    passwordConfirm: ''
})

// 비밀번호 강도 계산
const passwordStrength = computed(() => {
    if (!password.value) return ''

    const length = password.value.length
    if (length < 6) return 'weak'
    if (length < 10) return 'medium'
    return 'strong'
})

const validateForm = () => {
    let isValid = true
    errors.value = {}

    if (!email.value) {
        errors.value.email = '이메일을 입력해주세요'
        isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        errors.value.email = '올바른 이메일 형식이 아닙니다'
        isValid = false
    }

    if (!username.value) {
        errors.value.username = '닉네임을 입력해주세요'
        isValid = false
    }

    if (!password.value) {
        errors.value.password = '비밀번호를 입력해주세요'
        isValid = false
    } else if (password.value.length < 6) {
        errors.value.password = '비밀번호는 최소 6자 이상이어야 합니다'
        isValid = false
    }

    if (password.value !== passwordConfirm.value) {
        errors.value.passwordConfirm = '비밀번호가 일치하지 않습니다'
        isValid = false
    }

    return isValid
}

// 이메일 중복 체크
const checkEmailAvailable = debounce(async () => {
  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = '올바른 이메일 형식이 아닙니다'
    return
  }

  try {
    isEmailChecking.value = true
    const isAvailable = await userStore.checkEmailAvailable(email.value)
    
    if (!isAvailable) {
      errors.value.email = '이미 사용중인 이메일입니다'
    } else {
      errors.value.email = ''
    }
  } catch (error) {
    console.error('이메일 중복 확인 실패:', error)
    errors.value.email = '이메일 확인에 실패했습니다'
  } finally {
    isEmailChecking.value = false
  }
}, 500)

// 닉네임 중복 체크
const checkUsernameAvailable = debounce(async () => {
  if (!username.value) {
    errors.value.username = '닉네임을 입력해주세요'
    return
  }

  try {
    isUsernameChecking.value = true
    const isAvailable = await userStore.checkUsernameAvailable(username.value)
    
    if (!isAvailable) {
      errors.value.username = '이미 사용중인 닉네임입니다'
    } else {
      errors.value.username = ''
    }
  } catch (error) {
    console.error('닉네임 중복 확인 실패:', error)
    errors.value.username = '닉네임 확인에 실패했습니다'
  } finally {
    isUsernameChecking.value = false
  }
}, 500)

// 이메일 입력값 감시
watch(email, (newValue) => {
  if (newValue) {
    checkEmailAvailable()
  } else {
    errors.value.email = ''
  }
})

// 닉네임 입력값 감시
watch(username, (newValue) => {
  if (newValue) {
    checkUsernameAvailable()
  } else {
    errors.value.username = ''
  }
})

const handleSignup = async () => {
    if (!validateForm()) return

    isSubmitting.value = true

    try {
        const response = await userStore.signup({
            email: email.value,
            password: password.value,
            username: username.value
        })

        console.log(response)
        
        if (response.message === 'success') {
          alert('회원가입이 완료되었습니다. 로그인해주세요.')
            router.push('/login')
        } else {
            alert(`회원가입에 실패했습니다. 이유: ${response.text}`)
        }
    } catch (error) {
        console.error('회원가입 실패:', error)
        alert('회원가입에 실패했습니다. 잠시후 시도해주세요.')
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.password-strength {
    height: 4px;
    transition: all 0.3s ease;
}

.strength-weak {
    width: 30%;
    background-color: #ef4444;
}

.strength-medium {
    width: 60%;
    background-color: #f59e0b;
}

.strength-strong {
    width: 100%;
    background-color: #10b981;
}
</style>