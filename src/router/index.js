import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';

Vue.use(VueRouter)

// const routes = [

// ]

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home },
  ]
})

//全局  前置路由守护  用于验证权限
router.beforeEach((to, from, next) => {
  //     //判断逻辑 可以用于权限验证
  if (to.path === '/login') {
    next();
  } else {
    const token = sessionStorage.getItem('token');
    // console.log('token:', token)
    if (!token) {
      next('/login')
      // console.log('重定向/login');
    } else {
      // console.log('logined');
      next();
    }
  }
})

export default router
