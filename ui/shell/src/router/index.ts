import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/plugins',
    name: 'Plugins',
    component: () => import('../views/Plugins.vue'),
    meta: {
      title: '插件管理'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: '设置'
    }
  },
  {
    path: '/tool/:toolName',
    name: 'Tool',
    component: () => import('../views/Tool.vue'),
    meta: {
      title: '工具'
    }
  },
  {
    path: '/style-demo',
    name: 'StyleDemo',
    component: () => import('../views/StyleDemo.vue'),
    meta: {
      title: '样式演示'
    }
  },
  {
    path: '/debug',
    name: 'DebugInfo',
    component: () => import('../views/DebugInfo.vue'),
    meta: {
      title: '调试信息'
    }
  }
]
