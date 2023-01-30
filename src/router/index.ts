import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/Administrator/Hello'
  },
  {
    path: '/Administrator/Hello',
    component: () => import ('../views/HelloPage.vue')
  },
  {
    path: '/Administrator/User',
    component: () => import ('../views/User.vue')
  },
  {
    path: '/Administrator/Admin',
    component: () => import ('../views/Admin.vue')
  },
  {
    path: '/Administrator/Task',
    component: () => import ('../views/Task.vue')
  },
  {
    path: '/Administrator/Behavior',
    component: () => import ('../views/Behavior.vue')
  },
  {
    path: '/Administrator/Right',
    component: () => import ('../views/Right.vue')
  },



]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
