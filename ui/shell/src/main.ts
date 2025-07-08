import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { MotionPlugin } from '@vueuse/motion'

import App from './App.vue'
import { routes } from './router/index'

// UnoCSS
import 'virtual:uno.css'

// 创建路由
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 创建应用
const app = createApp(App)

// 安装插件
app.use(createPinia())
app.use(router)
app.use(MotionPlugin)

// 挂载应用
app.mount('#app')
