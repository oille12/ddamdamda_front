<template>
    <div>
      <!-- 로딩 상태 -->
      <div v-if="groupStore.loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
        <p class="mt-4 text-gray-600">로딩 중...</p>
      </div>
  
      <!-- 그룹이 없을 때 -->
      <div v-else-if="groupStore.myGroups.length === 0" class="text-center py-16">
        <div class="mb-4 text-gray-400">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">참여 중인 그룹이 없습니다</h3>
        <p class="mb-4">새로운 그룹에 참여해보세요!</p>
        <RouterLink 
          to="/group" 
          class="inline-flex items-center px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
        >
          그룹 찾아보기
        </RouterLink>
      </div>
  
      <!-- 그룹 목록 -->
      <div v-else class="grid grid-cols-1 gap-6">
        <GroupCard
          v-for="group in groupStore.myGroups"
          :key="group.id"
          :group="group"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useGroupStore } from '@/stores/group'
  import { useUserStore } from '@/stores/user'
  import GroupCard from './GroupCard.vue'
  
  const groupStore = useGroupStore()
  const userStore = useUserStore()
  
  onMounted(async () => {
    if (userStore.user?.id) {
      await groupStore.fetchMyGroups(userStore.user.id)
    }
  })
  </script>