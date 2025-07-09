<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="card-glass p-6 w-96 max-w-full mx-4">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          <div class="i-carbon-connect mr-2 inline-block"></div>
          客户端连接
        </h2>
        <button
          @click="$emit('update:show', false)"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <div class="i-carbon-close text-xl"></div>
        </button>
      </div>

      <form @submit.prevent="handleConnect" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            主机地址
          </label>
          <input
            v-model="form.host"
            type="text"
            placeholder="127.0.0.1"
            class="input-base w-full"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            端口号
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
        </div>

        <div class="flex items-center gap-2">
          <input
            v-model="form.autoReconnect"
            type="checkbox"
            id="autoReconnect"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label for="autoReconnect" class="text-sm text-gray-700 dark:text-gray-300">
            自动重连
          </label>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            连接超时 (毫秒)
          </label>
          <input
            v-model.number="form.timeout"
            type="number"
            placeholder="5000"
            min="1000"
            max="60000"
            class="input-base w-full"
          />
        </div>

        <div class="flex gap-2 pt-4">
          <button
            type="submit"
            class="btn-primary flex-1"
            :disabled="loading"
          >
            <div v-if="loading" class="i-carbon-circle-dash animate-spin mr-2"></div>
            <div v-else class="i-carbon-connect mr-2"></div>
            {{ loading ? '连接中...' : '连接' }}
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

      <!-- 快速连接模板 -->
      <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">快速连接</h3>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="template in quickTemplates"
            :key="template.name"
            @click="applyTemplate(template)"
            class="btn-ghost text-xs p-2"
          >
            {{ template.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface ConnectConfig {
  host: string
  port: number
  autoReconnect: boolean
  timeout: number
}

interface QuickTemplate {
  name: string
  host: string
  port: number
}

defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  'connect': [config: ConnectConfig]
}>()

const loading = ref(false)

const form = reactive<ConnectConfig>({
  host: '127.0.0.1',
  port: 8080,
  autoReconnect: false,
  timeout: 5000
})

const quickTemplates: QuickTemplate[] = [
  { name: 'HTTP', host: '127.0.0.1', port: 80 },
  { name: 'HTTPS', host: '127.0.0.1', port: 443 },
  { name: 'FTP', host: '127.0.0.1', port: 21 },
  { name: 'SSH', host: '127.0.0.1', port: 22 },
  { name: 'Telnet', host: '127.0.0.1', port: 23 },
  { name: 'SMTP', host: '127.0.0.1', port: 25 }
]

function applyTemplate(template: QuickTemplate) {
  form.host = template.host
  form.port = template.port
}

async function handleConnect() {
  loading.value = true
  try {
    emit('connect', { ...form })
  } finally {
    loading.value = false
  }
}
</script>
