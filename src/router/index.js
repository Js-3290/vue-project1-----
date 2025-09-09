import { createRouter, createWebHistory } from 'vue-router'


import IndexView from '@/views/index/index.vue'
import ActView from '@/views/act/index.vue'
import UserView from '@/views/user/index.vue'
import UserReportView from '@/views/report/user/index.vue'
import ActReportView from '@/views/report/act/index.vue'
import LoginView from '@/views/login/index.vue'
import LayoutView from '@/views/layout/index.vue'
import UserLayoutView from '@/views/layout/userindex.vue'
import JoinView from '@/views/join/index.vue'
import CreateView from '@/views/create/index.vue'
import RegisterView from '@/views/register/index.vue'
import ActTypeView from '@/views/actType/index.vue'
import UserInfoView from '@/views/UserInfo/index.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: UserLayoutView,
      redirect: '/UserIndex',
      children: [
        { path: 'UserIndex', name: 'UserIndex', component: IndexView },
        { path: 'UserInfo', name: 'UserInfo', component: UserInfoView },
        { path: 'UserActRegister', name: 'UserActRegister', component: RegisterView },
        { path: 'UserActCreate', name: 'UserActCreate', component: CreateView },
        { path: 'UserActJoin', name: 'UserActJoin', component: JoinView },
      ]
    },
    {
      path: '/',
      name: '',
      component: LayoutView,
      redirect: '/index',
      children: [
        { path: 'index', name: 'index', component: IndexView },
        { path: 'act', name: 'act', component: ActView },
        { path: 'user', name: 'user', component: UserView },
        { path: 'userReport', name: 'userReport', component: UserReportView },
        { path: 'actReport', name: 'actReport', component: ActReportView },
        { path: 'actType', name: 'actType', component: ActTypeView }
      ]
    },
    { path: '/login', name: 'login', component: LoginView }
  ],
})

export default router
