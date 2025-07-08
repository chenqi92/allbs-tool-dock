<template>
  <div class="p-6">
    <!-- 头部 -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        设置
      </h1>
      <p class="text-lg text-muted">
        配置应用程序的行为和外观
      </p>
    </header>

    <!-- 设置面板 -->
    <div class="max-w-2xl">
      <!-- 外观设置 -->
      <div class="card p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          外观设置
        </h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              主题
            </label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="theme in themes"
                :key="theme.value"
                @click="appStore.settings.theme = theme.value"
                class="p-3 rounded-lg border-2 transition-colors"
                :class="appStore.settings.theme === theme.value 
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'"
              >
                <div :class="theme.icon" class="text-2xl mb-2"></div>
                <div class="text-sm font-medium">{{ theme.label }}</div>
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              语言
            </label>
            <select
              v-model="appStore.settings.language"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 应用设置 -->
      <div class="card p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          应用设置
        </h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                自动更新
              </div>
              <div class="text-sm text-muted">
                自动检查并安装应用更新
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="appStore.settings.autoUpdate"
                type="checkbox"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                桌面通知
              </div>
              <div class="text-sm text-muted">
                显示系统通知消息
              </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                v-model="appStore.settings.notifications"
                type="checkbox"
                class="sr-only peer"
              >
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      <!-- 关于 -->
      <div class="card p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          关于
        </h2>
        
        <div v-if="appStore.appInfo" class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-muted">应用名称</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ appStore.appInfo.name }}
            </span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-sm text-muted">版本</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ appStore.appInfo.version }}
            </span>
          </div>
          
          <div class="flex justify-between">
            <span class="text-sm text-muted">描述</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ appStore.appInfo.description }}
            </span>
          </div>
        </div>
        
        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button class="btn-secondary text-sm">
            检查更新
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/app'

const appStore = useAppStore()

const themes = [
  {
    value: 'light',
    label: '浅色',
    icon: 'i-carbon-sun'
  },
  {
    value: 'dark',
    label: '深色',
    icon: 'i-carbon-moon'
  },
  {
    value: 'auto',
    label: '自动',
    icon: 'i-carbon-settings'
  }
]
</script>
