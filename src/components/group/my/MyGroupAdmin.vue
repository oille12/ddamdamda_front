<template>
    <main class="pt-20 pb-20" role="main">
      <div class="max-w-7xl mx-auto px-6">
        <!-- 헤더 -->
        <div class="my-8 pb-6">
          <h1 class="text-2xl font-bold text-gray-900">그룹 관리</h1>
          <p class="text-gray-600">그룹 정보 수정 및 그룹원 관리가 가능합니다.</p>
        </div>
  
        <!-- 메인 컨텐츠 -->
        <div class="flex gap-8">
          <!-- 사이드 메뉴 -->
          <div class="w-64 flex-shrink-0">
            <div class="bg-white rounded-md shadow-sm overflow-hidden flex flex-col">
                <!-- 기존 메뉴 버튼들 -->
                <button
                @click="currentMenu = 'edit'"
                :class="['w-full px-6 py-4 font-medium text-left transition-colors', 
                    currentMenu === 'edit' ? 'bg-gray-50 text-black' : 'text-gray-600 hover:bg-gray-50']"
                >
                그룹 수정
                </button>
                <button
                @click="currentMenu = 'members'"
                :class="['w-full px-6 py-4 font-medium text-left transition-colors', 
                    currentMenu === 'members' ? 'bg-gray-50 text-black' : 'text-gray-600 hover:bg-gray-50']"
                >
                그룹원 관리
                </button>

                <!-- 구분선 -->
                <div class="border-t border-gray-100"></div>

                <!-- 돌아가기 버튼 -->
                <button
                @click="$router.push(`/mygroups-detail/${groupId}`)"
                class="w-full px-6 py-4 text-left text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                그룹 페이지로 돌아가기
                </button>
            </div>
        </div>
  
          <!-- 내용 영역 -->
          <div class="flex-1">
            <!-- 그룹 수정 -->
            <div v-if="currentMenu === 'edit'" class="bg-white rounded-xl shadow-sm">
              <div class="p-8">
                <h2 class="text-xl font-bold text-gray-900 mb-6">그룹 수정</h2>
                <hr class="mb-6">
  
                <!-- 그룹 이미지 -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">그룹 이미지</label>
                  <div class="relative h-64 bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      v-if="imagePreview"
                      :src="imagePreview"
                      class="w-full h-full object-cover"
                      alt="Group preview"
                    >
                    <div
                      class="absolute inset-0 flex items-center justify-center hover:bg-black/10 cursor-pointer transition-colors"
                      @click="$refs.fileInput.click()"
                    >
                      <span class="bg-black/50 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                        이미지 {{ imagePreview ? '변경' : '업로드' }}
                      </span>
                    </div>
                    <input
                      ref="fileInput"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleImageChange"
                    >
                  </div>
                </div>
  
                <!-- 그룹명 -->
                <div class="mb-6">
                  <label for="groupName" class="block text-sm font-medium text-gray-700 mb-2">그룹명</label>
                  <input
                    id="groupName"
                    v-model="groupName"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                </div>
  
                <!-- 지역 & 운동 종목 -->
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label for="region" class="block text-sm font-medium text-gray-700 mb-2">지역</label>
                        <input
                        id="region"
                        v-model="region"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="지역을 입력하세요"
                        >
                    </div>

                    <div>
                        <label for="exerciseType" class="block text-sm font-medium text-gray-700 mb-2">운동 종목</label>
                        <input
                        id="exerciseType"
                        v-model="exerciseType"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="운동 종목을 입력하세요"
                        >
                    </div>
                </div>
  
                <!-- 모집 인원 -->
                <div class="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label for="memberCount" class="block text-sm font-medium text-gray-700 mb-2">모집 인원</label>
                        <div class="flex gap-4">
                        <input
                            id="memberCount"
                            v-model="memberCount"
                            type="number"
                            min="1"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                        </div>
                    </div>

                    <div>
                        <label for="mateStatus" class="block text-sm font-medium text-gray-700 mb-2">모집 상태</label>
                        <select
                        id="mateStatus"
                        v-model="mateStatus"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        >
                        <option value="모집중">모집중</option>
                        <option value="마감">마감</option>
                        </select>
                    </div>
                </div>
  
                <!-- 그룹 설명 -->
                <div class="mb-6">
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-2">그룹 설명</label>
                  <textarea
                    id="description"
                    v-model="description"
                    rows="4"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  ></textarea>
                </div>
  
                <!-- 버튼 영역 -->
                <div class="flex justify-between pt-4">
                  <button
                    @click="confirmDelete"
                    class="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-full hover:bg-red-50 transition-all"
                  >
                    그룹 삭제
                  </button>
                  <button
                    @click="updateGroup"
                    class="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all"
                  >
                    수정하기
                  </button>
                </div>
              </div>
            </div>
  
            <!-- 그룹원 관리 -->
            <div v-if="currentMenu === 'members'" class="bg-white rounded-xl shadow-sm">
              <div class="p-8">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-bold text-gray-900">그룹원 목록</h2>
                  <span class="text-sm text-gray-500">총 {{ members.length }}명</span>
                </div>
  
                <!-- 멤버 테이블 -->
                <div class="overflow-x-auto">
                  <table class="w-full">
                    <thead>
                      <tr class="border-b">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">프로필</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">닉네임</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="member in members" :key="member.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img
                              v-if="member.profileImage"
                              :src="member.profileImage"
                              :alt="member.username"
                              class="w-full h-full object-cover"
                            >
                            <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                              {{ member.username[0] }}
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="font-medium text-gray-900">{{ member.username }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {{ formatDate(member.createdAt) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm">
                          <template v-if="member.id !== groupInfo?.adminId">
                            <button
                              @click="kickMember(member)"
                              class="text-red-600 hover:text-red-800 transition-colors"
                            >
                              추방
                            </button>
                          </template>
                          <span v-else class="px-2 py-0.5 text-xs rounded-full bg-gray-100">
                            관리자
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
  const currentMenu = ref('edit')
  const groupInfo = ref(null)
  const members = ref([])
  const imagePreview = ref(null)
  const imageFile = ref(null)
  
  // 폼 데이터
  const groupName = ref('')
  const region = ref('')
  const exerciseType = ref('')
  const memberCount = ref(1)
  const description = ref('')
  const mateStatus = ref('')
  const groupId = computed(() => route.params.groupId)
  
  // 데이터 로드
  const loadGroupData = async () => {
    try {
        console.log('Loading group data for ID:', groupId.value) // 디버깅용
        if (!groupId.value) {
        throw new Error('Group ID is missing')
        }

        const response = await groupStore.getGroupDetail(groupId.value)
        groupInfo.value = response
        
        // 폼 데이터 설정
        groupName.value = response.groupName
        region.value = response.region
        exerciseType.value = response.exerciseType
        memberCount.value = response.memberCount
        description.value = response.description
        mateStatus.value = response.mateStatus

        // 이미지 로드
        if (response.groupImg) {
        imagePreview.value = await groupStore.getGroupImage(response.groupImg)
        }
    } catch (error) {
        console.error('그룹 정보 로드 실패:', error)
        alert('그룹 정보를 불러오는데 실패했습니다.')
    }
    }
  
  // 멤버 목록 로드
  const loadMembers = async () => {
    try {
        console.log('Loading members for group:', groupId.value) // 디버깅용
        if (!groupId.value) {
        throw new Error('Group ID is missing')
        }

        const membersList = await groupStore.getGroupMembers(groupId.value)
        members.value = await Promise.all(
        membersList.map(async (member) => {
            let profileImage = null
            if (member.profileImageId) {
            profileImage = await userStore.getProfileImage(member.profileImageId)
            }
            const createdAt = await groupStore.getGroupMemberCreatedAt(groupId.value, member.id)

            return { ...member, profileImage, createdAt }
        })
        )
    } catch (error) {
        console.error('멤버 목록 로드 실패:', error)
        alert('멤버 목록을 불러오는데 실패했습니다.')
    }
    }
  
  // 이미지 변경 처리
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      imageFile.value = file
      const reader = new FileReader()
      reader.onload = e => {
        imagePreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  
  // 그룹 정보 업데이트
  const updateGroup = async () => {
    try {
        const formData = new FormData()
        
        const groupData = {
        groupId: parseInt(groupId.value),
        groupName: groupName.value,
        description: description.value,
        region: region.value,
        exerciseType: exerciseType.value,
        memberCount: parseInt(memberCount.value),
        groupImg: groupInfo.value.groupImg,  // 기존 이미지 ID 유지
        mateStatus: mateStatus.value,
        adminId: groupInfo.value.adminId,
        currentMembers: groupInfo.value.currentMembers
        }

        formData.append('groupInfo', new Blob([JSON.stringify(groupData)], {
        type: 'application/json'
        }))

        // 새 이미지가 있을 때만 이미지 파일 추가
        if (imageFile.value) {
        formData.append('imageFile', imageFile.value)
        }

        await groupStore.updateGroup(formData)
        alert('그룹 정보가 수정되었습니다.')
        await loadGroupData()
    } catch (error) {
        console.error('그룹 수정 실패:', error)
        alert('그룹 수정에 실패했습니다. 다시 시도해주세요.')
    }
    }
  
  // 그룹 삭제
  const confirmDelete = async () => {
    if (!window.confirm('정말 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return
  
    try {
      await groupStore.deleteGroup(route.params.groupId)
      router.push('/mygroups')
    } catch (error) {
      console.error('그룹 삭제 실패:', error)
      alert('그룹 삭제에 실패했습니다. 다시 시도해주세요.')
    }
  }
  
// 멤버 추방
const kickMember = async (member) => {
  if (!window.confirm(`${member.username}님을 추방하시겠습니까?`)) return

  try {
    if (!groupId.value) {
      throw new Error('Group ID is missing')
    }

    await groupStore.leaveGroup(groupId.value, member.id)
    await loadMembers()
  } catch (error) {
    console.error('멤버 추방 실패:', error)
    alert('멤버 추방에 실패했습니다. 다시 시도해주세요.')
  }
}

// 날짜 포맷 함수
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  await Promise.all([
    loadGroupData(),
    loadMembers()
  ])
})
</script>

<style scoped>
.menu-item.active {
  background-color: #f9f9f9;
  color: black;
}

/* 테이블 반응형 스타일 */
@media (max-width: 640px) {
  .overflow-x-auto {
    margin: 0 -1rem;
  }
  
  table {
    min-width: 600px;
  }
}
</style>