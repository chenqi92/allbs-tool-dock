<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 主布局 -->
    <div class="flex h-screen">
      <!-- 侧边栏 -->
      <aside class="w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200/60 dark:border-gray-700/60 shadow-soft">
        <!-- Logo区域 -->
        <div class="p-6 border-b border-gray-200/60 dark:border-gray-700/60">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
              <div class="i-carbon-tools text-white text-xl"></div>
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                KKAPE Gearbox
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">工具集合平台</p>
            </div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <nav class="p-4">
          <ul class="space-y-2">
            <li>
              <router-link
                to="/"
                class="nav-item"
                :class="$route.path === '/' ? 'nav-item-active' : ''"
              >
                <div class="i-carbon-home text-lg"></div>
                <span>首页</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/plugins"
                class="nav-item"
                :class="$route.path === '/plugins' ? 'nav-item-active' : ''"
              >
                <div class="i-carbon-plug text-lg"></div>
                <span>插件管理</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/settings"
                class="nav-item"
                :class="$route.path === '/settings' ? 'nav-item-active' : ''"
              >
                <div class="i-carbon-settings text-lg"></div>
                <span>设置</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/style-demo"
                class="nav-item"
                :class="$route.path === '/style-demo' ? 'nav-item-active' : ''"
              >
                <div class="i-carbon-color-palette text-lg"></div>
                <span>样式演示</span>
              </router-link>
            </li>
            <li>
              <router-link
                to="/debug"
                class="nav-item"
                :class="$route.path === '/debug' ? 'nav-item-active' : ''"
              >
                <div class="i-carbon-debug text-lg"></div>
                <span>调试信息</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 overflow-auto bg-transparent">
        <router-view v-slot="{ Component }">
          <transition
            name="page"
            mode="out-in"
            enter-active-class="animate-fade-in animate-slide-up"
            leave-active-class="animate-fade-out"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAppStore } from './stores/app'

const appStore = useAppStore()

onMounted(() => {
  // 初始化应用
  appStore.initialize()
})
</script>

<style>
/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
