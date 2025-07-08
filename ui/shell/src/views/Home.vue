<template>
  <div class="p-6">
    <!-- 头部 -->
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        欢迎使用 KKAPE Gearbox
      </h1>
      <p class="text-lg text-muted">
        现代化工具集合平台，让您的工作更高效
      </p>
    </header>

    <!-- 应用信息卡片 -->
    <div v-if="appStore.appInfo" class="card p-6 mb-8">
      <div class="flex items-center">
        <div class="i-carbon-application text-4xl text-primary-600 mr-4"></div>
        <div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
            {{ appStore.appInfo.name }}
          </h2>
          <p class="text-muted">版本 {{ appStore.appInfo.version }}</p>
          <p class="text-sm text-muted mt-1">
            {{ appStore.appInfo.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- 工具网格 -->
    <section>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          可用工具
        </h2>
        <router-link
          to="/plugins"
          class="btn-secondary text-sm"
        >
          管理插件
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="tool in appStore.availableTools"
          :key="tool.id"
          class="card-hover p-6 cursor-pointer"
          @click="handleToolClick(tool)"
        >
          <div class="flex items-start justify-between mb-4">
            <div :class="tool.icon" class="text-3xl text-primary-600"></div>
            <div
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="getStatusClass(tool.status)"
            >
              {{ getStatusText(tool.status) }}
            </div>
          </div>
          
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ tool.name }}
          </h3>
          
          <p class="text-muted text-sm mb-3">
            {{ tool.description }}
          </p>
          
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted">{{ tool.category }}</span>
            <button
              v-if="tool.status === 'Unloaded'"
              @click.stop="loadTool(tool.id)"
              class="btn-primary text-xs px-3 py-1"
              :disabled="appStore.loading"
            >
              启用
            </button>
            <button
              v-else-if="tool.status === 'Loaded'"
              @click.stop="openTool(tool)"
              class="btn-primary text-xs px-3 py-1"
            >
              打开
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 错误提示 -->
    <div
      v-if="appStore.error"
      class="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm">{{ appStore.error }}</span>
        <button
          @click="appStore.clearError()"
          class="ml-2 text-white hover:text-gray-200"
        >
          <div class="i-carbon-close"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../stores/app'
import { useRouter } from 'vue-router'
import type { ToolCard } from '../types'

const appStore = useAppStore()
const router = useRouter()

function getStatusClass(status: string) {
  switch (status) {
    case 'Loaded':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Loading':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
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
    case 'Error':
      return '错误'
    default:
      return '未启用'
  }
}

async function loadTool(toolId: string) {
  await appStore.loadPlugin(toolId)
}

function openTool(tool: ToolCard) {
  if (tool.route) {
    router.push(tool.route)
  }
}

function handleToolClick(tool: ToolCard) {
  if (tool.status === 'Loaded') {
    openTool(tool)
  }
}
</script>
