<template>
    <RouterLink
      :to="`/mygroups-detail/${group.groupId}`"
      class="card bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
    >
      <div class="flex">
        <!-- Group Image -->
        <div class="w-48 h-48 rounded-2xl overflow-hidden">
          <img 
            v-if="imageUrl"
            :src="imageUrl" 
            :alt="group.groupName"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          >
          <div 
            v-else 
            class="w-full h-full bg-gray-100 flex items-center justify-center"
          >
            <div class="p-4 bg-gray-50 rounded-full">
              <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
  
        <div class="flex-1 pl-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ group.groupName }}</h3>
              <div class="flex items-center text-sm text-gray-600 space-x-4">
                <span>{{ group.region }}</span>
                <span class="highlight">{{ group.exerciseType }}</span>
              </div>
            </div>
  
            <div class="text-right">
              <p class="text-sm text-gray-600 mb-1">참여 인원</p>
              <p class="font-medium">
                {{ group.currentMembers }}/{{ group.memberCount }}명
              </p>
            </div>
          </div>
  
          <div class="mt-4">
            <p class="text-sm text-gray-500 mb-1">최근 공지</p>
            <p v-if="latestNotice" class="notice-text text-gray-900">
              {{ latestNotice }}
            </p>
            <p v-else class="text-gray-400">
              등록된 공지가 없습니다.
            </p>
          </div>
        </div>
      </div>
    </RouterLink>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useGroupStore } from '@/stores/group'
  
  const props = defineProps({
    group: {
      type: Object,
      required: true
    }
  })
  
  const groupStore = useGroupStore()
  const imageUrl = ref(null)
  const latestNotice = ref(null)
  const loading = ref(true)
  
  const loadGroupData = async () => {
  try {
    loading.value = true
    console.log('그룹 정보:', props.group) // 그룹 ID 확인
    
    const [noticeData, imageData] = await Promise.all([
      props.group.groupId ? groupStore.getLatestNotice(props.group.groupId) : null,
      props.group.groupImg ? groupStore.getGroupImage(props.group.groupImg) : null
    ])
    
    console.log('최신 공지 응답:', noticeData) // 공지 데이터 확인
    latestNotice.value = noticeData
    imageUrl.value = imageData
  } catch (error) {
    console.error('그룹 데이터 로드 실패:', error)
  } finally {
    loading.value = false
  }
}
  
  onMounted(() => {
    window.scrollTo(0, 0)
    loadGroupData()
  })
  </script>
  
  <style scoped>
  .highlight {
    @apply px-2 py-0.5 bg-[#dcff1f] rounded-full;
  }
  
  .notice-text {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>