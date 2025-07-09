<template>
  <div class="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 工具头部 -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 shadow-soft">
      <div class="flex items-center gap-4 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
            <div class="i-carbon-transform text-white text-xl"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">Base64 工具</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">Base64编码解码工具</p>
          </div>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <button
            @click="encode"
            class="btn-primary text-sm"
            :disabled="!inputText.trim()"
          >
            <div class="i-carbon-arrow-right mr-2"></div>
            编码
          </button>
          <button
            @click="decode"
            class="btn-secondary text-sm"
            :disabled="!inputText.trim()"
          >
            <div class="i-carbon-arrow-left mr-2"></div>
            解码
          </button>
          <button
            @click="swapInputOutput"
            class="btn-ghost text-sm"
            :disabled="!outputText"
          >
            <div class="i-carbon-arrows-vertical mr-2"></div>
            交换
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
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">输入文本</h2>
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
            v-model="inputText"
            placeholder="在此输入要编码或解码的文本..."
            class="flex-1 textarea-base font-mono text-sm resize-none"
          ></textarea>

          <!-- 输入状态 -->
          <div class="mt-2 flex items-center justify-between text-sm">
            <div class="flex items-center gap-4">
              <span class="text-gray-500 dark:text-gray-400">
                字符数: {{ inputText.length }}
              </span>
              <span class="text-gray-500 dark:text-gray-400">
                字节数: {{ new TextEncoder().encode(inputText).length }}
              </span>
            </div>
            <div v-if="isBase64Valid !== null" class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full"
                :class="isBase64Valid ? 'bg-success-500' : 'bg-warning-500'"
              ></div>
              <span :class="isBase64Valid ? 'text-success-600' : 'text-warning-600'">
                {{ isBase64Valid ? '有效 Base64' : '非 Base64 格式' }}
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
                :disabled="!outputText"
              >
                <div class="i-carbon-copy mr-1"></div>
                复制
              </button>
              <button
                @click="downloadText"
                class="btn-ghost text-sm"
                :disabled="!outputText"
              >
                <div class="i-carbon-download mr-1"></div>
                下载
              </button>
            </div>
          </div>

          <div class="flex-1 code-block overflow-auto">
            <pre v-if="outputText" class="text-sm font-mono whitespace-pre-wrap break-all">{{ outputText }}</pre>
            <div v-else class="flex-col-center h-full text-gray-400">
              <div class="i-carbon-transform text-4xl mb-2 opacity-50"></div>
              <p>编码或解码后的结果将显示在这里</p>
            </div>
          </div>

          <!-- 输出状态 -->
          <div v-if="outputText" class="mt-2 flex items-center justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">
              输出字符数: {{ outputText.length }}
            </span>
            <span v-if="sizeChange" class="text-primary-600">
              大小变化: {{ sizeChange }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const inputText = ref('')
const outputText = ref('')
const error = ref<string | null>(null)
const isBase64Valid = ref<boolean | null>(null)

// 计算大小变化
const sizeChange = computed(() => {
  if (!inputText.value || !outputText.value) return null
  const inputSize = new TextEncoder().encode(inputText.value).length
  const outputSize = new TextEncoder().encode(outputText.value).length
  const diff = outputSize - inputSize
  if (diff > 0) return `+${diff} bytes`
  if (diff < 0) return `${diff} bytes`
  return '无变化'
})

// 监听输入变化，检查是否为Base64格式
watch(inputText, (newValue) => {
  if (!newValue.trim()) {
    isBase64Valid.value = null
    return
  }

  // 简单的Base64格式检查
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
  isBase64Valid.value = base64Regex.test(newValue.trim()) && newValue.length % 4 === 0
})

// Base64编码
function encode() {
  try {
    error.value = null
    if (!inputText.value.trim()) {
      error.value = '请输入要编码的文本'
      return
    }

    outputText.value = btoa(unescape(encodeURIComponent(inputText.value)))
  } catch (err) {
    error.value = err instanceof Error ? err.message : '编码失败'
  }
}

// Base64解码
function decode() {
  try {
    error.value = null
    if (!inputText.value.trim()) {
      error.value = '请输入要解码的Base64文本'
      return
    }

    outputText.value = decodeURIComponent(escape(atob(inputText.value.trim())))
  } catch (err) {
    error.value = '解码失败，请检查输入是否为有效的Base64格式'
  }
}

// 交换输入输出
function swapInputOutput() {
  if (!outputText.value) return

  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
}

// 清空输入
function clearInput() {
  inputText.value = ''
  outputText.value = ''
  error.value = null
  isBase64Valid.value = null
}

// 加载示例数据
function loadSample() {
  inputText.value = 'Hello, World! 你好，世界！'
  outputText.value = ''
}

// 复制输出
async function copyOutput() {
  if (!outputText.value) return

  try {
    await navigator.clipboard.writeText(outputText.value)
    // 这里可以添加成功提示
  } catch (err) {
    error.value = '复制失败'
  }
}

// 下载文本文件
function downloadText() {
  if (!outputText.value) return

  const blob = new Blob([outputText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `base64-result-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
