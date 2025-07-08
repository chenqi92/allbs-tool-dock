<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 主布局 -->
    <div class="flex h-screen">
      <!-- 侧边栏 -->
      <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div class="p-6">
          <h1 class="text-xl font-bold text-gray-900 dark:text-white">
            KKAPE Gearbox
          </h1>
          <p class="text-sm text-muted mt-1">工具集合平台</p>
        </div>
        
        <nav class="px-4">
          <ul class="space-y-2">
            <li>
              <router-link
                to="/"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="$route.path === '/' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'"
              >
                <div class="i-carbon-home mr-3"></div>
                首页
              </router-link>
            </li>
            <li>
              <router-link
                to="/plugins"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="$route.path === '/plugins' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'"
              >
                <div class="i-carbon-plug mr-3"></div>
                插件管理
              </router-link>
            </li>
            <li>
              <router-link
                to="/settings"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                :class="$route.path === '/settings' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'"
              >
                <div class="i-carbon-settings mr-3"></div>
                设置
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 overflow-auto">
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
            enter-active-class="animate-fade-in"
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
