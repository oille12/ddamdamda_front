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
              class="rounded-lg border p-2"
              @change="handleFilter"
            >
              <option value="">전체 상태</option>
              <option value="모집중">모집중</option>
              <option value="마감">마감</option>
            </select>
            <input 
              v-model="searchKeyword"
              type="text"
              placeholder="그룹 검색..."
              class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
            <button 
              @click="handleSearch"
              class="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
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

        <!-- Empty State -->
        <div v-if="groups.length === 0" class="text-center py-20">
          <div class="mb-4">
            <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            그룹 메이트 모집글이 없어요
          </h2>
          <p class="text-gray-600 mb-4">
            가장 먼저 운동 그룹을 만들어 보시는건 어떨까요?
          </p>
          <router-link 
            to="/group/write"
            class="inline-flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            새 그룹 만들기
          </router-link>
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
          />
        </div>

        <!-- Pagination -->
        <div class="mt-8 flex justify-center" v-if="totalPages > 1">
          <nav class="flex items-center gap-2">
            <button 
              v-for="page in totalPages" 
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-1 rounded',
                currentPage === page 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              ]"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

// 그룹 목록 조회
const fetchGroups = async (page = 1) => {
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
    console.error('그룹 목록 조회 실패:', error)
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
  fetchGroups(1)
}

onMounted(() => {
  fetchGroups()
})
</script>