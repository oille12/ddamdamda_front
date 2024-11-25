<template>
    <!-- Notifications -->
  <!-- Notifications -->
  <div class="relative notification-dropdown">  <!-- notification-dropdown 클래스 추가 -->
    <!-- Notification Icon -->
    <button @click="toggleNotifications" class="relative text-gray-600 hover:text-gray-900">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <span 
        v-if="unreadCount > 0" 
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full"
      >
        {{ unreadCount }}
      </span>
    </button>

    <!-- Notifications Dropdown -->
    <div 
      v-if="showNotifications" 
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto notification-dropdown"
    >
        <div class="py-2">
          <!-- 알림이 없을 경우 -->
          <div 
            v-if="notifications.length === 0" 
            class="px-4 py-2 text-sm text-gray-500"
          >
            받은 알림이 없습니다.
          </div>
  
          <!-- 알림 목록 -->
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            :class="[
              'px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer',
              notification.isRead ? 'opacity-60' : ''
            ]"
            @click="handleNotificationClick(notification)"
          >
            <!-- 알림 내용 -->
            <div class="flex-1 pr-4">
              <p :class="['text-sm', notification.isRead ? 'text-gray-400' : 'text-gray-700']">
                {{ notification.content }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatDate(notification.createdAt) }}
              </p>
            </div>
  
            <!-- 삭제 버튼 -->
            <button 
              @click.stop="deleteNotification(notification.id)"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useNoticeStore } from '@/stores/notice'  // notice store 생성 필요
  import { useUserStore } from '@/stores/user'
  
  const router = useRouter()
  const noticeStore = useNoticeStore()
  const userStore = useUserStore()
  
  // 상태 관리
  const showNotifications = ref(false)
  const notifications = ref([])
  const emit = defineEmits(['toggle'])
  
  // 읽지 않은 알림 개수
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })
  
  // 알림 목록 가져오기
  const fetchNotifications = async () => {
    try {
      const response = await noticeStore.getNotifications(userStore.user.id)
      notifications.value = response
    } catch (error) {
      console.error('알림 목록 로드 실패:', error)
    }
  }
  
  // 알림 토글
  const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  emit('toggle', showNotifications.value)
  }
  
  // 알림 클릭 처리
  const handleNotificationClick = async (notification) => {
    try {
      // 읽음 처리
      if (!notification.isRead) {
        await noticeStore.markAsRead(notification.id)
        notification.isRead = 1
      }
  
      // 알림 정보 가져오기
      const info = await noticeStore.getNoticeInfo(notification)
  
      // referenceType에 따른 페이지 이동
      if (notification.referenceType === 'like' || notification.referenceType === 'comment') {
        router.push(`/board/${notification.referenceId}`)  // 게시글 페이지로 이동
      } else if (notification.referenceType === 'group_notice') {
        router.push(`/group-notice-detail/${info.gnoticeId}`)  // 그룹 공지글 페이지로 이동
      }
      
      showNotifications.value = false
    } catch (error) {
      console.error('알림 처리 실패:', error)
    }
  }
  
  // 알림 삭제
  const deleteNotification = async (id) => {
    try {
      await noticeStore.deleteNotification(id)
      notifications.value = notifications.value.filter(n => n.id !== id)
    } catch (error) {
      console.error('알림 삭제 실패:', error)
    }
  }
  
  // 날짜 포맷
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleClickOutside = (event) => {
  const target = event.target
  const dropdown = document.querySelector('.notification-dropdown')
  if (showNotifications.value && dropdown && !dropdown.contains(target)) {
    showNotifications.value = false
  }
}
  
onMounted(() => {
  window.scrollTo(0, 0)
  fetchNotifications()  // 알림 목록 로드
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

  </script>
  
  <style scoped>
  .notification-badge {
    font-size: 0.65rem;
    min-width: 1rem;
    min-height: 1rem;
  }

  .notification-dropdown::-webkit-scrollbar {
  width: 6px; /* 스크롤바 너비 */
  height: 6px; /* 스크롤바 높이 */
}

.notification-dropdown::-webkit-scrollbar-thumb {
  background-color: #9ca3af; /* 스크롤바 색상 */
  border-radius: 3px; /* 스크롤바 둥근 모서리 */
}

.notification-dropdown::-webkit-scrollbar-track {
  background-color: #f3f4f6; /* 스크롤바 트랙 색상 */
}

  </style>