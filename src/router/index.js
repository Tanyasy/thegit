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
        component: () => import('../views/Car'),
        meta: {title: "首页"},
      }
    ]
  },
  {
    path: '/data',
    redirect: "/data/car",
    name: 'car',
    component: Home,
    meta: {title: "数据管理", icon: "el-icon-menu"},
    children: [
      {
        path: '/data/car',
        name: 'car',
        meta: {title: "车辆信息"},
        component: () => import('../views/CarInfoManage'),
      },
      // {
      //   path: '/data/user',
      //   name: 'user',
      //   meta: {title: "用户信息"},
      //   component: () => import('../views/Users'),
      // }
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

// router.beforeEach((to, from, next) => {
//   // 去login的路由直接放行，要不会死循环
//   if (to.path === "/home") return next()
//   if (sessionStorage.getItem("token")) {
//     return next()
//   } else {
//     return next({
//       name: "home"
//     })
//   }
// })

export default router
