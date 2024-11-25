// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import BoardView from '@/views/BoardView.vue'
import BoardDetail from '@/components/board/BoardDetail.vue'
import BoardWrite from '@/components/board/BoardWrite.vue'
import BoardEdit from '@/components/board/BoardEdit.vue'
import LoginView from '@/views/LoginView.vue'
import ProfileView from '@/views/ProfileView.vue'
import GroupView from '@/views/GroupView.vue'
import GroupInfoWrite from '@/components/group/GroupInfoWrite.vue'
import SignupView from '@/views/SignupView.vue'
import DiaryView from '@/views/DiaryView.vue'
import MyGroupView from '@/views/MyGroupView.vue'
import MyGroupDetail from '@/components/group/my/MyGroupDetail.vue'
import GroupNoticeWrite from '@/components/group/my/GroupNoticeWrite.vue'
import GroupNoticeDetail from '@/components/group/my/GroupNoticeDetail.vue'
import GroupNoticeEdit from '@/components/group/my/GroupNoticeEdit.vue'
import MyGroupAdmin from '@/components/group/my/MyGroupAdmin.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/board',
      name: 'board',
      component: BoardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/board/:id',
      name: 'boardDetail',
      component: BoardDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/board/write',
      name: 'boardWrite',
      component: BoardWrite,
      meta: { requiresAuth: true }
    },
    {
      path: '/board/:id/edit',
      name: 'boardEdit',
      component: BoardEdit,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/group',
      children: [
        {
          path: '',
          name: 'GroupView',
          component: GroupView,
          meta: { requiresAuth: true }
        },
        {
          path: 'write',
          name: 'GroupInfoWrite',
          component: GroupInfoWrite,
          meta: { requiresAuth: true }
        }
      ]
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView
    },
    {
      path: '/diary',
      name: 'diary',
      component: DiaryView,
      meta: { requiresAuth: true }
    },
    {
      path: '/mygroups',
      name: 'mygroups',
      component: MyGroupView,
      meta: { requiresAuth: true }
    },
    {
      path: '/mygroups-detail/:groupId',
      name: 'MyGroupDetail',
      component: MyGroupDetail,
      meta: { requiresAuth: true }
    },
    {
      path: '/group-notice-write/:groupId',
      name: 'GroupNoticeWrite',
      component: GroupNoticeWrite,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/group-notice-detail/:gnoticeId',
      name: 'GroupNoticeDetail',
      component: GroupNoticeDetail,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/group-notice-edit/:gnoticeId',
      name: 'GroupNoticeEdit',
      component: GroupNoticeEdit,
      meta: { requiresAuth: true }  // 인증 필요
    },
    {
      path: '/group-admin/:groupId',
      name: 'MyGroupAdmin',
      component: MyGroupAdmin,
      meta: { requiresAuth: true }  // 인증 필요
    },
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 인증이 필요한 페이지에 접근하는 경우
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } 
  // 이미 로그인한 사용자가 로그인 페이지에 접근하는 경우
  else if (to.path === '/login' && token) {
    next('/')
  }
  // 그 외의 경우
  else {
    next()
  }
})

export default router