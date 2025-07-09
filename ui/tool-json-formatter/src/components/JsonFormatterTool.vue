<template>
  <div class="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 工具头部 -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 shadow-soft">
      <div class="flex items-center gap-4 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
            <div class="i-carbon-code text-white text-xl"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">JSON 格式化</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">JSON美化、压缩、验证工具</p>
          </div>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <button
            @click="formatJson"
            class="btn-primary text-sm"
            :disabled="!inputJson.trim()"
          >
            <div class="i-carbon-code mr-2"></div>
            格式化
          </button>
          <button
            @click="compressJson"
            class="btn-secondary text-sm"
            :disabled="!inputJson.trim()"
          >
            <div class="i-carbon-compress mr-2"></div>
            压缩
          </button>
          <button
            @click="validateJson"
            class="btn-ghost text-sm"
            :disabled="!inputJson.trim()"
          >
            <div class="i-carbon-checkmark mr-2"></div>
            验证
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="flex-1 p-4 overflow-hidden">
      <div class="h-full flex gap-4">
        <!-- 输入区域 -->
        <div class="flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">输入 JSON</h2>
            <div class="flex items-center gap-2">
              <button
                @click="clearInput"
                class="btn-ghost text-sm"
              >
                <div class="i-carbon-clean mr-1"></div>
                清空
              </button>
              <button
                @click="loadSample"
                class="btn-ghost text-sm"
              >
                <div class="i-carbon-document mr-1"></div>
                示例
              </button>
            </div>
          </div>

          <textarea
            v-model="inputJson"
            placeholder="在此输入或粘贴 JSON 数据..."
            class="flex-1 textarea-base font-mono text-sm resize-none"
            @input="onInputChange"
          ></textarea>

          <!-- 输入状态 -->
          <div class="mt-2 flex items-center justify-between text-sm">
            <div class="flex items-center gap-4">
              <span class="text-gray-500 dark:text-gray-400">
                字符数: {{ inputJson.length }}
              </span>
              <span class="text-gray-500 dark:text-gray-400">
                行数: {{ inputJson.split('\n').length }}
              </span>
            </div>
            <div v-if="validationResult" class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full"
                :class="validationResult.valid ? 'bg-success-500' : 'bg-danger-500'"
              ></div>
              <span :class="validationResult.valid ? 'text-success-600' : 'text-danger-600'">
                {{ validationResult.valid ? '有效 JSON' : '无效 JSON' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 输出区域 -->
        <div class="flex-1 flex flex-col">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">输出结果</h2>
            <div class="flex items-center gap-2">
              <button
                @click="copyOutput"
                class="btn-ghost text-sm"
                :disabled="!outputJson"
              >
                <div class="i-carbon-copy mr-1"></div>
                复制
              </button>
              <button
                @click="downloadJson"
                class="btn-ghost text-sm"
                :disabled="!outputJson"
              >
                <div class="i-carbon-download mr-1"></div>
                下载
              </button>
            </div>
          </div>

          <div class="flex-1 code-block overflow-auto">
            <pre v-if="outputJson" class="text-sm"><code>{{ outputJson }}</code></pre>
            <div v-else class="flex-col-center h-full text-gray-400">
              <div class="i-carbon-code text-4xl mb-2 opacity-50"></div>
              <p>格式化后的 JSON 将显示在这里</p>
            </div>
          </div>

          <!-- 输出状态 -->
          <div v-if="outputJson" class="mt-2 flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">
              输出字符数: {{ outputJson.length }}
            </span>
            <span v-if="compressionRatio" class="text-primary-600">
              压缩率: {{ compressionRatio }}%
            </span>
          </div>
        </div>
      </div>
    </main>

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="fixed bottom-4 right-4 bg-danger-500 text-white p-4 rounded-lg shadow-lg max-w-sm z-50"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm">{{ error }}</span>
        <button
          @click="error = null"
          class="ml-2 text-white hover:text-gray-200"
        >
          <div class="i-carbon-close"></div>
        </button>
      </div>
    </div>
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
import { ref, computed } from 'vue'

interface ValidationResult {
  valid: boolean
  error?: string
}

const inputJson = ref('')
const outputJson = ref('')
const error = ref<string | null>(null)
const validationResult = ref<ValidationResult | null>(null)

// 计算压缩率
const compressionRatio = computed(() => {
  if (!inputJson.value || !outputJson.value) return null
  const originalSize = inputJson.value.length
  const compressedSize = outputJson.value.length
  if (originalSize === 0) return null
  return Math.round(((originalSize - compressedSize) / originalSize) * 100)
})

// 格式化JSON
function formatJson() {
  try {
    error.value = null
    if (!inputJson.value.trim()) {
      error.value = '请输入JSON数据'
      return
    }

    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed, null, 2)
    validationResult.value = { valid: true }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'JSON格式错误'
    validationResult.value = {
      valid: false,
      error: err instanceof Error ? err.message : 'JSON格式错误'
    }
  }
}

// 压缩JSON
function compressJson() {
  try {
    error.value = null
    if (!inputJson.value.trim()) {
      error.value = '请输入JSON数据'
      return
    }

    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed)
    validationResult.value = { valid: true }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'JSON格式错误'
    validationResult.value = {
      valid: false,
      error: err instanceof Error ? err.message : 'JSON格式错误'
    }
  }
}

// 验证JSON
function validateJson() {
  try {
    error.value = null
    if (!inputJson.value.trim()) {
      error.value = '请输入JSON数据'
      return
    }

    JSON.parse(inputJson.value)
    validationResult.value = { valid: true }
    error.value = null
  } catch (err) {
    validationResult.value = {
      valid: false,
      error: err instanceof Error ? err.message : 'JSON格式错误'
    }
    error.value = err instanceof Error ? err.message : 'JSON格式错误'
  }
}

// 输入变化时自动验证
function onInputChange() {
  if (inputJson.value.trim()) {
    validateJson()
  } else {
    validationResult.value = null
    outputJson.value = ''
  }
}

// 清空输入
function clearInput() {
  inputJson.value = ''
  outputJson.value = ''
  validationResult.value = null
  error.value = null
}

// 加载示例数据
function loadSample() {
  inputJson.value = `{
  "name": "张三",
  "age": 30,
  "city": "北京",
  "hobbies": ["读书", "游泳", "编程"],
  "address": {
    "street": "中关村大街",
    "number": 123,
    "zipcode": "100080"
  },
  "isActive": true,
  "lastLogin": "2024-01-15T10:30:00Z"
}`
  onInputChange()
}

// 复制输出
async function copyOutput() {
  if (!outputJson.value) return

  try {
    await navigator.clipboard.writeText(outputJson.value)
    // 这里可以添加成功提示
  } catch (err) {
    error.value = '复制失败'
  }
}

// 下载JSON文件
function downloadJson() {
  if (!outputJson.value) return

  const blob = new Blob([outputJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `formatted-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
