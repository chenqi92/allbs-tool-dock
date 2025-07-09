<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="card-glass p-6 w-96 max-w-full mx-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          <div class="i-carbon-server mr-2 inline-block"></div>
          启动TCP服务端
        </h2>
        <button
          @click="$emit('update:show', false)"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <div class="i-carbon-close text-xl"></div>
        </button>
      </div>

      <form @submit.prevent="handleStart" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            监听端口
          </label>
          <input
            v-model.number="form.port"
            type="number"
            placeholder="8080"
            min="1"
            max="65535"
            class="input-base w-full"
            required
          />
          <p class="text-xs text-muted mt-1">
            服务器将在所有网络接口 (0.0.0.0) 上监听此端口
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            最大连接数
          </label>
          <input
            v-model.number="form.maxConnections"
            type="number"
            placeholder="100"
            min="1"
            max="1000"
            class="input-base w-full"
          />
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="form.autoAccept"
            type="checkbox"
            id="autoAccept"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label for="autoAccept" class="text-sm text-gray-700 dark:text-gray-300">
            自动接受连接
          </label>
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="form.logConnections"
            type="checkbox"
            id="logConnections"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label for="logConnections" class="text-sm text-gray-700 dark:text-gray-300">
            记录连接日志
          </label>
        </div>

        <div class="flex gap-2 pt-4">
          <button
            type="submit"
            class="btn-success flex-1"
            :disabled="loading"
          >
            <div v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></div>
            <div v-else class="i-carbon-server mr-2"></div>
            {{ loading ? '启动中...' : '启动服务器' }}
          </button>
          <button
            type="button"
            @click="$emit('update:show', false)"
            class="btn-secondary"
          >
            取消
          </button>
        </div>
      </form>

      <!-- 常用端口 -->
      <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">常用端口</h3>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="port in commonPorts"
            :key="port.port"
            @click="form.port = port.port"
            class="btn-ghost text-xs p-2"
            :title="port.description"
          >
            {{ port.port }}
          </button>
        </div>
      </div>

      <!-- 端口状态检查 -->
      <div class="mt-4">
        <button
          @click="checkPortStatus"
          class="btn-ghost text-sm w-full"
          :disabled="checkingPort"
        >
          <div v-if="checkingPort" class="i-carbon-circle-dash animate-spin mr-2"></div>
          <div v-else class="i-carbon-search mr-2"></div>
          检查端口状态
        </button>
        
        <div v-if="portStatus" class="mt-2 text-sm">
          <div 
            class="flex items-center gap-2"
            :class="portStatus.available ? 'text-success' : 'text-danger'"
          >
            <div :class="portStatus.available ? 'i-carbon-checkmark' : 'i-carbon-warning'"></div>
            {{ portStatus.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface ServerConfig {
  port: number
  maxConnections: number
  autoAccept: boolean
  logConnections: boolean
}

interface PortInfo {
  port: number
  description: string
}

interface PortStatus {
  available: boolean
  message: string
}

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'start': [config: ServerConfig]
}>()

const loading = ref(false)
const checkingPort = ref(false)
const portStatus = ref<PortStatus | null>(null)

const form = reactive<ServerConfig>({
  port: 8080,
  maxConnections: 100,
  autoAccept: true,
  logConnections: true
})

const commonPorts: PortInfo[] = [
  { port: 8080, description: 'HTTP 备用端口' },
  { port: 8000, description: '开发服务器' },
  { port: 3000, description: 'Node.js 开发' },
  { port: 5000, description: 'Flask 默认' },
  { port: 9000, description: '通用服务' },
  { port: 1234, description: '测试端口' }
]

async function checkPortStatus() {
  checkingPort.value = true
  portStatus.value = null
  
  try {
    // 这里可以调用后端API检查端口状态
    // 暂时模拟检查
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟结果
    const isAvailable = Math.random() > 0.3
    portStatus.value = {
      available: isAvailable,
      message: isAvailable 
        ? `端口 ${form.port} 可用` 
        : `端口 ${form.port} 已被占用`
    }
  } catch (error) {
    portStatus.value = {
      available: false,
      message: '检查端口状态失败'
    }
  } finally {
    checkingPort.value = false
  }
}

async function handleStart() {
  loading.value = true
  try {
    emit('start', { ...form })
  } finally {
    loading.value = false
  }
}
</script>
