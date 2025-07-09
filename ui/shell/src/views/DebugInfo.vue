<template>
  <div class="p-8">
    <div class="max-w-4xl mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          调试信息
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          查看应用运行环境和状态信息
        </p>
      </header>

      <!-- 环境信息 -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">环境信息</h2>
        <div class="card p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">运行环境:</span>
              <p class="text-lg font-semibold" :class="envInfo.isTauri ? 'text-success-600' : 'text-warning-600'">
                {{ envInfo.isTauri ? 'Tauri 桌面应用' : 'Web 浏览器' }}
              </p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">开发模式:</span>
              <p class="text-lg font-semibold" :class="envInfo.isDev ? 'text-primary-600' : 'text-gray-600'">
                {{ envInfo.isDev ? '开发环境' : '生产环境' }}
              </p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">构建模式:</span>
              <p class="text-lg">{{ envInfo.mode }}</p>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500 dark:text-gray-400">基础URL:</span>
              <p class="text-lg font-mono">{{ envInfo.baseUrl }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 应用状态 -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">应用状态</h2>
        <div class="card p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 mb-2">
                {{ appStore.availableTools.length }}
              </div>
              <p class="text-gray-600 dark:text-gray-400">可用工具</p>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-success-600 mb-2">
                {{ appStore.loadedPlugins.length }}
              </div>
              <p class="text-gray-600 dark:text-gray-400">已加载插件</p>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold mb-2" :class="appStore.loading ? 'text-warning-600' : 'text-gray-600'">
                {{ appStore.loading ? '加载中' : '就绪' }}
              </div>
              <p class="text-gray-600 dark:text-gray-400">应用状态</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 插件列表 -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">插件详情</h2>
        <div class="space-y-4">
          <div
            v-for="plugin in appStore.plugins"
            :key="plugin.id"
            class="card p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ plugin.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ plugin.description }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-500">版本: {{ plugin.version }}</p>
              </div>
              <div class="text-right">
                <div
                  class="px-3 py-1 rounded-full text-xs font-medium mb-2"
                  :class="getStatusClass(plugin.status)"
                >
                  {{ plugin.status }}
                </div>
                <div class="flex items-center gap-2">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="plugin.enabled ? 'bg-success-500' : 'bg-gray-400'"
                  ></div>
                  <span class="text-xs text-gray-500">
                    {{ plugin.enabled ? '已启用' : '已禁用' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="appStore.plugins.length === 0" class="card p-8 text-center">
            <div class="text-gray-400 mb-2">
              <div class="i-carbon-plug text-4xl mx-auto mb-2"></div>
              <p>暂无插件数据</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 错误信息 -->
      <section v-if="appStore.error" class="mb-8">
        <h2 class="text-xl font-semibold text-red-600 mb-4">错误信息</h2>
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p class="text-red-800 dark:text-red-200">{{ appStore.error }}</p>
        </div>
      </section>

      <!-- 操作按钮 -->
      <section>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">操作</h2>
        <div class="flex flex-wrap gap-4">
          <button
            @click="appStore.initialize()"
            class="btn-primary"
            :disabled="appStore.loading"
          >
            <div v-if="appStore.loading" class="i-carbon-circle-dash animate-spin mr-2"></div>
            重新初始化
          </button>
          <button
            @click="appStore.loadPlugins()"
            class="btn-secondary"
            :disabled="appStore.loading"
          >
            刷新插件列表
          </button>
          <button
            @click="clearError"
            class="btn-ghost"
            v-if="appStore.error"
          >
            清除错误
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/app'
import { getEnvInfo } from '../utils/env'

const appStore = useAppStore()
const envInfo = getEnvInfo()

function getStatusClass(status: string) {
  switch (status) {
    case 'Loaded':
      return 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400'
    case 'Loading':
      return 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400'
    case 'Error':
      return 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

function clearError() {
  appStore.error = null
}
</script>
