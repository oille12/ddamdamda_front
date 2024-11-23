<template>
    <main class="pb-20 py-20" role="main">
      <div class="max-w-4xl mx-auto px-6">
        <!-- 그룹 정보 카드 -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-lg mb-8">
          <!-- 그룹 이미지 -->
          <div class="relative h-64 overflow-hidden">
            <img 
              v-if="imageUrl"
              :src="imageUrl"
              :alt="groupInfo?.groupName"
              class="w-full h-full object-cover"
            />
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
  
            <!-- 관리자 설정 버튼 -->
            <div v-if="isAdmin" class="absolute top-4 right-4 z-10">
              <button class="p-2 bg-black rounded-full hover:bg-gray-800 transition-all" @click="goToAdminPage">
                <svg class="w-5 h-5" style="color: #dcff1f;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
  
          <div class="p-8">
            <!-- 그룹 기본 정보 -->
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-3">
                <span class="px-3 py-1 bg-black text-sm font-medium rounded-full" style="color: #dcff1f;">
                  {{ groupInfo?.exerciseType }}
                </span>
                <span class="text-sm text-gray-500">{{ groupInfo?.region }}</span>
              </div>
  
              <div class="flex items-center gap-3">
                <!-- 멤버 현황 (클릭시 모달) -->
                <button 
                  class="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all text-sm w-auto border"
                  @click="showModal = true"
                >
                  멤버 {{ groupInfo?.currentMembers }}/{{ groupInfo?.memberCount }}명
                </button>

                <!-- 그룹 탈퇴 버튼 (관리자가 아닐 경우에만 표시) -->
                <button
                  v-if="!isAdmin"
                  @click="confirmLeaveGroup"
                  class="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-all text-sm border border-red-200"
                >
                  그룹 탈퇴
                </button>
              </div>
            </div>
  
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ groupInfo?.groupName }}</h1>
            <p class="text-gray-600">{{ groupInfo?.description }}</p>
          </div>
        </div>
  
        <!-- 공지사항 섹션 -->
        <div class="bg-white rounded-2xl shadow-lg">
          <div class="p-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">전체 공지</h2>
              <RouterLink
                v-if="isAdmin"
                :to="{
                  name: 'GroupNoticeWrite',
                  params: { groupId: route.params.groupId }
                }"
                class="px-4 py-2 bg-black text-sm rounded-full hover:bg-gray-900 transition-all"
                style="color: #dcff1f;"
              >
                공지 작성
              </RouterLink>
            </div>

            <!-- 공지사항 없을 때 -->
            <div v-if="!notices.length" class="py-8 text-center text-gray-500">
              등록된 공지사항이 없습니다.
            </div>

            <!-- 공지사항 목록 -->
            <div v-else class="space-y-4">
              <RouterLink
                v-for="notice in notices"
                :key="notice.gnoticeId"
                :to="`/group-notice-detail/${notice.gnoticeId}`"
                class="block py-4 px-6 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
              >
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ notice.title }}</h3>
                <div class="text-sm text-gray-500">
                  {{ formatDate(notice.createdAt) }}
                </div>
              </RouterLink>
            </div>
  
            <!-- 페이지네이션 -->
            <div v-if="totalPages > 1" class="mt-6 flex justify-center gap-2">
              <button 
                v-for="page in totalPages" 
                :key="page"
                class="px-3 py-1 rounded-md"
                :class="page === currentPage ? 'bg-black text-[#dcff1f]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                @click="fetchNotices(page)"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 멤버 목록 모달 -->
      <div 
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="showModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-md">
          <div class="p-6 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-gray-900">그룹원 목록</h3>
              <button @click="showModal = false">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div class="space-y-3">
              <div 
                v-for="member in members" 
                :key="member.id"
                class="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <!-- 프로필 이미지 -->
                <div class="relative">
                  <!-- 관리자일 경우 왕관 아이콘 -->
                  <div 
                    v-if="member.id === groupInfo?.adminId"
                    class="absolute -top-2 -right-2 bg-black rounded-full p-1" 
                    style="color: #dcff1f;"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4l3 7h6l-5 5 2 7-6-4-6 4 2-7-5-5h6l3-7z" />
                    </svg>
                  </div>
                  <div class="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img 
                      v-if="member.profileImage"
                      :src="member.profileImage"
                      :alt="member.username"
                      class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <span class="text-xl text-gray-600">{{ member.username[0] }}</span>
                    </div>
                  </div>
                </div>

                <!-- 사용자 정보 -->
                <div class="flex-1">
                  <div class="font-medium">{{ member.username }}</div>
                  <span 
                    v-if="member.id === groupInfo?.adminId"
                    class="text-xs mt-1 inline-flex items-center bg-black px-2 py-0.5 rounded-full"
                    style="color: #dcff1f;"
                  >
                    관리자
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useGroupStore } from '@/stores/group'
  import { useUserStore } from '@/stores/user'
  
  const route = useRoute()
  const router = useRouter()
  const groupStore = useGroupStore()
  const userStore = useUserStore()
  
  // 상태 관리
  const imageUrl = ref(null)
  const showModal = ref(false)
  const members = ref([])
  const notices = ref([])
  const currentPage = ref(1)
  const totalPages = ref(0)
  const groupInfo = ref(null)
  const adminInfo = ref(null)

  const groupId = computed(() => route.params.groupId)
  
  // 관리자 여부 확인
  const isAdmin = computed(() => {
    return userStore.user?.id === groupInfo.value?.adminId
  })
  
  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR')
  }
  
  // 공지사항 가져오기
    const fetchNotices = async (page = 1) => {
    try {
      const response = await groupStore.fetchGroupNotices({
        pageNum: page,
        pageSize: 5,
        groupId: groupId.value  // computed 값 사용
      })
      notices.value = response.list
      totalPages.value = response.pages
      currentPage.value = page
    } catch (error) {
      console.error('공지사항 로드 실패:', error)
    }
  }
  
// 멤버 관련 로직
const fetchMembers = async () => {
  try {
    console.log('멤버 조회 시작, groupId:', groupId.value)
    const membersList = await groupStore.getGroupMembers(groupId.value)
    console.log('가져온 멤버 목록:', membersList)
    
    // 모든 멤버의 프로필 이미지 로드
    members.value = await Promise.all(
      membersList.map(async (member) => {
        let profileImage = null
        if (member.profileImageId) {
          profileImage = await userStore.getProfileImage(member.profileImageId)
        }
        return { ...member, profileImage }
      })
    )

  } catch (error) {
    console.error('멤버 목록 로드 실패:', error)
  }
}
  
  // 그룹 정보 가져오기
  const fetchGroupInfo = async () => {
    try {
      const info = await groupStore.getGroupDetail(groupId.value)  // computed 값 사용
      groupInfo.value = info
      if (info.groupImg) {
        imageUrl.value = await groupStore.getGroupImage(info.groupImg)
      }
    } catch (error) {
      console.error('그룹 정보 로드 실패:', error)
    }
  }
  
  // 관리자 페이지로 이동
  const goToAdminPage = () => {
    router.push(`/group-admin/${route.params.id}`)
  }

  const confirmLeaveGroup = async () => {
  if (window.confirm('정말 그룹에서 탈퇴하시겠습니까?')) {
    try {
      await groupStore.leaveGroup(groupId.value, userStore.user.id)
      router.push('/mygroups')
    } catch (error) {
      console.error('그룹 탈퇴 실패:', error)
      alert('그룹 탈퇴에 실패했습니다. 다시 시도해주세요.')
    }
  }
}
  
  onMounted(async () => {
    await Promise.all([
      fetchGroupInfo(),
      fetchNotices(),
      fetchMembers()
    ])
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