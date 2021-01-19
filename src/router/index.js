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
    meta: {title: "首页", icon: "el-icon-location"},
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/StaticBox.vue'),
        meta: {title: "首页"},
      }
    ]
  },
  {
    path: '/user',
    redirect: "/user/index",
    name: 'user',
    component: Home,
    meta: {title: "用户中心", icon: "el-icon-menu"},
    children: [
      {
        path: '/user/index',
        name: 'index',
        meta: {title: "用户管理"},
        component: () => import('../views/Users'),
      },
      {
        path: '/user/payment',
        name: 'payment',
        meta: {title: "账单管理"},
        component: () => import('../views/Payment'),
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

router.beforeEach((to, from, next) => {
  // 去login的路由直接放行，要不会死循环
  if (to.path === "/login") return next()
  if (sessionStorage.getItem("token")) {
    return next()
  } else {
    return next({
      name: "login"
    })
  }
})

export default router
