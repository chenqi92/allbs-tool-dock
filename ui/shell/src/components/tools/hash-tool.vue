<template>
  <div class="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 工具头部 -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 shadow-soft">
      <div class="flex items-center gap-4 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
            <div class="i-carbon-security text-white text-xl"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">哈希计算</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">MD5、SHA1、SHA256等哈希值计算</p>
          </div>
        </div>
        
        <div class="ml-auto flex items-center gap-2">
          <button
            @click="calculateAll"
            class="btn-primary text-sm"
            :disabled="!inputText.trim()"
          >
            <div class="i-carbon-calculator mr-2"></div>
            计算所有
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
        <!-- 输入区域 -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">输入文本</h2>
          <textarea
            v-model="inputText"
            placeholder="在此输入要计算哈希值的文本..."
            class="w-full h-32 textarea-base font-mono text-sm resize-none"
          ></textarea>
          <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            字符数: {{ inputText.length }} | 字节数: {{ new TextEncoder().encode(inputText).length }}
          </div>
        </div>

        <!-- 哈希结果 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="hash in hashResults"
            :key="hash.name"
            class="card p-6"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ hash.name }}</h3>
              <div class="flex items-center gap-2">
                <button
                  @click="copyHash(hash.value)"
                  class="btn-ghost text-sm"
                  :disabled="!hash.value"
                >
                  <div class="i-carbon-copy"></div>
                </button>
                <button
                  @click="calculateSingle(hash.name.toLowerCase())"
                  class="btn-ghost text-sm"
                  :disabled="!inputText.trim()"
                >
                  <div class="i-carbon-calculator"></div>
                </button>
              </div>
            </div>
            
            <div class="code-block p-3 min-h-16">
              <code v-if="hash.value" class="text-sm font-mono break-all">{{ hash.value }}</code>
              <div v-else class="text-gray-400 text-sm">等待计算...</div>
            </div>
            
            <div v-if="hash.value" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              长度: {{ hash.value.length }} 字符
            </div>
          </div>
        </div>

        <!-- 文件哈希计算 -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">文件哈希计算</h2>
          <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <input
              ref="fileInput"
              type="file"
              @change="handleFileSelect"
              class="hidden"
            />
            <div class="i-carbon-document text-4xl text-gray-400 mb-4"></div>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              点击选择文件或拖拽文件到此处
            </p>
            <button
              @click="$refs.fileInput?.click()"
              class="btn-secondary"
            >
              选择文件
            </button>
          </div>
          
          <div v-if="selectedFile" class="mt-4">
            <div class="flex items-center gap-2 mb-2">
              <div class="i-carbon-document text-lg"></div>
              <span class="font-medium">{{ selectedFile.name }}</span>
              <span class="text-sm text-gray-500">({{ formatFileSize(selectedFile.size) }})</span>
            </div>
            <button
              @click="calculateFileHash"
              class="btn-primary text-sm"
              :disabled="calculating"
            >
              <div v-if="calculating" class="i-carbon-circle-dash animate-spin mr-2"></div>
              <div v-else class="i-carbon-calculator mr-2"></div>
              {{ calculating ? '计算中...' : '计算文件哈希' }}
            </button>
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
import { ref } from 'vue'

interface HashResult {
  name: string
  value: string
}

const inputText = ref('')
const error = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const calculating = ref(false)

const hashResults = ref<HashResult[]>([
  { name: 'MD5', value: '' },
  { name: 'SHA1', value: '' },
  { name: 'SHA256', value: '' },
  { name: 'SHA512', value: '' }
])

// 计算单个哈希值
async function calculateSingle(algorithm: string) {
  if (!inputText.value.trim()) return
  
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(inputText.value)
    
    let hashBuffer: ArrayBuffer
    
    switch (algorithm) {
      case 'md5':
        // 注意：Web Crypto API不支持MD5，这里使用模拟
        error.value = 'MD5算法需要额外的库支持'
        return
      case 'sha1':
        hashBuffer = await crypto.subtle.digest('SHA-1', data)
        break
      case 'sha256':
        hashBuffer = await crypto.subtle.digest('SHA-256', data)
        break
      case 'sha512':
        hashBuffer = await crypto.subtle.digest('SHA-512', data)
        break
      default:
        throw new Error('不支持的哈希算法')
    }
    
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    const result = hashResults.value.find(h => h.name.toLowerCase() === algorithm)
    if (result) {
      result.value = hashHex
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '计算哈希值失败'
  }
}

// 计算所有哈希值
async function calculateAll() {
  if (!inputText.value.trim()) {
    error.value = '请输入要计算哈希值的文本'
    return
  }
  
  // 清空之前的结果
  hashResults.value.forEach(h => h.value = '')
  
  // 计算支持的哈希算法
  await calculateSingle('sha1')
  await calculateSingle('sha256')
  await calculateSingle('sha512')
  
  // MD5需要特殊处理或使用第三方库
  const md5Result = hashResults.value.find(h => h.name === 'MD5')
  if (md5Result) {
    md5Result.value = '需要MD5库支持'
  }
}

// 清空所有结果
function clearAll() {
  inputText.value = ''
  hashResults.value.forEach(h => h.value = '')
  selectedFile.value = null
  error.value = null
}

// 复制哈希值
async function copyHash(hash: string) {
  if (!hash) return
  
  try {
    await navigator.clipboard.writeText(hash)
  } catch (err) {
    error.value = '复制失败'
  }
}

// 处理文件选择
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
  }
}

// 计算文件哈希
async function calculateFileHash() {
  if (!selectedFile.value) return
  
  calculating.value = true
  try {
    const arrayBuffer = await selectedFile.value.arrayBuffer()
    
    // 计算文件的各种哈希值
    const sha1Hash = await crypto.subtle.digest('SHA-1', arrayBuffer)
    const sha256Hash = await crypto.subtle.digest('SHA-256', arrayBuffer)
    const sha512Hash = await crypto.subtle.digest('SHA-512', arrayBuffer)
    
    // 转换为十六进制字符串
    const toHex = (buffer: ArrayBuffer) => {
      const hashArray = Array.from(new Uint8Array(buffer))
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    }
    
    // 更新结果
    hashResults.value[1].value = toHex(sha1Hash) // SHA1
    hashResults.value[2].value = toHex(sha256Hash) // SHA256
    hashResults.value[3].value = toHex(sha512Hash) // SHA512
    hashResults.value[0].value = '文件MD5需要特殊库' // MD5
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : '计算文件哈希失败'
  } finally {
    calculating.value = false
  }
}

// 格式化文件大小
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>
