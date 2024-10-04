import { createRouter, createWebHistory } from 'vue-router'

import DashboardPage from '@/components/DashboardPage.vue'
import UserDetail from '@/components/userDetail.vue'
import  TaskDetails from '@/components/TaskDetails.vue'
import Addtask from '@/components/Addtask.vue'
import UpdateTask from '@/components/UpdateTask.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardPage,
      children:[

        {
          path:'addtask',
          component:Addtask,
        },
        {
          path:'updatetask/:id',
          component:UpdateTask,
        },
      ]
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
