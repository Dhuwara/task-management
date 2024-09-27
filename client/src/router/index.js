import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardPage from '@/components/DashboardPage.vue'
import UserDetail from '@/components/userDetail.vue'
import  TaskDetails from '@/components/TaskDetails.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardPage
    },
    {
      path:'/userdetail/:id',
      component:UserDetail,
      children:[
        {
          path:'/userdetail/:id/taskdetail/:taskid',
          component:TaskDetails,
        }
      ]
    },
    
  ]
})

export default router
