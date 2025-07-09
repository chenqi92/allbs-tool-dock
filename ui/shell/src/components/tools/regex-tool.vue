<template>
  <div class="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 工具头部 -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 shadow-soft">
      <div class="flex items-center gap-4 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
            <div class="i-carbon-search text-white text-xl"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">正则表达式</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">正则表达式测试、匹配和调试工具</p>
          </div>
        </div>
        
        <div class="ml-auto flex items-center gap-2">
          <button
            @click="testRegex"
            class="btn-primary text-sm"
            :disabled="!regexPattern.trim() || !testText.trim()"
          >
            <div class="i-carbon-play mr-2"></div>
            测试
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
      <div class="max-w-6xl mx-auto space-y-6">
        <!-- 正则表达式输入 -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">正则表达式</h2>
          
          <div class="space-y-4">
            <div class="flex gap-2">
              <span class="flex items-center text-lg font-mono text-gray-600 dark:text-gray-400">/</span>
              <input
                v-model="regexPattern"
                type="text"
                placeholder="输入正则表达式..."
                class="flex-1 input-base font-mono"
                @input="testRegex"
              />
              <span class="flex items-center text-lg font-mono text-gray-600 dark:text-gray-400">/</span>
              <input
                v-model="regexFlags"
                type="text"
                placeholder="flags"
                class="w-20 input-base font-mono text-center"
                @input="testRegex"
              />
            </div>
            
            <div class="flex flex-wrap gap-2">
              <label class="flex items-center gap-1 text-sm">
                <input
                  v-model="flags.global"
                  type="checkbox"
                  @change="updateFlags"
                  class="rounded"
                />
                <span>g (全局)</span>
              </label>
              <label class="flex items-center gap-1 text-sm">
                <input
                  v-model="flags.ignoreCase"
                  type="checkbox"
                  @change="updateFlags"
                  class="rounded"
                />
                <span>i (忽略大小写)</span>
              </label>
              <label class="flex items-center gap-1 text-sm">
                <input
                  v-model="flags.multiline"
                  type="checkbox"
                  @change="updateFlags"
                  class="rounded"
                />
                <span>m (多行)</span>
              </label>
              <label class="flex items-center gap-1 text-sm">
                <input
                  v-model="flags.dotAll"
                  type="checkbox"
                  @change="updateFlags"
                  class="rounded"
                />
                <span>s (单行)</span>
              </label>
            </div>

            <div v-if="regexError" class="text-danger-600 text-sm">
              <div class="i-carbon-warning mr-1 inline-block"></div>
              {{ regexError }}
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 测试文本 -->
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">测试文本</h2>
              <button
                @click="loadSampleText"
                class="btn-ghost text-sm"
              >
                <div class="i-carbon-document mr-1"></div>
                示例文本
              </button>
            </div>
            
            <textarea
              v-model="testText"
              placeholder="输入要测试的文本..."
              class="w-full h-64 textarea-base font-mono text-sm resize-none"
              @input="testRegex"
            ></textarea>
            
            <div class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              字符数: {{ testText.length }} | 行数: {{ testText.split('\n').length }}
            </div>
          </div>

          <!-- 匹配结果 -->
          <div class="card p-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              匹配结果
              <span v-if="matches.length > 0" class="text-sm font-normal text-primary-600">
                ({{ matches.length }} 个匹配)
              </span>
            </h2>
            
            <div class="h-64 overflow-auto">
              <div v-if="matches.length > 0" class="space-y-2">
                <div
                  v-for="(match, index) in matches"
                  :key="index"
                  class="border border-gray-200 dark:border-gray-700 rounded p-3"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium">匹配 {{ index + 1 }}</span>
                    <button
                      @click="copyMatch(match.match)"
                      class="btn-ghost text-xs"
                    >
                      <div class="i-carbon-copy"></div>
                    </button>
                  </div>
                  
                  <div class="code-block p-2 mb-2">
                    <code class="text-sm">{{ match.match }}</code>
                  </div>
                  
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    位置: {{ match.index }} - {{ match.index + match.match.length }}
                  </div>
                  
                  <div v-if="match.groups.length > 0" class="mt-2">
                    <div class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">捕获组:</div>
                    <div class="space-y-1">
                      <div
                        v-for="(group, groupIndex) in match.groups"
                        :key="groupIndex"
                        class="text-xs"
                      >
                        <span class="text-gray-500">组 {{ groupIndex + 1 }}:</span>
                        <code class="ml-2 bg-gray-100 dark:bg-gray-800 px-1 rounded">{{ group }}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else-if="regexPattern && testText" class="flex-col-center h-full text-gray-400">
                <div class="i-carbon-search text-4xl mb-2 opacity-50"></div>
                <p>无匹配结果</p>
              </div>
              
              <div v-else class="flex-col-center h-full text-gray-400">
                <div class="i-carbon-search text-4xl mb-2 opacity-50"></div>
                <p>输入正则表达式和测试文本开始测试</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 常用正则表达式 -->
        <div class="card p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">常用正则表达式</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="preset in regexPresets"
              :key="preset.name"
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              @click="usePreset(preset)"
            >
              <div class="font-medium text-gray-900 dark:text-white mb-1">{{ preset.name }}</div>
              <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">{{ preset.description }}</div>
              <code class="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">{{ preset.pattern }}</code>
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
import { ref, reactive } from 'vue'

interface Match {
  match: string
  index: number
  groups: string[]
}

interface RegexPreset {
  name: string
  description: string
  pattern: string
  flags?: string
  testText?: string
}

const regexPattern = ref('')
const regexFlags = ref('')
const testText = ref('')
const error = ref<string | null>(null)
const regexError = ref<string | null>(null)
const matches = ref<Match[]>([])

const flags = reactive({
  global: false,
  ignoreCase: false,
  multiline: false,
  dotAll: false
})

const regexPresets: RegexPreset[] = [
  {
    name: '邮箱地址',
    description: '匹配邮箱地址',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: 'g',
    testText: '联系我们: admin@example.com 或 support@test.org'
  },
  {
    name: '手机号码',
    description: '匹配中国手机号',
    pattern: '1[3-9]\\d{9}',
    flags: 'g',
    testText: '我的手机号是13812345678，备用号码是15987654321'
  },
  {
    name: 'IP地址',
    description: '匹配IPv4地址',
    pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
    flags: 'g',
    testText: '服务器IP: 192.168.1.1, 网关: 10.0.0.1'
  },
  {
    name: 'URL链接',
    description: '匹配HTTP/HTTPS链接',
    pattern: 'https?://[^\\s]+',
    flags: 'g',
    testText: '访问 https://www.example.com 或 http://test.com/page'
  },
  {
    name: '日期格式',
    description: '匹配YYYY-MM-DD格式',
    pattern: '\\d{4}-\\d{2}-\\d{2}',
    flags: 'g',
    testText: '今天是2024-01-15，明天是2024-01-16'
  },
  {
    name: '中文字符',
    description: '匹配中文字符',
    pattern: '[\\u4e00-\\u9fa5]+',
    flags: 'g',
    testText: 'Hello 世界! This is 测试 text.'
  }
]

// 更新标志位
function updateFlags() {
  let flagStr = ''
  if (flags.global) flagStr += 'g'
  if (flags.ignoreCase) flagStr += 'i'
  if (flags.multiline) flagStr += 'm'
  if (flags.dotAll) flagStr += 's'
  regexFlags.value = flagStr
  testRegex()
}

// 测试正则表达式
function testRegex() {
  try {
    regexError.value = null
    matches.value = []
    
    if (!regexPattern.value.trim() || !testText.value.trim()) {
      return
    }

    const regex = new RegExp(regexPattern.value, regexFlags.value)
    const text = testText.value
    
    if (flags.global) {
      let match
      while ((match = regex.exec(text)) !== null) {
        matches.value.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        })
        
        // 防止无限循环
        if (!flags.global) break
      }
    } else {
      const match = regex.exec(text)
      if (match) {
        matches.value.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1)
        })
      }
    }
  } catch (err) {
    regexError.value = err instanceof Error ? err.message : '正则表达式错误'
  }
}

// 使用预设正则表达式
function usePreset(preset: RegexPreset) {
  regexPattern.value = preset.pattern
  regexFlags.value = preset.flags || ''
  
  // 更新标志位
  flags.global = (preset.flags || '').includes('g')
  flags.ignoreCase = (preset.flags || '').includes('i')
  flags.multiline = (preset.flags || '').includes('m')
  flags.dotAll = (preset.flags || '').includes('s')
  
  if (preset.testText) {
    testText.value = preset.testText
  }
  
  testRegex()
}

// 加载示例文本
function loadSampleText() {
  testText.value = `这是一个测试文本，包含各种内容：
邮箱: admin@example.com, user@test.org
手机: 13812345678, 15987654321
网址: https://www.example.com, http://test.com
日期: 2024-01-15, 2023-12-31
IP地址: 192.168.1.1, 10.0.0.1
中文内容：你好世界，这是测试文本。
English content: Hello World, this is test text.
数字: 123, 456.78, -789
特殊字符: @#$%^&*()_+-=[]{}|;:,.<>?`
}

// 复制匹配结果
async function copyMatch(match: string) {
  try {
    await navigator.clipboard.writeText(match)
  } catch (err) {
    error.value = '复制失败'
  }
}

// 清空所有
function clearAll() {
  regexPattern.value = ''
  regexFlags.value = ''
  testText.value = ''
  matches.value = []
  regexError.value = null
  error.value = null
  
  flags.global = false
  flags.ignoreCase = false
  flags.multiline = false
  flags.dotAll = false
}
</script>
