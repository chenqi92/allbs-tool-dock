<template>
  <div class="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 工具头部 -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 shadow-soft">
      <div class="flex items-center gap-4 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
            <div class="i-carbon-time text-white text-xl"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">时间戳转换</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Unix时间戳与日期时间互相转换</p>
          </div>
        </div>
        
        <div class="ml-auto flex items-center gap-2">
          <button
            @click="getCurrentTimestamp"
            class="btn-primary text-sm"
          >
            <div class="i-carbon-time mr-2"></div>
            当前时间
          </button>
          <button
            @click="clearAll"
            class="btn-ghost text-sm"
          >
            <div class="i-carbon-clean mr-2"></div>
            清空
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="flex-1 p-4 overflow-auto">
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- 当前时间显示 -->
        <div class="card p-6 text-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">当前时间</h2>
          <div class="text-3xl font-mono text-primary-600 mb-2">{{ currentTime }}</div>
          <div class="text-lg text-gray-600 dark:text-gray-400">{{ currentTimestamp }}</div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 时间戳转日期 -->
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">时间戳转日期</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unix时间戳
                </label>
                <div class="flex gap-2">
                  <input
                    v-model="timestampInput"
                    type="text"
                    placeholder="输入Unix时间戳..."
                    class="flex-1 input-base font-mono"
                    @input="convertTimestampToDate"
                  />
                  <select
                    v-model="timestampUnit"
                    class="input-base"
                    @change="convertTimestampToDate"
                  >
                    <option value="seconds">秒</option>
                    <option value="milliseconds">毫秒</option>
                  </select>
                </div>
              </div>

              <div v-if="convertedDate" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    本地时间
                  </label>
                  <div class="code-block p-3">
                    <code class="text-sm">{{ convertedDate.local }}</code>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    UTC时间
                  </label>
                  <div class="code-block p-3">
                    <code class="text-sm">{{ convertedDate.utc }}</code>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ISO 8601
                  </label>
                  <div class="code-block p-3">
                    <code class="text-sm">{{ convertedDate.iso }}</code>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button
                    @click="copyDate(convertedDate.local)"
                    class="btn-ghost text-sm flex-1"
                  >
                    <div class="i-carbon-copy mr-1"></div>
                    复制本地时间
                  </button>
                  <button
                    @click="copyDate(convertedDate.iso)"
                    class="btn-ghost text-sm flex-1"
                  >
                    <div class="i-carbon-copy mr-1"></div>
                    复制ISO格式
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 日期转时间戳 -->
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">日期转时间戳</h2>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  日期时间
                </label>
                <input
                  v-model="dateInput"
                  type="datetime-local"
                  class="w-full input-base"
                  @input="convertDateToTimestamp"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  或输入日期字符串
                </label>
                <input
                  v-model="dateStringInput"
                  type="text"
                  placeholder="例如: 2024-01-15 10:30:00"
                  class="w-full input-base"
                  @input="convertDateStringToTimestamp"
                />
                <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  支持多种格式: YYYY-MM-DD HH:mm:ss, ISO 8601等
                </div>
              </div>

              <div v-if="convertedTimestamp" class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unix时间戳 (秒)
                  </label>
                  <div class="code-block p-3">
                    <code class="text-sm font-mono">{{ convertedTimestamp.seconds }}</code>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unix时间戳 (毫秒)
                  </label>
                  <div class="code-block p-3">
                    <code class="text-sm font-mono">{{ convertedTimestamp.milliseconds }}</code>
                  </div>
                </div>

                <div class="flex gap-2">
                  <button
                    @click="copyTimestamp(convertedTimestamp.seconds)"
                    class="btn-ghost text-sm flex-1"
                  >
                    <div class="i-carbon-copy mr-1"></div>
                    复制秒级
                  </button>
                  <button
                    @click="copyTimestamp(convertedTimestamp.milliseconds)"
                    class="btn-ghost text-sm flex-1"
                  >
                    <div class="i-carbon-copy mr-1"></div>
                    复制毫秒级
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 常用时间戳 -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">常用时间戳</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="preset in presetTimestamps"
              :key="preset.name"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              @click="usePreset(preset)"
            >
              <div class="font-medium text-gray-900 dark:text-white">{{ preset.name }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 font-mono">{{ preset.timestamp }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-500">{{ preset.date }}</div>
            </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface ConvertedDate {
  local: string
  utc: string
  iso: string
}

interface ConvertedTimestamp {
  seconds: string
  milliseconds: string
}

interface PresetTimestamp {
  name: string
  timestamp: string
  date: string
}

const timestampInput = ref('')
const timestampUnit = ref('seconds')
const dateInput = ref('')
const dateStringInput = ref('')
const error = ref<string | null>(null)
const currentTime = ref('')
const currentTimestamp = ref('')

const convertedDate = ref<ConvertedDate | null>(null)
const convertedTimestamp = ref<ConvertedTimestamp | null>(null)

const presetTimestamps = ref<PresetTimestamp[]>([
  { name: 'Unix纪元', timestamp: '0', date: '1970-01-01 00:00:00 UTC' },
  { name: 'Y2K', timestamp: '946684800', date: '2000-01-01 00:00:00 UTC' },
  { name: '2038年问题', timestamp: '2147483647', date: '2038-01-19 03:14:07 UTC' }
])

let timeInterval: number | null = null

// 更新当前时间
function updateCurrentTime() {
  const now = new Date()
  currentTime.value = now.toLocaleString()
  currentTimestamp.value = Math.floor(now.getTime() / 1000).toString()
}

// 获取当前时间戳
function getCurrentTimestamp() {
  const now = Math.floor(Date.now() / 1000)
  timestampInput.value = now.toString()
  convertTimestampToDate()
}

// 时间戳转日期
function convertTimestampToDate() {
  try {
    error.value = null
    if (!timestampInput.value.trim()) {
      convertedDate.value = null
      return
    }

    let timestamp = parseInt(timestampInput.value)
    if (isNaN(timestamp)) {
      throw new Error('无效的时间戳格式')
    }

    // 根据单位转换
    if (timestampUnit.value === 'seconds') {
      timestamp = timestamp * 1000
    }

    const date = new Date(timestamp)
    if (isNaN(date.getTime())) {
      throw new Error('无效的时间戳')
    }

    convertedDate.value = {
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      iso: date.toISOString()
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '转换失败'
    convertedDate.value = null
  }
}

// 日期转时间戳
function convertDateToTimestamp() {
  try {
    error.value = null
    if (!dateInput.value) {
      convertedTimestamp.value = null
      return
    }

    const date = new Date(dateInput.value)
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期格式')
    }

    const timestamp = date.getTime()
    convertedTimestamp.value = {
      seconds: Math.floor(timestamp / 1000).toString(),
      milliseconds: timestamp.toString()
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '转换失败'
    convertedTimestamp.value = null
  }
}

// 日期字符串转时间戳
function convertDateStringToTimestamp() {
  try {
    error.value = null
    if (!dateStringInput.value.trim()) {
      convertedTimestamp.value = null
      return
    }

    const date = new Date(dateStringInput.value)
    if (isNaN(date.getTime())) {
      throw new Error('无效的日期格式')
    }

    const timestamp = date.getTime()
    convertedTimestamp.value = {
      seconds: Math.floor(timestamp / 1000).toString(),
      milliseconds: timestamp.toString()
    }

    // 同步到datetime-local输入框
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`
  } catch (err) {
    error.value = err instanceof Error ? err.message : '转换失败'
    convertedTimestamp.value = null
  }
}

// 使用预设时间戳
function usePreset(preset: PresetTimestamp) {
  timestampInput.value = preset.timestamp
  timestampUnit.value = 'seconds'
  convertTimestampToDate()
}

// 复制日期
async function copyDate(date: string) {
  try {
    await navigator.clipboard.writeText(date)
  } catch (err) {
    error.value = '复制失败'
  }
}

// 复制时间戳
async function copyTimestamp(timestamp: string) {
  try {
    await navigator.clipboard.writeText(timestamp)
  } catch (err) {
    error.value = '复制失败'
  }
}

// 清空所有
function clearAll() {
  timestampInput.value = ''
  dateInput.value = ''
  dateStringInput.value = ''
  convertedDate.value = null
  convertedTimestamp.value = null
  error.value = null
}

onMounted(() => {
  updateCurrentTime()
  timeInterval = setInterval(updateCurrentTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>
