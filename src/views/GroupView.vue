<template>
  <div class="min-h-screen">
    <!-- Banner Section -->
    <section class="shadow-sm mb-3">
      <div class="max-w-7xl mx-auto px-8 pt-16">
        <div class="py-12">
          <h1 class="text-4xl font-bold text-gray-900">그룹 메이트 모집</h1>
          <p>운동 그룹을 찾아보세요. 새로운 도전을 함께할 메이트를 모집합니다!</p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="pt-6 pb-20">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Search and Filter -->
        <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <!-- Search -->
          <div class="flex gap-2">
            <select 
              v-model="selectedStatus"
              class="border rounded-lg px-3 py-2"
              @change="handleFilter"
            >
              <option value="">전체 상태</option>
              <option value="모집중">모집중</option>
              <option value="마감">마감</option>
            </select>
            <input 
              v-model="searchKeyword"
              type="text"
              placeholder="검색어를 입력하세요."
              class="border rounded-lg px-3 py-2"
            >
            <button 
              @click="handleSearch"
              class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              검색
            </button>
          </div>

          <!-- Filter -->
          <div class="flex gap-2">

            <!-- Create Group Link -->
            <router-link 
              to="/group/write" 
              class="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
            >
              그룹 메이트 만들기
            </router-link>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black"></div>
        </div>

        <!-- Empty State -->
        <div 
          v-else-if="groups.length === 0" 
          class="text-center py-20"
        >
          <div class="mb-6">
            <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-900 mb-2">
              {{ getEmptyStateMessage }}
            </h3>
            <p class="text-gray-500 mb-6">{{ getEmptyStateDescription }}</p>
            <div class="flex justify-center gap-4">
              <button
                v-if="selectedStatus || searchKeyword"
                @click="resetFilters"
                class="text-gray-600 hover:text-gray-900"
              >
                필터 초기화
              </button>
              <router-link 
                to="/group/write"
                class="inline-flex items-center px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800"
              >
                새 그룹 만들기
              </router-link>
            </div>
          </div>
        </div>

        <!-- Groups Grid -->
        <div 
          v-else 
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <GroupInfo 
            v-for="group in groups" 
            :key="group.groupId" 
            :group="group"
            @join="handleJoin"
          />
        </div>

                <!-- Pagination Info & Controls -->
        <div class="mt-8" v-if="totalPages > 0">
          <!-- Pagination Info -->
          <div class="flex justify-between items-center mb-4 text-sm text-gray-600">
            <div>
              총 {{ totalPages }} 페이지
            </div>
            <div v-if="searchKeyword || selectedStatus">
              검색된 그룹: {{ groups.length }}개
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex justify-center items-center gap-2">
            <button
              v-for="page in totalPages"
              :key="page"
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="[
                currentPage === page 
                  ? 'bg-black text-[#dcff1f]' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              ]"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import { useUserStore } from '@/stores/user'
import GroupInfo from '@/components/group/GroupInfo.vue'

const groupStore = useGroupStore()
const userStore = useUserStore()

const groups = ref([])
const currentPage = ref(1)
const totalPages = ref(0)
const searchKeyword = ref('')
const selectedStatus = ref('')
const isLoading = ref(false)

// 빈 상태 메시지 계산
const getEmptyStateMessage = computed(() => {
  if (selectedStatus.value) {
    return `${selectedStatus.value} 상태의 그룹이 없습니다`
  }
  if (searchKeyword.value) {
    return '검색 결과가 없습니다'
  }
  return '그룹 메이트 모집글이 없어요'
})

// 빈 상태 설명 계산
const getEmptyStateDescription = computed(() => {
  if (selectedStatus.value || searchKeyword.value) {
    return '다른 검색어나 필터를 시도해보세요'
  }
  return '가장 먼저 운동 그룹을 만들어 보시는건 어떨까요?'
})

// 필터 초기화
const resetFilters = () => {
  selectedStatus.value = ''
  searchKeyword.value = ''
  fetchGroups()
}

// 그룹 목록 조회
const fetchGroups = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await groupStore.fetchGroups({
      pageNum: page,
      pageSize: 9,
      search: searchKeyword.value || null,
      mateStatus: selectedStatus.value || null
    })
    groups.value = response.list
    totalPages.value = response.pages
    currentPage.value = page
  } catch (error) {
    if (error.response?.status === 400) {
      // 데이터가 없는 경우
      groups.value = []
      totalPages.value = 0
      currentPage.value = 1
    } else {
      console.error('그룹 목록 조회 실패:', error)
    }
  } finally {
    isLoading.value = false
  }
}

// 페이지 변경
const changePage = (page) => {
  fetchGroups(page)
}

// 검색
const handleSearch = () => {
  fetchGroups(1)
}

// 필터
const handleFilter = () => {
  currentPage.value = 1
  fetchGroups(1)
}

// 참가 처리
const handleJoin = async (groupId) => {
  try {
    await groupStore.joinGroup(groupId)
    await fetchGroups(currentPage.value)
  } catch (error) {
    console.error('그룹 참가 실패:', error)
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  fetchGroups()
})
</script>