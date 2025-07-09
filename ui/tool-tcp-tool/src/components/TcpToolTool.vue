<template>
  <div class="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- 顶部工具栏 -->
    <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-700/60 shadow-soft">
      <div class="flex items-center gap-4 p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
            <div class="i-carbon-network-3 text-white text-xl"></div>
          </div>
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">TCP 工具</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">专业的TCP客户端/服务端调试工具</p>
          </div>
        </div>

        <div class="toolbar-group">
          <button
            @click="showClientDialog = true"
            class="btn-primary text-sm"
            :disabled="loading"
          >
            <div class="i-carbon-connect mr-1"></div>
            客户端连接
          </button>
          <button
            @click="showServerDialog = true"
            class="btn-success text-sm"
            :disabled="loading"
          >
            <div class="i-carbon-server mr-1"></div>
            启动服务端
          </button>
        </div>

        <div class="toolbar-group">
          <button
            @click="clearMessages"
            class="btn-secondary text-sm"
          >
            <div class="i-carbon-clean mr-1"></div>
            清空消息
          </button>
          <button
            @click="exportData"
            class="btn-secondary text-sm"
          >
            <div class="i-carbon-download mr-1"></div>
            导出数据
          </button>
        </div>

        <div class="ml-auto flex items-center gap-2">
          <div class="text-sm text-muted">
            连接数: {{ connections.length }}
          </div>
          <div
            class="status-dot"
            :class="overallStatus"
          ></div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="flex h-[calc(100vh-64px)]">
      <!-- 左侧连接面板 -->
      <aside class="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">连接管理</h2>

          <!-- 连接列表 -->
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div
              v-for="connection in connections"
              :key="connection.id"
              class="card p-3 cursor-pointer transition-all"
              :class="selectedConnection?.id === connection.id ? 'ring-2 ring-primary-500' : ''"
              @click="selectConnection(connection)"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div
                    class="status-dot"
                    :class="getStatusClass(connection.status)"
                  ></div>
                  <span class="font-medium text-sm">{{ connection.connection_type }}</span>
                </div>
                <button
                  @click.stop="disconnectConnection(connection.id)"
                  class="text-red-500 hover:text-red-700 text-xs"
                >
                  <div class="i-carbon-close"></div>
                </button>
              </div>

              <div class="text-xs text-muted space-y-1">
                <div>本地: {{ connection.local_addr }}</div>
                <div v-if="connection.remote_addr">远程: {{ connection.remote_addr }}</div>
                <div class="flex justify-between">
                  <span>发送: {{ formatBytes(connection.bytes_sent) }}</span>
                  <span>接收: {{ formatBytes(connection.bytes_received) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="connections.length === 0" class="text-center py-8 text-muted">
            <div class="i-carbon-network-3 text-4xl mb-2 opacity-50"></div>
            <p>暂无连接</p>
          </div>
        </div>

        <!-- 连接详情 -->
        <div v-if="selectedConnection" class="p-4 flex-1">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-3">连接详情</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted">ID:</span>
              <span class="font-mono">{{ selectedConnection.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted">类型:</span>
              <span>{{ selectedConnection.connection_type }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted">状态:</span>
              <span :class="getStatusTextClass(selectedConnection.status)">
                {{ getStatusText(selectedConnection.status) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted">创建时间:</span>
              <span>{{ formatTime(selectedConnection.created_at) }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧消息区域 -->
      <main class="flex-1 flex flex-col">
        <!-- 消息显示区域 -->
        <div class="flex-1 p-4 overflow-hidden">
          <div class="h-full flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">消息记录</h2>
              <div class="flex items-center gap-2">
                <select
                  v-model="messageFormat"
                  class="input-base text-sm"
                >
                  <option value="text">文本</option>
                  <option value="hex">十六进制</option>
                  <option value="json">JSON</option>
                </select>
                <button
                  @click="autoScroll = !autoScroll"
                  class="btn-ghost text-sm"
                  :class="autoScroll ? 'text-primary-600' : ''"
                >
                  <div class="i-carbon-arrow-down mr-1"></div>
                  自动滚动
                </button>
              </div>
            </div>

            <!-- 消息列表 -->
            <div
              ref="messageContainer"
              class="flex-1 code-block overflow-y-auto space-y-2"
            >
              <div
                v-for="message in filteredMessages"
                :key="`${message.connection_id}-${message.timestamp}`"
                class="flex items-start gap-3 p-2 rounded"
                :class="message.direction === 'sent' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-green-50 dark:bg-green-900/20'"
              >
                <div class="flex-shrink-0 mt-1">
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="message.direction === 'sent' ? 'bg-blue-500' : 'bg-green-500'"
                  ></div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-medium">
                      {{ message.direction === 'sent' ? '发送' : '接收' }}
                    </span>
                    <span class="text-xs text-muted">{{ formatTime(message.timestamp) }}</span>
                    <span class="text-xs text-muted">{{ message.size }} bytes</span>
                  </div>
                  <div class="font-mono text-sm break-all">
                    {{ formatMessage(message.content) }}
                  </div>
                </div>
              </div>

              <div v-if="filteredMessages.length === 0" class="text-center py-8 text-muted">
                <div class="i-carbon-chat text-4xl mb-2 opacity-50"></div>
                <p>暂无消息</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 消息发送区域 -->
        <div class="border-t border-gray-200 dark:border-gray-700 p-4">
          <div class="flex gap-2">
            <textarea
              v-model="messageToSend"
              placeholder="输入要发送的消息..."
              class="textarea-base flex-1 h-20 resize-none"
              :disabled="!selectedConnection || selectedConnection.status !== 'connected'"
              @keydown.ctrl.enter="sendMessage"
            ></textarea>
            <div class="flex flex-col gap-2">
              <button
                @click="sendMessage"
                :disabled="!selectedConnection || selectedConnection.status !== 'connected' || !messageToSend.trim()"
                class="btn-primary"
              >
                <div class="i-carbon-send mr-1"></div>
                发送
              </button>
              <button
                @click="messageToSend = ''"
                class="btn-secondary"
              >
                清空
              </button>
            </div>
          </div>
          <div class="mt-2 text-xs text-muted">
            提示: Ctrl+Enter 快速发送
          </div>
        </div>
      </main>
    </div>

    <!-- 客户端连接对话框 -->
    <ClientConnectDialog
      v-model:show="showClientDialog"
      @connect="handleClientConnect"
    />

    <!-- 服务端启动对话框 -->
    <ServerStartDialog
      v-model:show="showServerDialog"
      @start="handleServerStart"
    />

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm z-50"
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
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import ClientConnectDialog from './ClientConnectDialog.vue'
import ServerStartDialog from './ServerStartDialog.vue'

interface ConnectionInfo {
  id: string
  connection_type: string
  local_addr: string
  remote_addr?: string
  status: string
  created_at: string
  bytes_sent: number
  bytes_received: number
}

interface MessageData {
  connection_id: string
  content: string
  timestamp: string
  direction: string
  size: number
}

const loading = ref(false)
const error = ref<string | null>(null)
const connections = ref<ConnectionInfo[]>([])
const messages = ref<MessageData[]>([])
const selectedConnection = ref<ConnectionInfo | null>(null)
const messageToSend = ref('')
const messageFormat = ref('text')
const autoScroll = ref(true)
const showClientDialog = ref(false)
const showServerDialog = ref(false)
const messageContainer = ref<HTMLElement | null>(null)

// 计算属性
const filteredMessages = computed(() => {
  if (!selectedConnection.value) return []
  return messages.value.filter(msg => msg.connection_id === selectedConnection.value!.id)
})

const overallStatus = computed(() => {
  const connectedCount = connections.value.filter(c => c.status === 'connected').length
  if (connectedCount > 0) return 'status-connected'
  if (connections.value.some(c => c.status === 'connecting')) return 'status-connecting'
  return 'status-disconnected'
})

// 工具方法
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString()
}

function formatMessage(content: string): string {
  switch (messageFormat.value) {
    case 'hex':
      return content.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ')
    case 'json':
      try {
        return JSON.stringify(JSON.parse(content), null, 2)
      } catch {
        return content
      }
    default:
      return content
  }
}

function getStatusClass(status: string): string {
  switch (status) {
    case 'connected':
      return 'status-connected'
    case 'connecting':
      return 'status-connecting'
    case 'listening':
      return 'status-connected'
    default:
      return 'status-disconnected'
  }
}

function getStatusTextClass(status: string): string {
  switch (status) {
    case 'connected':
    case 'listening':
      return 'text-success'
    case 'connecting':
      return 'text-warning'
    default:
      return 'text-danger'
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'connected':
      return '已连接'
    case 'connecting':
      return '连接中'
    case 'listening':
      return '监听中'
    case 'disconnected':
      return '已断开'
    default:
      return '未知'
  }
}

// 主要功能方法
async function loadConnections() {
  try {
    const result = await invoke('plugin:tcp-tool|tcp_get_connections') as ConnectionInfo[]
    connections.value = result
  } catch (err) {
    console.error('Failed to load connections:', err)
  }
}

function selectConnection(connection: ConnectionInfo) {
  selectedConnection.value = connection
}

async function handleClientConnect(config: { host: string; port: number }) {
  try {
    loading.value = true
    const connectionId = await invoke('plugin:tcp-tool|tcp_client_connect', {
      host: config.host,
      port: config.port
    }) as string

    await loadConnections()
    showClientDialog.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : '连接失败'
  } finally {
    loading.value = false
  }
}

async function handleServerStart(config: { port: number }) {
  try {
    loading.value = true
    const serverId = await invoke('plugin:tcp-tool|tcp_server_start', {
      port: config.port
    }) as string

    await loadConnections()
    showServerDialog.value = false
  } catch (err) {
    error.value = err instanceof Error ? err.message : '启动服务器失败'
  } finally {
    loading.value = false
  }
}

async function sendMessage() {
  if (!selectedConnection.value || !messageToSend.value.trim()) return

  try {
    await invoke('plugin:tcp-tool|tcp_send_message', {
      connectionId: selectedConnection.value.id,
      message: messageToSend.value
    })

    messageToSend.value = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : '发送消息失败'
  }
}

async function disconnectConnection(connectionId: string) {
  try {
    await invoke('plugin:tcp-tool|tcp_disconnect', {
      connectionId
    })

    await loadConnections()
    if (selectedConnection.value?.id === connectionId) {
      selectedConnection.value = null
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '断开连接失败'
  }
}

function clearMessages() {
  messages.value = []
}

function exportData() {
  const data = {
    connections: connections.value,
    messages: messages.value
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tcp-tool-data-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// 监听后端事件
async function setupEventListeners() {
  // 监听连接建立事件
  await listen('tcp_connection_established', (event) => {
    const connection = event.payload as ConnectionInfo
    const index = connections.value.findIndex(c => c.id === connection.id)
    if (index >= 0) {
      connections.value[index] = connection
    } else {
      connections.value.push(connection)
    }
  })

  // 监听服务器启动事件
  await listen('tcp_server_started', (event) => {
    const server = event.payload as ConnectionInfo
    connections.value.push(server)
  })

  // 监听消息发送事件
  await listen('tcp_message_sent', (event) => {
    const message = event.payload as MessageData
    messages.value.push(message)

    // 更新连接的发送字节数
    const connection = connections.value.find(c => c.id === message.connection_id)
    if (connection) {
      connection.bytes_sent += message.size
    }

    if (autoScroll.value) {
      nextTick(() => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight
        }
      })
    }
  })

  // 监听连接关闭事件
  await listen('tcp_connection_closed', (event) => {
    const connection = event.payload as ConnectionInfo
    const index = connections.value.findIndex(c => c.id === connection.id)
    if (index >= 0) {
      connections.value[index] = connection
    }
  })
}

// 监听消息变化，自动滚动
watch(filteredMessages, () => {
  if (autoScroll.value) {
    nextTick(() => {
      if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight
      }
    })
  }
}, { deep: true })

onMounted(async () => {
  await setupEventListeners()
  await loadConnections()
})
</script>
