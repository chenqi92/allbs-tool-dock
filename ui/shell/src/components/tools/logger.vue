<template>
  <div class="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 工具头部 -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 shadow-soft">
      <div class="flex items-center gap-4 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
            <div class="i-carbon-document text-white text-xl"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">日志工具</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">查看和管理应用日志</p>
          </div>
        </div>
        
        <div class="ml-auto flex items-center gap-2">
          <select
            v-model="selectedLevel"
            class="input-base text-sm"
          >
            <option value="">所有级别</option>
            <option value="error">错误</option>
            <option value="warn">警告</option>
            <option value="info">信息</option>
            <option value="debug">调试</option>
          </select>
          <button
            @click="clearLogs"
            class="btn-secondary text-sm"
          >
            <div class="i-carbon-clean mr-2"></div>
            清空日志
          </button>
          <button
            @click="exportLogs"
            class="btn-ghost text-sm"
          >
            <div class="i-carbon-download mr-2"></div>
            导出
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="flex-1 p-4 overflow-hidden">
      <div class="h-full flex flex-col">
        <!-- 统计信息 -->
        <div class="grid grid-cols-4 gap-4 mb-4">
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-danger-600">{{ logStats.error }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">错误</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-warning-600">{{ logStats.warn }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">警告</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-primary-600">{{ logStats.info }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">信息</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-2xl font-bold text-gray-600">{{ logStats.debug }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">调试</div>
          </div>
        </div>

        <!-- 日志列表 -->
        <div class="flex-1 card overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              日志记录 ({{ filteredLogs.length }})
            </h2>
          </div>
          
          <div class="flex-1 overflow-auto">
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div
                v-for="log in filteredLogs"
                :key="log.id"
                class="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div class="flex items-start gap-3">
                  <div class="flex-shrink-0 mt-1">
                    <div
                      class="w-2 h-2 rounded-full"
                      :class="getLevelColor(log.level)"
                    ></div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span
                        class="px-2 py-1 rounded text-xs font-medium"
                        :class="getLevelClass(log.level)"
                      >
                        {{ log.level.toUpperCase() }}
                      </span>
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        {{ formatTime(log.timestamp) }}
                      </span>
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        {{ log.source }}
                      </span>
                    </div>
                    
                    <div class="text-sm text-gray-900 dark:text-white mb-1">
                      {{ log.message }}
                    </div>
                    
                    <div v-if="log.details" class="text-xs text-gray-600 dark:text-gray-400 font-mono">
                      {{ log.details }}
                    </div>
                  </div>
                  
                  <div class="flex-shrink-0">
                    <button
                      @click="copyLog(log)"
                      class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <div class="i-carbon-copy"></div>
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-if="filteredLogs.length === 0" class="p-12 text-center">
                <div class="i-carbon-document text-6xl text-gray-400 mx-auto mb-4"></div>
                <p class="text-lg text-gray-600 dark:text-gray-400">暂无日志记录</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface LogEntry {
  id: string
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  timestamp: string
  source: string
  details?: string
}

const selectedLevel = ref('')
const logs = ref<LogEntry[]>([])

// 模拟日志数据
const mockLogs: LogEntry[] = [
  {
    id: '1',
    level: 'info',
    message: '应用启动成功',
    timestamp: new Date().toISOString(),
    source: 'App',
    details: 'Application started successfully on port 5173'
  },
  {
    id: '2',
    level: 'debug',
    message: '加载配置文件',
    timestamp: new Date(Date.now() - 1000).toISOString(),
    source: 'Config',
    details: 'Loading configuration from config.json'
  },
  {
    id: '3',
    level: 'warn',
    message: '插件加载警告',
    timestamp: new Date(Date.now() - 2000).toISOString(),
    source: 'PluginManager',
    details: 'Plugin tcp-tool loaded with warnings'
  },
  {
    id: '4',
    level: 'error',
    message: '数据库连接失败',
    timestamp: new Date(Date.now() - 3000).toISOString(),
    source: 'Database',
    details: 'Failed to connect to database: Connection timeout'
  },
  {
    id: '5',
    level: 'info',
    message: 'TCP工具初始化完成',
    timestamp: new Date(Date.now() - 4000).toISOString(),
    source: 'TcpTool'
  }
]

// 过滤后的日志
const filteredLogs = computed(() => {
  if (!selectedLevel.value) return logs.value
  return logs.value.filter(log => log.level === selectedLevel.value)
})

// 日志统计
const logStats = computed(() => {
  const stats = { error: 0, warn: 0, info: 0, debug: 0 }
  logs.value.forEach(log => {
    stats[log.level]++
  })
  return stats
})

// 获取级别颜色
function getLevelColor(level: string): string {
  switch (level) {
    case 'error':
      return 'bg-danger-500'
    case 'warn':
      return 'bg-warning-500'
    case 'info':
      return 'bg-primary-500'
    case 'debug':
      return 'bg-gray-500'
    default:
      return 'bg-gray-400'
  }
}

// 获取级别样式类
function getLevelClass(level: string): string {
  switch (level) {
    case 'error':
      return 'bg-danger-100 text-danger-800 dark:bg-danger-900/20 dark:text-danger-400'
    case 'warn':
      return 'bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-400'
    case 'info':
      return 'bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-400'
    case 'debug':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

// 格式化时间
function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString()
}

// 复制日志
async function copyLog(log: LogEntry) {
  const logText = `[${log.level.toUpperCase()}] ${formatTime(log.timestamp)} ${log.source}: ${log.message}${log.details ? '\n' + log.details : ''}`
  
  try {
    await navigator.clipboard.writeText(logText)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

// 清空日志
function clearLogs() {
  logs.value = []
}

// 导出日志
function exportLogs() {
  const logText = logs.value.map(log => 
    `[${log.level.toUpperCase()}] ${formatTime(log.timestamp)} ${log.source}: ${log.message}${log.details ? '\n' + log.details : ''}`
  ).join('\n\n')
  
  const blob = new Blob([logText], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `logs-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  // 加载模拟日志数据
  logs.value = [...mockLogs]
  
  // 模拟实时日志
  setInterval(() => {
    const levels: Array<'info' | 'debug' | 'warn' | 'error'> = ['info', 'debug', 'warn', 'error']
    const sources = ['App', 'TcpTool', 'JsonFormatter', 'Base64Tool', 'HashTool']
    const messages = [
      '操作完成',
      '数据处理中',
      '连接建立',
      '请求处理',
      '缓存更新'
    ]
    
    const newLog: LogEntry = {
      id: Date.now().toString(),
      level: levels[Math.floor(Math.random() * levels.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date().toISOString(),
      source: sources[Math.floor(Math.random() * sources.length)]
    }
    
    logs.value.unshift(newLog)
    
    // 限制日志数量
    if (logs.value.length > 100) {
      logs.value = logs.value.slice(0, 100)
    }
  }, 5000)
})
</script>
