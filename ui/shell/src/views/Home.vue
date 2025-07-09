<template>
  <div class="min-h-screen">
    <!-- 头部区域 -->
    <header class="relative overflow-hidden bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 border-b border-gray-200/60 dark:border-gray-700/60">
      <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div class="relative p-8 md:p-12">
        <div class="max-w-4xl">
          <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-primary-600 dark:from-white dark:via-primary-200 dark:to-primary-400 bg-clip-text text-transparent mb-4">
            欢迎使用 KKAPE Gearbox
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl">
            现代化工具集合平台，让您的工作更高效、更智能、更便捷
          </p>

          <!-- 快速统计 -->
          <div class="flex flex-wrap gap-6 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-success-500 rounded-full"></div>
              <span class="text-gray-600 dark:text-gray-400">{{ appStore.availableTools.length }} 个工具可用</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span class="text-gray-600 dark:text-gray-400">{{ appStore.loadedPlugins.length }} 个插件已加载</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-warning-500 rounded-full"></div>
              <span class="text-gray-600 dark:text-gray-400">{{ envInfo.isTauri ? 'Tauri' : 'Web' }} 环境</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="p-6 md:p-8">
      <!-- 应用信息卡片 -->
      <div v-if="appStore.appInfo" class="card-gradient p-6 mb-8 max-w-2xl">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mr-4 shadow-soft">
            <div class="i-carbon-application text-white text-2xl"></div>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ appStore.appInfo.name }}
            </h2>
            <p class="text-gray-600 dark:text-gray-400">版本 {{ appStore.appInfo.version }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
              {{ appStore.appInfo.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- 工具网格 -->
      <section>
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              可用工具
            </h2>
            <p class="text-gray-600 dark:text-gray-400">
              选择一个工具开始您的工作
            </p>
          </div>
          <router-link
            to="/plugins"
            class="btn-secondary"
          >
            <div class="i-carbon-settings mr-2"></div>
            管理插件
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="tool in appStore.availableTools"
            :key="tool.id"
            class="tool-card group"
            @click="handleToolClick(tool)"
          >
            <!-- 工具图标和状态 -->
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300">
                <div :class="tool.icon" class="text-white text-xl"></div>
              </div>
              <div
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(tool.status)"
              >
                {{ getStatusText(tool.status) }}
              </div>
            </div>

            <!-- 工具信息 -->
            <div class="mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ tool.name }}
              </h3>

              <p class="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                {{ tool.description }}
              </p>

              <div class="flex items-center gap-2 mb-3">
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                  {{ tool.category }}
                </span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center justify-between mt-auto">
              <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <div class="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                <span>专业工具</span>
              </div>
              <button
                v-if="tool.status === 'Unloaded'"
                @click.stop="loadTool(tool.id)"
                class="btn-primary text-sm px-4 py-2"
                :disabled="appStore.loading"
              >
                <div v-if="appStore.loading" class="i-carbon-circle-dash animate-spin mr-2"></div>
                启用
              </button>
              <button
                v-else-if="tool.status === 'Loaded'"
                @click.stop="openTool(tool)"
                class="btn-primary text-sm px-4 py-2"
              >
                <div class="i-carbon-launch mr-2"></div>
                打开
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="appStore.availableTools.length === 0" class="col-span-full">
          <div class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <div class="i-carbon-tools text-2xl text-gray-400"></div>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">暂无可用工具</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">请先安装一些工具插件</p>
            <router-link to="/plugins" class="btn-primary">
              <div class="i-carbon-add mr-2"></div>
              安装插件
            </router-link>
          </div>
        </div>
      </section>
    </div>

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
import { onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import { useRouter } from 'vue-router'
import { getEnvInfo } from '../utils/env'
import type { ToolCard } from '../types'

const appStore = useAppStore()
const router = useRouter()
const envInfo = getEnvInfo()

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

// 初始化应用
onMounted(() => {
  appStore.initialize()
})
</script>
