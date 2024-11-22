<template>
    <main class="pt-20 pb-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900">내 그룹 메이트</h1>
          <p>참여 중인 그룹 목록입니다.</p>
        </div>
        
        <MyGroupList />
      </div>
    </main>
  </template>
  
  <script setup>
  import MyGroupList from '@/components/group/my/MyGroupList.vue';
  </script>