import { createRouter, createWebHashHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/Login.vue'

const routes = [
  {
    path: '/',
    redirect: "/login",
  },
  {
    path: '/home',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: "/login",
    name: 'login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
