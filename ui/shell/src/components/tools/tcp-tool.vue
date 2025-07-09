<template>
  <div class="h-full">
    <!-- TCP工具嵌入式界面 -->
    <iframe
      :src="tcpToolUrl"
      class="w-full h-full border-0"
      @load="onIframeLoad"
    />
    
    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white dark:bg-gray-900 flex-col-center"
    >
      <div class="animate-spin i-carbon-circle-dash text-4xl text-primary-600 mb-4"></div>
      <p class="text-muted">正在加载TCP工具...</p>
    </div>
    
    <!-- 错误状态 -->
    <div
      v-if="error"
      class="absolute inset-0 bg-white dark:bg-gray-900 flex-col-center p-8"
    >
      <div class="i-carbon-warning text-6xl text-red-500 mb-4"></div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        加载失败
      </h2>
      <p class="text-muted text-center mb-4">
        {{ error }}
      </p>
      <button @click="retry" class="btn-primary">
        重试
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  toolName: string
}>()

const loading = ref(true)
const error = ref<string | null>(null)
const tcpToolUrl = ref('')

// TCP工具的开发服务器端口（这应该从配置中获取）
const TCP_TOOL_PORT = 5174

function onIframeLoad() {
  loading.value = false
}

function retry() {
  error.value = null
  loading.value = true
  tcpToolUrl.value = `http://localhost:${TCP_TOOL_PORT}`
}

async function checkTcpToolAvailability() {
  try {
    // 检查TCP工具是否可用
    const response = await fetch(`http://localhost:${TCP_TOOL_PORT}`, {
      method: 'HEAD',
      mode: 'no-cors'
    })
    
    tcpToolUrl.value = `http://localhost:${TCP_TOOL_PORT}`
  } catch (err) {
    error.value = 'TCP工具服务未启动，请确保工具正在运行'
    loading.value = false
  }
}

onMounted(() => {
  checkTcpToolAvailability()
})
</script>

<style scoped>
iframe {
  position: relative;
}
</style>
