<template>
  <div class="card bg-white p-6 rounded-xl shadow-lg">
    <div class="mb-4">
      <img 
        :src="groupImageUrl" 
        :alt="group.groupName"
        class="w-full h-48 object-cover rounded-lg"
      >
    </div>

    <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ group.groupName }}</h3>
    
    <div class="flex items-center mb-2">
      <span 
        class="text-xs px-2 py-1 rounded"
        :class="group.mateStatus === '마감' ? 'bg-gray-200 text-gray-600' : 'bg-[#dcff1f] text-black'"
      >
        {{ group.mateStatus }}
      </span>
      <span class="ml-2">{{ group.currentMembers }} / {{ group.memberCount }}명</span>
    </div>

    <div class="text-sm text-gray-600 mb-2">
      <div>지역: {{ group.region }}</div>
      <div>운동: {{ group.exerciseType }}</div>
    </div>

    <p class="text-gray-600 mb-4">{{ group.description }}</p>

    <router-link 
      :to="`/group/${group.groupId}`"
      class="block w-full text-center py-2 px-4 rounded bg-black text-white hover:bg-gray-800"
    >
      상세보기
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const props = defineProps({
  group: {
    type: Object,
    required: true
  }
})

const groupImageUrl = ref('')

onMounted(async () => {
  try {
    // 이미지 URL을 가져오는 로직 필요
    const response = await api.get(`/groupinfo/image/${props.group.groupImg}`, {
      responseType: 'blob'
    })
    groupImageUrl.value = URL.createObjectURL(response.data)
  } catch (error) {
    console.error('그룹 이미지 로드 실패:', error)
  }
})
</script>