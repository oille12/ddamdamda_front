<template>
<div 
    class="card bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
    @click="showModal = true"
  >
    <!-- Group Image - 높이를 조정하고 더 둥글게 -->
    <div class="mb-4 relative aspect-[16/9] rounded-2xl overflow-hidden">
      <img 
        v-if="imageUrl"
        :src="imageUrl" 
        :alt="group.groupName"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      >
      <div 
        v-else 
        class="w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl"
      >
        <div class="p-4 bg-gray-50 rounded-full">
          <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    </div>

    <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ group.groupName }}</h3>
    
    <div class="flex items-center mb-2">
      <span 
        class="text-xs px-3 py-1.5 rounded-full font-black"
        :class="group.mateStatus === '마감' ? 'bg-gray-200 text-gray-600' : 'bg-[#dcff1f] text-black'"
      >
        {{ group.mateStatus }}
      </span>
      <span class="ml-2 text-sm">{{ group.currentMembers }} / {{ group.memberCount }}명</span>
    </div>

    <div class="text-sm text-gray-600 mb-2">
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {{ group.region }}
      </div>
      <div class="flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {{ group.exerciseType }}
      </div>
    </div>

    <p class="text-gray-600 mb-4 line-clamp-2 hover:text-gray-900">{{ group.description }}</p>

    <button 
      class="w-full py-2.5 px-4 rounded-full text-center transition-colors"
      :class="buttonClass"
      @click.stop="handleJoin"
      :disabled="group.mateStatus === '마감'"
    >
      {{ buttonText }}
    </button>
  </div>

  <!-- Modal -->
  <div 
    v-if="showModal" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-20px z-50"
    @click="showModal = false"
  >
    <div 
      class="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
      @click.stop
    >
      <div class="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4">
        <img 
          v-if="imageUrl"
          :src="imageUrl" 
          :alt="group.groupName"
          class="w-full h-full object-cover"
        >
        <div 
          v-else 
          class="w-full h-full bg-gray-100 flex items-center justify-center rounded-2xl"
        >
          <div class="p-6 bg-gray-50 rounded-full">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <h3 class="text-2xl font-semibold text-gray-800 mb-4">{{ group.groupName }}</h3>
      
      <div class="flex items-center mb-4">
        <span 
          class="text-sm px-3 py-1.5 rounded-full"
          :class="group.mateStatus === '마감' ? 'bg-gray-200 text-gray-600' : 'bg-[#dcff1f] text-black'"
        >
          {{ group.mateStatus }}
        </span>
        <span class="ml-2">{{ group.currentMembers }} / {{ group.memberCount }}명</span>
      </div>

      <div class="text-sm text-gray-600 mb-4">
        <div class="flex items-center gap-1 mb-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ group.region }}
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {{ group.exerciseType }}
        </div>
      </div>

      <div class="text-gray-600 mb-6 whitespace-pre-wrap">{{ group.description }}</div>

      <div class="flex justify-end">
        <button 
          class="px-4 py-2 bg-black border rounded-full text-white hover:text-gray-900"
          @click="showModal = false"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  group: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['join'])
const userStore = useUserStore()
const groupStore = useGroupStore()
const imageUrl = ref(null)
const showModal = ref(false)
const isMember = ref(false)

// 현재 유저가 관리자인지 확인
const isAdmin = computed(() => {
  return userStore.user && userStore.user.id === props.group.adminId
})

const buttonText = computed(() => {
  if (isMember.value || isAdmin.value) return '이미 참여한 그룹 메이트입니다'
  if (props.group.mateStatus === '마감') return '모집 마감'
  return '참가하기'
})

const buttonClass = computed(() => {
  if (isAdmin.value || isMember.value || props.group.mateStatus === '마감') {
    return 'bg-gray-100 text-gray-500 cursor-not-allowed'
  }
  return 'bg-black text-white hover:bg-gray-800'
})

const canJoin = computed(() => {
  return (!isMember.value) && (props.group.mateStatus !== '마감') && (!isAdmin.value)
})

const handleJoin = async () => {
  if (!canJoin.value) return
  
  try {
    if (!userStore.isAuthenticated) {
      alert('로그인이 필요합니다.')
      return
    }

    const confirmed = window.confirm(`'${props.group.groupName}' 그룹에 참가하시겠습니까?`)
    if (!confirmed) return  // 취소를 누르면 여기서 종료

    await groupStore.joinGroup(props.group.groupId, userStore.user.id)
    // 성공 메시지
    alert('그룹 참가가 완료되었습니다.')

    window.location.reload()
  } catch (error) {
    console.error('그룹 참가 실패:', error)
    alert('그룹 참가에 실패했습니다.')
  }
}

const checkMembership = async () => {
  if (userStore.isAuthenticated) {
    isMember.value = await groupStore.checkMembershipStatus(
      props.group.groupId, 
      userStore.user.id
    )
  }
}

onMounted(async () => {
  window.scrollTo(0, 0)
  if (props.group.groupImg) {
    imageUrl.value = await groupStore.getGroupImage(props.group.groupImg)
  }
  await checkMembership()
})
</script>

<style scoped>
/* Optional: Add smooth scrollbar to modal */
.modal-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

/* 스크롤바 완전히 숨기기 */
.hide-scrollbar {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 또는 미니멀한 스크롤바를 원한다면 */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

</style>