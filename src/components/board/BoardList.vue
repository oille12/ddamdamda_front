<template>
  <div class="max-w-7xl mx-auto px-6">
    <div class="flex justify-between items-center mb-6">
      <div class="flex gap-2">
        <!-- 카테고리 필터 -->
        <button 
          v-for="cat in categories" 
          :key="cat"
          class="px-4 py-2 rounded-full"
          :class="category === cat ? 'bg-black text-[#dcff1f]' : 'bg-gray-100'"
          @click="category = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- 정렬 & 글쓰기 -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <input 
            v-model="searchKeyword"
            @keyup.enter="handleSearch"
            type="text" 
            placeholder="검색어를 입력하세요" 
            class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
                    
          <select v-model="orderBy" @change="handleSort" class="rounded-lg border p-2">
            <option value="created_at">최신순</option>
            <option value="view_count">조회순</option>
            <option value="likes_count">좋아요순</option>
            <option value="comments_count">댓글순</option>
          </select>
        </div>
        <router-link 
          to="/board/write"
          class="px-4 py-2 bg-black text-[#dcff1f] rounded-full"
        >
          글쓰기
        </router-link>
      </div>
    </div>

    <!-- 게시글 목록 -->
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div v-for="board in filteredBoards" :key="board.id" class="border-b border-gray-100 p-4">
        <router-link :to="`/board/${board.id}`" class="block hover:bg-gray-50">
          <div class="flex items-center gap-4 mb-2">
            <span class="px-3 py-1 bg-gray-100 text-xs rounded-full">
              {{ board.category }}
            </span>
            <span class="text-gray-500 text-sm">{{ board.createdAt }}</span>
          </div>
          <h3 class="text-lg font-medium mb-2">
            {{ board.title }}
            <span class="text-gray-400 text-sm">({{ board.commentsCount }})</span>
          </h3>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>{{ board.username }}</span>
            <div class="flex items-center gap-4">
              <span>조회 {{ board.viewCount }}</span>
              <span>좋아요 {{ board.likesCount }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <div class="flex justify-center items-center gap-2 mt-6">
      <button
        v-for="page in totalPages"
        :key="page"
        class="w-8 h-8 rounded-md"
        :class="[
        'px-3 py-1 mx-1 rounded',
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
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBoardStore } from '@/stores/board'

const boardStore = useBoardStore()

const PAGE_SIZE = 5
const currentPage = ref(1)
const category = ref('전체')
const searchKeyword = ref('')
const orderBy = ref('created_at')
const orderDir = ref('DESC')
const categories = ['전체', '자유', '운동인증']
const allBoards = ref([])

// 전체 게시글 로드
const loadAllBoards = async () => {
  const pageRequest = {
    pageNum: 1,
    pageSize: 1000, // 충분히 큰 수로 설정
    orderBy: orderBy.value,
    orderDir: orderDir.value
  }

  if (searchKeyword.value) {
    pageRequest.search = searchKeyword.value
    pageRequest.keyword = 'title,content'
  }

  try {
    const response = await boardStore.getBoards(pageRequest)
    allBoards.value = response.list || []
  } catch(error) {
    console.error('게시글 로드 실패:', error)
    allBoards.value = []
  }
}

// 검색
const handleSearch = async() => {
  currentPage.value = 1
  await loadAllBoards()
}

// 정렬
const handleSort = async () => {
  currentPage.value = 1
  await loadAllBoards()
}

// 카테고리로 필터링된 게시글
const filteredByCategory = computed(() => {
  if (category.value === '전체') return allBoards.value
  return allBoards.value.filter(board => board.category === category.value)
})

// 현재 페이지에 표시할 게시글
const filteredBoards = computed(() => {
  const startIndex = (currentPage.value - 1) * PAGE_SIZE
  return filteredByCategory.value.slice(startIndex, startIndex + PAGE_SIZE)
})

// 총 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(filteredByCategory.value.length / PAGE_SIZE)
})

// 페이지 변경
const changePage = (page) => {
  currentPage.value = page
}

// 검색어, 정렬 조건 변경 시 전체 데이터 다시 로드
watch([searchKeyword, orderBy, orderDir], async () => {
  currentPage.value = 1
  await loadAllBoards()
}, { immediate: true })

// 카테고리 변경 시 페이지만 리셋
watch(category, () => {
  currentPage.value = 1
})

onMounted(() => {
  window.scrollTo(0, 0)
  loadAllBoards()
})
</script>