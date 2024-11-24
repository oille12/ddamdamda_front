<template>
 <div class="min-h-screen bg-gray-50">
   <!-- Header -->
   <header class="fixed w-full z-50 shadow-sm bg-gray-50">
     <div class="max-w-7xl mx-auto px-6">
       <div class="flex items-center justify-between h-14">
         <!-- Logo -->
         <div class="flex items-center space-x-12">
           <router-link to="/" class="flex items-center space-x-2">
             <div class="w-8 h-8 rounded-full flex items-center justify-center bg-black">
               <span class="font-bold text-xl mb-2" style="color: #dcff1f">;</span>
             </div>
             <span class="font-bold text-lg">DdamDamDa</span>
           </router-link>

           <!-- Navigation -->
           <nav>
             <router-link 
               v-for="link in navLinks" 
               :key="link.path"
               :to="link.path"
               class="text-sm mx-3"
               :class="route.path.includes(link.path) ? 'text-gray-800 font-bold' : 'text-gray-500'"
             >
               {{ link.name }}
             </router-link>
           </nav>
         </div>

         <!-- Auth -->
         <div v-if="!userStore.isAuthenticated" class="flex items-center space-x-4">
           <router-link 
             to="/signup"
             class="px-4 py-1.5 text-gray-600 hover:text-gray-900 text-sm"
           >
             SIGN UP
           </router-link>
           <router-link 
             to="/login"
             class="px-4 py-1.5 bg-black text-white rounded-full hover:bg-gray-800 text-sm"
           >
             LOGIN
           </router-link>
         </div>
         <div v-else class="flex items-center space-x-6">
           <!-- Group -->
           <router-link to="/mygroups" class="text-gray-600 hover:text-gray-900">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                     d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
           </router-link>
           <!-- Notifications -->
           <NoticeView @toggle="handleNotificationToggle" />
           <!-- Profile -->
           <div class="relative" ref="profileDropdown">
             <button @click="toggleProfile" 
                     class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <!-- 현재 유저의 프로필 이미지 미리보기 -->
                <img 
                  :src="profileImageUrl" 
                  class="w-full h-full rounded-full object-cover"
                  alt="Profile"
                />
             </button>
             <!-- Profile Dropdown -->
             <div v-if="showProfile" 
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
               <router-link to="/profile" 
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                 프로필 설정
               </router-link>
               <div class="border-t border-gray-100"></div>
               <button @click="logout" 
                       class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                 로그아웃
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>
   </header>

   <!-- Main Content -->
   <router-view></router-view>
  </div>
  
  <!-- Footer -->
  <footer class="bg-gray-800 text-white py-10">
    <div class="container mx-auto text-center text-sm">
      <p>© 2024 DdamDamDa. All rights reserved.</p>
      <div class="mt-2">
        <a href="#" class="text-gray-400 hover:text-white mx-2">Thanks to Hyovely</a>
      </div>
      <div class="mt-5 flex items-center justify-center">
        <!-- github logo svg 첨부 -->
        <svg class="h-6 w-6 fill-current text-gray-400 hover:text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
        <a href="https://github.com/oille12/ddamdamda_front" target="_blank" class="text-gray-400 underline hover:text-white mx-2">GitHub</a>
      </div>
    </div>
  </footer>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import NoticeView from './views/NoticeView.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { profileImageUrl } = storeToRefs(userStore)
const showNotifications = ref(false)
const showProfile = ref(false)
const profileDropdown = ref(null)

const handleNotificationToggle = (isOpen) => {
  if (isOpen) {
    showProfile.value = false
  }
}

const navLinks = [
 { path: '/board', name: '게시판' },
 { path: '/group', name: '그룹 메이트' },
 { path: '/diary', name: '다이어리' }
]

const toggleNotifications = () => {
 showNotifications.value = !showNotifications.value
 if (showNotifications.value) {
    showProfile.value = false
  }
}

const toggleProfile = () => {
 showProfile.value = !showProfile.value
 if (showProfile.value) {
    showNotifications.value = false
  }
}

const handleOutsideClick = (event) => {
  if (profileDropdown.value && !profileDropdown.value.contains(event.target)) {
    showProfile.value = false
  }
}

const logout = async () => {
  await userStore.logout()
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
})

</script>