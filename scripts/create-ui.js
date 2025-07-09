#!/usr/bin/env node

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

function createUI(toolName) {
  if (!toolName) {
    console.error('请提供工具名称')
    console.log('用法: pnpm create:ui <tool-name>')
    process.exit(1)
  }

  const uiDir = join(rootDir, 'ui', `tool-${toolName}`)
  const srcDir = join(uiDir, 'src')

  // 检查 UI 是否已存在
  if (existsSync(uiDir)) {
    console.error(`UI ${toolName} 已存在`)
    process.exit(1)
  }

  // 创建目录
  mkdirSync(uiDir, { recursive: true })
  mkdirSync(srcDir, { recursive: true })

  // 创建 package.json
  const packageJson = `{
  "name": "@kkape/tool-${toolName}",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "format": "prettier --write src/",
    "test": "vitest"
  },
  "dependencies": {
    "@tauri-apps/api": "^2.0.0",
    "vue": "^3.4.0",
    "naive-ui": "^2.38.0",
    "@vueuse/core": "^10.7.0",
    "unocss": "^0.58.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "vue-tsc": "^1.8.0"
  }
}
`

  // 创建 vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS()
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../shared-design/src')
    }
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: '${toPascalCase(toolName)}Tool',
      fileName: (format) => \`tool-${toolName}.\${format}.js\`
    },
    rollupOptions: {
      external: ['vue', '@tauri-apps/api'],
      output: {
        globals: {
          vue: 'Vue',
          '@tauri-apps/api': 'TauriAPI'
        }
      }
    }
  }
})
`

  // 创建主组件
  const mainComponent = `<template>
  <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- 工具头部 -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
            ${toDisplayName(toolName)}
          </h1>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            ${toolName} 工具界面
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
    const result = await invoke('plugin:${toolName}|get_config')
    console.log('${toolName} config:', result)
    
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
    console.error('Failed to load ${toolName} data:', err)
  } finally {
    loading.value = false
  }
}

async function performAction(action: string) {
  try {
    loading.value = true
    const result = await invoke('plugin:${toolName}|${toCamelCase(toolName)}_action', {
      data: action
    })
    console.log('Action result:', result)
    await refreshData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : \`执行 \${action} 失败\`
    console.error(\`Failed to perform action \${action}:\`, err)
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
`

  // 创建 main.ts
  const mainTs = `import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:uno.css'

export default function create${toPascalCase(toolName)}Tool() {
  return createApp(App)
}

// 如果直接运行，则挂载到 DOM
if (import.meta.env.DEV) {
  const app = create${toPascalCase(toolName)}Tool()
  app.mount('#app')
}
`

  // 创建 App.vue
  const appVue = `<template>
  <${toPascalCase(toolName)}Tool />
</template>

<script setup lang="ts">
import ${toPascalCase(toolName)}Tool from './components/${toPascalCase(toolName)}Tool.vue'
</script>
`

  // 创建组件目录和文件
  const componentsDir = join(srcDir, 'components')
  mkdirSync(componentsDir, { recursive: true })

  // 写入文件
  writeFileSync(join(uiDir, 'package.json'), packageJson)
  writeFileSync(join(uiDir, 'vite.config.ts'), viteConfig)
  writeFileSync(join(srcDir, 'main.ts'), mainTs)
  writeFileSync(join(srcDir, 'App.vue'), appVue)
  writeFileSync(join(componentsDir, `${toPascalCase(toolName)}Tool.vue`), mainComponent)

  // 创建 index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${toDisplayName(toolName)}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`
  writeFileSync(join(uiDir, 'index.html'), indexHtml)

  console.log(`✅ UI ${toolName} 创建成功！`)
  console.log(`📁 位置: ${uiDir}`)
  console.log(`\n下一步:`)
  console.log(`1. cd ui/tool-${toolName}`)
  console.log(`2. pnpm install`)
  console.log(`3. pnpm dev`)
}

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

function toCamelCase(str) {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function toDisplayName(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// 获取命令行参数
const toolName = process.argv[2]
createUI(toolName)
