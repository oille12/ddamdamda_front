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
        v-for="page in boardStore.totalPages"
        :key="page"
        class="w-8 h-8 rounded-full"
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
const { boards, totalPages, currentPage  } = storeToRefs(boardStore)

// const currentPage = ref(1)
const category = ref('전체')
const searchKeyword = ref('')
const orderBy = ref('created_at')
const orderDir = ref('DESC')
const categories = ['전체', '자유', '운동인증']

// 검색
const handleSearch = async() => {
  currentPage.value = 1
  await loadBoards(1)
}

// 정렬
const handleSort = async () => {
  try {
    const pageRequest = {
      pageNum: currentPage.value,
      pageSize: 20,
      search: searchKeyword.value || null,
      keyword: searchKeyword.value ? 'title,content' : null,
      orderBy: orderBy.value,
      orderDir: orderDir.value
    }
    
    console.log('정렬 요청:', pageRequest)
    await boardStore.getBoards(pageRequest)
  } catch (error) {
    console.error('정렬 실패:', error)
  }
}

// 카테고리 필터링
const filteredBoards = computed(() => {
  if(!boards.value) return []
  let filtered = [...boards.value]

  if(category.value === '전체') {
    return filtered
  }
  return filtered.filter(board => board.category === category.value)
})

const loadBoards = async (pageNum = 1) => {
    const pageRequest = {
      pageNum: pageNum || currentPage.value,
      pageSize: 5, // 10 으로 수정 ?
      orderBy: orderBy.value,
      orderDir: orderDir.value
    }

    // 검색어가 있을 때만 search와 keyword 추가
    if (searchKeyword.value) {
      pageRequest.search = searchKeyword.value
      pageRequest.keyword = 'title,content'
    }

    try {
      console.log('페이지 로드 요청:', pageRequest)
      await boardStore.getBoards(pageRequest)
    } catch(error) {
      console.error('게시글 로드 실패:', error)
    }
}

const changePage = (page) => {
  currentPage.value = page
  loadBoards(page)
}

watch([searchKeyword, orderBy, orderDir], async() => {
  currentPage.value = 1
  await loadBoards(1)
}, {immediate: true})

onMounted(() => {
  loadBoards()
})
</script>