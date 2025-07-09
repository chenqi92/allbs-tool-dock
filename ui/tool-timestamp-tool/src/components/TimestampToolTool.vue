<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- 工具头部 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            Timestamp Tool
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            timestamp-tool 工具界面
          </p>
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="refreshData"
            class="btn-secondary text-sm"
            :disabled="loading"
          >
            <div class="i-carbon-refresh mr-2"></div>
            刷新
          </button>
        </div>
      </div>
    </header>

    <!-- 工具内容 -->
    <main class="flex-1 overflow-auto p-6">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex-center h-64">
        <div class="animate-spin i-carbon-circle-dash text-4xl text-primary-600"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="flex-col-center h-64">
        <div class="i-carbon-warning text-6xl text-red-500 mb-4"></div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          出现错误
        </h2>
        <p class="text-gray-600 dark:text-gray-400 text-center mb-4">
          {{ error }}
        </p>
        <button @click="refreshData" class="btn-primary">
          重试
        </button>
      </div>

      <!-- 主要内容 -->
      <div v-else class="space-y-6">
        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card p-6">
            <div class="flex items-center">
              <div class="i-carbon-data-1 text-3xl text-blue-600 mr-4"></div>
              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ stats.total }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">总数</p>
              </div>
            </div>
          </div>
          
          <div class="card p-6">
            <div class="flex items-center">
              <div class="i-carbon-checkmark-filled text-3xl text-green-600 mr-4"></div>
              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ stats.success }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">成功</p>
              </div>
            </div>
          </div>
          
          <div class="card p-6">
            <div class="flex items-center">
              <div class="i-carbon-warning text-3xl text-yellow-600 mr-4"></div>
              <div>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ stats.pending }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400">待处理</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作区域 -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            操作面板
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              @click="performAction('action1')"
              class="btn-primary"
              :disabled="loading"
            >
              执行操作 1
            </button>
            
            <button
              @click="performAction('action2')"
              class="btn-secondary"
              :disabled="loading"
            >
              执行操作 2
            </button>
          </div>
        </div>

        <!-- 数据展示 -->
        <div class="card">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              数据列表
            </h2>
          </div>
          
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="item in data"
              :key="item.id"
              class="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ item.name }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ item.description }}
                  </p>
                </div>
                
                <div class="flex items-center space-x-2">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="getStatusClass(item.status)"
                  >
                    {{ item.status }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="data.length === 0" class="p-12 text-center">
              <div class="i-carbon-document text-6xl text-gray-400 mx-auto mb-4"></div>
              <p class="text-lg text-gray-600 dark:text-gray-400">暂无数据</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { invoke } from '@tauri-apps/api/core'

interface DataItem {
  id: string
  name: string
  description: string
  status: string
}

interface Stats {
  total: number
  success: number
  pending: number
}

const loading = ref(false)
const error = ref<string | null>(null)
const data = ref<DataItem[]>([])
const stats = ref<Stats>({
  total: 0,
  success: 0,
  pending: 0
})

async function refreshData() {
  try {
    loading.value = true
    error.value = null
    
    // 调用后端 API
    const result = await invoke('plugin:timestamp-tool|get_config')
    console.log('timestamp-tool config:', result)
    
    // 模拟数据
    data.value = [
      {
        id: '1',
        name: '示例项目 1',
        description: '这是一个示例项目',
        status: 'success'
      },
      {
        id: '2',
        name: '示例项目 2',
        description: '这是另一个示例项目',
        status: 'pending'
      }
    ]
    
    stats.value = {
      total: data.value.length,
      success: data.value.filter(item => item.status === 'success').length,
      pending: data.value.filter(item => item.status === 'pending').length
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载数据失败'
    console.error('Failed to load timestamp-tool data:', err)
  } finally {
    loading.value = false
  }
}

async function performAction(action: string) {
  try {
    loading.value = true
    const result = await invoke('plugin:timestamp-tool|timestampTool_action', {
      data: action
    })
    console.log('Action result:', result)
    await refreshData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : `执行 ${action} 失败`
    console.error(`Failed to perform action ${action}:`, err)
  } finally {
    loading.value = false
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

onMounted(() => {
  refreshData()
})
</script>
