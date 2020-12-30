import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: "/home",
    name: 'home',
    component: Home,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/StaticBox.vue'),
      }
    ]
  },
  {
    path: "/login",
    name: 'login',
    component: Login,
    hidden: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
