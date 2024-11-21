// views/group/GroupView.vue
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
            <input 
              v-model="searchKeyword"
              type="text"
              placeholder="그룹 검색..."
              class="border rounded px-3 py-2"
            >
            <button 
              @click="handleSearch"
              class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              검색
            </button>
          </div>

          <!-- Filter -->
          <div class="flex gap-2">
            <select 
              v-model="selectedStatus"
              class="border rounded px-3 py-2"
              @change="handleFilter"
            >
              <option value="">전체 상태</option>
              <option value="모집중">모집중</option>
              <option value="마감">마감</option>
            </select>

            <!-- Create Group Link (Changed from button to router-link) -->
            <router-link 
              v-if="userStore.isAuthenticated"
              to="/group/write" 
              class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              그룹 메이트 만들기
            </router-link>
          </div>
        </div>

        <!-- Groups Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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