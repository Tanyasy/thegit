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
    meta: {title: "用户中心", icon: "el-icon-user-solid"},
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
        // 设置props为true是，在用push的时候可以用params传递参数给props
        props: true,
        meta: {title: "账单管理"},
        component: () => import('../views/Payment'),
      },
      {
        path: '/user/todoList',
        name: 'todoList',
        // 设置props为true是，在用push的时候可以用params传递参数给props
        props: true,
        meta: {title: "待办事项"},
        component: () => import('../views/TodoList'),
      }
    ]
  },
  {
    path: '/right',
    redirect: "/right/role",
    name: 'right',
    component: Home,
    meta: {title: "权限管理", icon: "el-icon-menu"},
    children: [
      {
        path: '/right/role',
        name: 'role',
        meta: {title: "角色管理"},
        component: () => import('../views/Roles'),
      },
      {
        path: '/right/permission',
        name: 'permission',
        // 设置props为true是，在用push的时候可以用params传递参数给props
        props: true,
        meta: {title: "权限管理"},
        component: () => import('../views/Permissions'),
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
