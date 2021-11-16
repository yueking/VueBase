import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Categories from '../components/Categories.vue'
import Params from '../components/Params.vue'
import Reports from '../components/Reports.vue'
import Orders from '../components/Orders.vue'
import Rights from '../components/authority/Permissions.vue'
import Goods from '../components/Goods.vue'
import Roles from '../components/authority/Roles.vue'
import Users from '../components/users/Users.vue'

Vue.use(VueRouter)

// const routes = [

// ]

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/home/welcome',
      children: [
        {
          path: 'welcome',
          component: Welcome
        },
        {
          path: 'categories',
          component: Categories
        },
        {
          path: 'params',
          component: Params
        },
        {
          path: 'reports',
          component: Reports
        },
        {
          path: 'orders',
          component: Orders
        },
        {
          path: 'rights',
          component: Rights
        },
        {
          path: 'goods',
          component: Goods
        },
        {
          path: 'roles',
          component: Roles
        },
        {
          path: 'users',
          component: Users
        }
      ]
    }
  ]
})

// 全局  前置路由守护  用于验证权限
router.beforeEach((to, from, next) => {
  //     //判断逻辑 可以用于权限验证
  if (to.path === '/login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    // console.log('token:', token)
    if (!token) {
      next('/login')
      // console.log('重定向/login');
    } else {
      // console.log('logined');
      next()
    }
  }
})

export default router
