<template>
  <div class="p-6">
    <!-- 头部 -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        插件管理
      </h1>
      <p class="text-lg text-muted">
        管理和配置您的工具插件
      </p>
    </header>

    <!-- 统计信息 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="i-carbon-plug text-3xl text-blue-600 mr-4"></div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ appStore.plugins.length }}
            </p>
            <p class="text-sm text-muted">总插件数</p>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center">
          <div class="i-carbon-checkmark-filled text-3xl text-green-600 mr-4"></div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ appStore.loadedPlugins.length }}
            </p>
            <p class="text-sm text-muted">已启用</p>
          </div>
        </div>
      </div>
      
      <div class="card p-6">
        <div class="flex items-center">
          <div class="i-carbon-warning text-3xl text-yellow-600 mr-4"></div>
          <div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ errorPlugins.length }}
            </p>
            <p class="text-sm text-muted">错误状态</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 插件列表 -->
    <div class="card">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          插件列表
        </h2>
      </div>
      
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        <div
          v-for="plugin in appStore.plugins"
          :key="plugin.id"
          class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mr-3">
                  {{ plugin.name }}
                </h3>
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(plugin.status)"
                >
                  {{ getStatusText(plugin.status) }}
                </span>
              </div>
              
              <p class="text-muted text-sm mb-2">
                {{ plugin.description }}
              </p>
              
              <div class="flex items-center text-xs text-muted">
                <span>版本 {{ plugin.version }}</span>
                <span class="mx-2">•</span>
                <span>ID: {{ plugin.id.slice(0, 8) }}...</span>
              </div>
            </div>
            
            <div class="flex items-center space-x-2 ml-4">
              <button
                v-if="plugin.status === 'Unloaded'"
                @click="loadPlugin(plugin.name)"
                class="btn-primary text-sm"
                :disabled="appStore.loading"
              >
                启用
              </button>
              
              <button
                v-else-if="plugin.status === 'Loaded'"
                @click="unloadPlugin(plugin.id)"
                class="btn-secondary text-sm"
                :disabled="appStore.loading"
              >
                禁用
              </button>
              
              <button
                v-if="plugin.status === 'Loaded' || plugin.status === 'Error'"
                @click="restartPlugin(plugin.id)"
                class="btn-secondary text-sm"
                :disabled="appStore.loading"
              >
                重启
              </button>
            </div>
          </div>
        </div>
        
        <div
          v-if="appStore.plugins.length === 0"
          class="p-12 text-center"
        >
          <div class="i-carbon-plug text-6xl text-gray-400 mx-auto mb-4"></div>
          <p class="text-lg text-muted">暂无插件</p>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div
      v-if="appStore.loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex-center z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center">
        <div class="animate-spin i-carbon-circle-dash text-2xl text-primary-600 mr-3"></div>
        <span class="text-gray-900 dark:text-white">处理中...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()

const errorPlugins = computed(() =>
  appStore.plugins.filter(p => p.status === 'Error')
)

function getStatusClass(status: string) {
  switch (status) {
    case 'Loaded':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Loading':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'Unloading':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'Error':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'Loaded':
      return '已启用'
    case 'Loading':
      return '加载中'
    case 'Unloading':
      return '卸载中'
    case 'Error':
      return '错误'
    default:
      return '未启用'
  }
}

async function loadPlugin(pluginName: string) {
  await appStore.loadPlugin(pluginName)
}

async function unloadPlugin(pluginId: string) {
  await appStore.unloadPlugin(pluginId)
}

async function restartPlugin(pluginId: string) {
  await appStore.restartPlugin(pluginId)
}
</script>
