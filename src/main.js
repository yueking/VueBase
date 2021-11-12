import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

import axios from 'axios'
//配置请求跟路径
// axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
//请求拦截器 请求头添加 token
axios.interceptors.request.use((config) => {
  // console.log(config)
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app')
