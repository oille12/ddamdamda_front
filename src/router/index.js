// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import BoardView from '@/views/BoardView.vue'
import BoardDetail from '@/components/board/BoardDetail.vue'
import BoardWrite from '@/components/board/BoardWrite.vue'
import BoardEdit from '@/components/board/BoardEdit.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView
    // },
    {
      path: '/board',
      name: 'board',
      component: BoardView
    },
    {
      path: '/board/:id',
      name: 'boardDetail',
      component: BoardDetail
    },
    {
      path: '/board/write',
      name: 'boardWrite',
      component: BoardWrite
    },
    {
      path: '/board/:id/edit',
      name: 'boardEdit',
      component: BoardEdit
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
  ]
})

export default router