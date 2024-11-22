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
    {
      path: '/group',
      children: [
        {
          path: '',
          name: 'GroupView',
          component: GroupView
        },
        {
          path: 'write',
          name: 'GroupInfoWrite',
          component: GroupInfoWrite
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
      component: DiaryView
    },
    {
      path: '/mygroups',
      name: 'mygroups',
      component: MyGroupView
    },
    {
      path: '/mygroups-detail/:groupId',
      name: 'MyGroupDetail',
      component: MyGroupDetail
    }
  ]
})

export default router