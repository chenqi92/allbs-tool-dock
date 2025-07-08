<template>
  <div class="h-full flex flex-col">
    <!-- 工具头部 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <button
            @click="$router.back()"
            class="mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="i-carbon-arrow-left text-xl"></div>
          </button>
          
          <div>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ toolInfo?.name || '工具' }}
            </h1>
            <p v-if="toolInfo" class="text-sm text-muted">
              {{ toolInfo.description }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <div
            v-if="toolInfo"
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="getStatusClass(toolInfo.status)"
          >
            {{ getStatusText(toolInfo.status) }}
          </div>
        </div>
      </div>
    </header>

    <!-- 工具内容区 -->
    <main class="flex-1 overflow-hidden">
      <!-- 工具未启用状态 -->
      <div
        v-if="!toolInfo || toolInfo.status !== 'Loaded'"
        class="h-full flex-col-center p-8"
      >
        <div class="i-carbon-warning text-6xl text-yellow-500 mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          工具未启用
        </h2>
        <p class="text-muted text-center mb-6 max-w-md">
          {{ toolName }} 工具尚未启用，请先启用该工具后再使用。
        </p>
        <button
          @click="enableTool"
          class="btn-primary"
          :disabled="appStore.loading"
        >
          启用工具
        </button>
      </div>

      <!-- 工具加载中 -->
      <div
        v-else-if="toolInfo.status === 'Loading'"
        class="h-full flex-col-center p-8"
      >
        <div class="animate-spin i-carbon-circle-dash text-6xl text-primary-600 mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          工具加载中
        </h2>
        <p class="text-muted">
          正在启动 {{ toolName }} 工具...
        </p>
      </div>

      <!-- 工具内容 -->
      <div
        v-else
        class="h-full"
      >
        <!-- 这里将动态加载具体的工具组件 -->
        <component
          :is="toolComponent"
          v-if="toolComponent"
          :tool-name="toolName"
        />
        
        <!-- 默认工具界面 -->
        <div
          v-else
          class="h-full flex-col-center p-8"
        >
          <div class="i-carbon-tools text-6xl text-primary-600 mb-4"></div>
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {{ toolInfo.name }}
          </h2>
          <p class="text-muted text-center mb-6 max-w-md">
            {{ toolInfo.description }}
          </p>
          <p class="text-sm text-muted">
            工具界面正在开发中...
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../stores/app'
import type { Component } from 'vue'

const route = useRoute()
const appStore = useAppStore()

const toolName = computed(() => route.params.toolName as string)
const toolComponent = ref<Component | null>(null)

const toolInfo = computed(() => 
  appStore.availableTools.find(tool => tool.id === toolName.value)
)

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

async function enableTool() {
  if (toolName.value) {
    await appStore.loadPlugin(toolName.value)
  }
}

async function loadToolComponent() {
  try {
    // 动态导入工具组件
    const module = await import(`../components/tools/${toolName.value}.vue`)
    toolComponent.value = module.default
  } catch (error) {
    console.warn(`Tool component not found for ${toolName.value}:`, error)
    toolComponent.value = null
  }
}

onMounted(() => {
  loadToolComponent()
})
</script>
