<template>
  <div class="card bg-white p-6 rounded-xl shadow-lg">
    <!-- Group Image -->
    <div class="mb-4 relative aspect-[4/3] rounded-lg overflow-hidden">
      <img 
        v-if="imageUrl"
        :src="imageUrl" 
        :alt="group.groupName"
        class="w-full h-full object-cover"
      >
      <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
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

    <p class="text-gray-600 mb-4 line-clamp-2">{{ group.description }}</p>

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
import { useGroupStore } from '@/stores/group'

const props = defineProps({
  group: {
    type: Object,
    required: true
  }
})

const groupStore = useGroupStore()
const imageUrl = ref(null)

onMounted(async () => {
  if (props.group.groupImg) {
    imageUrl.value = await groupStore.getGroupImage(props.group.groupImg)
  }
})
</script>