import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppInfo, PluginInfo, AppSettings } from '../types'
import { PluginStatus } from '../types'
import { isTauriEnv, devLog, devWarn } from '../utils/env'

// 动态导入Tauri API，避免在非Tauri环境中出错
const getTauriInvoke = async () => {
  if (isTauriEnv()) {
    const { invoke } = await import('@tauri-apps/api/core')
    return invoke
  }
  return null
}

export const useAppStore = defineStore('app', () => {
  // 状态
  const appInfo = ref<AppInfo | null>(null)
  const plugins = ref<PluginInfo[]>([])
  const settings = ref<AppSettings>({
    theme: 'auto',
    language: 'zh-CN',
    autoUpdate: true,
    notifications: true
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const loadedPlugins = computed(() => 
    plugins.value.filter(p => p.status === 'Loaded')
  )

  const availableTools = computed(() => [
    {
      id: 'tcp-tool',
      name: 'TCP 工具',
      description: '专业的TCP客户端/服务端调试工具',
      icon: 'i-carbon-network-3',
      category: '网络工具',
      status: plugins.value.find(p => p.name === 'tcp-tool')?.status || PluginStatus.Unloaded,
      route: '/tool/tcp-tool'
    },
    {
      id: 'json-formatter',
      name: 'JSON 格式化',
      description: 'JSON美化、压缩、验证和格式化工具',
      icon: 'i-carbon-code',
      category: '开发工具',
      status: plugins.value.find(p => p.name === 'json-formatter')?.status || PluginStatus.Unloaded,
      route: '/tool/json-formatter'
    },
    {
      id: 'base64-tool',
      name: 'Base64 工具',
      description: 'Base64编码解码，支持文本和文件',
      icon: 'i-carbon-transform',
      category: '编码工具',
      status: plugins.value.find(p => p.name === 'base64-tool')?.status || PluginStatus.Unloaded,
      route: '/tool/base64-tool'
    },
    {
      id: 'hash-tool',
      name: '哈希计算',
      description: 'MD5、SHA1、SHA256等哈希值计算',
      icon: 'i-carbon-security',
      category: '安全工具',
      status: plugins.value.find(p => p.name === 'hash-tool')?.status || PluginStatus.Unloaded,
      route: '/tool/hash-tool'
    },
    {
      id: 'timestamp-tool',
      name: '时间戳转换',
      description: 'Unix时间戳与日期时间互相转换',
      icon: 'i-carbon-time',
      category: '时间工具',
      status: plugins.value.find(p => p.name === 'timestamp-tool')?.status || PluginStatus.Unloaded,
      route: '/tool/timestamp-tool'
    },
    {
      id: 'regex-tool',
      name: '正则表达式',
      description: '正则表达式测试、匹配和调试工具',
      icon: 'i-carbon-search',
      category: '文本工具',
      status: plugins.value.find(p => p.name === 'regex-tool')?.status || PluginStatus.Unloaded,
      route: '/tool/regex-tool'
    },
    {
      id: 'logger',
      name: '日志工具',
      description: '查看和管理应用日志',
      icon: 'i-carbon-document',
      category: '开发工具',
      status: plugins.value.find(p => p.name === 'logger')?.status || PluginStatus.Unloaded,
      route: '/tool/logger'
    }
  ])

  // 方法
  async function initialize() {
    try {
      loading.value = true
      error.value = null

      const invoke = await getTauriInvoke()

      if (invoke) {
        // 在Tauri环境中，调用真实的API
        devLog('Running in Tauri environment, calling real APIs')
        appInfo.value = await invoke<AppInfo>('get_app_info')
        await loadPlugins()
      } else {
        // 在开发环境中，使用模拟数据
        devLog('Running in development environment, using mock data')
        appInfo.value = {
          name: 'KKAPE Gearbox',
          version: '0.1.8',
          description: '现代化工具集合平台',
          author: 'KKAPE Team'
        }

        // 模拟插件数据
        plugins.value = [
          {
            id: 'tcp-tool',
            name: 'tcp-tool',
            version: '0.1.0',
            description: 'TCP客户端/服务端调试工具',
            status: 'Loaded',
            enabled: true
          },
          {
            id: 'json-formatter',
            name: 'json-formatter',
            version: '0.1.0',
            description: 'JSON格式化、美化和验证工具',
            status: 'Loaded',
            enabled: true
          },
          {
            id: 'base64-tool',
            name: 'base64-tool',
            version: '0.1.0',
            description: 'Base64编码解码工具',
            status: 'Loaded',
            enabled: true
          },
          {
            id: 'hash-tool',
            name: 'hash-tool',
            version: '0.1.0',
            description: '哈希计算工具(MD5/SHA1/SHA256)',
            status: 'Loaded',
            enabled: true
          },
          {
            id: 'timestamp-tool',
            name: 'timestamp-tool',
            version: '0.1.0',
            description: 'Unix时间戳转换工具',
            status: 'Loaded',
            enabled: true
          },
          {
            id: 'regex-tool',
            name: 'regex-tool',
            version: '0.1.0',
            description: '正则表达式测试和匹配工具',
            status: 'Loaded',
            enabled: true
          },
          {
            id: 'logger',
            name: 'logger',
            version: '0.1.0',
            description: '日志管理工具',
            status: 'Loaded',
            enabled: true
          }
        ]

        devLog('Mock data loaded:', { appInfo: appInfo.value, plugins: plugins.value })
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : '初始化失败'
      console.error('App initialization failed:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadPlugins() {
    try {
      const invoke = await getTauriInvoke()

      if (invoke) {
        plugins.value = await invoke<PluginInfo[]>('list_plugins')
        devLog('Plugins loaded from Tauri:', plugins.value)
      } else {
        // 开发环境模拟数据已在initialize中设置
        devLog('Using mock plugin data in development mode')
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载插件列表失败'
      console.error('Failed to load plugins:', err)
    }
  }

  async function loadPlugin(pluginName: string) {
    try {
      loading.value = true

      const invoke = await getTauriInvoke()

      if (invoke) {
        await invoke('load_plugin', { pluginName })
        await loadPlugins() // 重新加载插件列表
        devLog(`Plugin loaded: ${pluginName}`)
      } else {
        // 开发环境模拟加载
        devLog(`Mock loading plugin: ${pluginName}`)
        const plugin = plugins.value.find(p => p.name === pluginName)
        if (plugin) {
          plugin.status = 'Loaded'
          plugin.enabled = true
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : `加载插件 ${pluginName} 失败`
      console.error(`Failed to load plugin ${pluginName}:`, err)
    } finally {
      loading.value = false
    }
  }

  async function unloadPlugin(pluginId: string) {
    try {
      loading.value = true

      const invoke = await getTauriInvoke()

      if (invoke) {
        await invoke('unload_plugin', { pluginId })
        await loadPlugins() // 重新加载插件列表
        devLog(`Plugin unloaded: ${pluginId}`)
      } else {
        // 开发环境模拟卸载
        devLog(`Mock unloading plugin: ${pluginId}`)
        const plugin = plugins.value.find(p => p.id === pluginId)
        if (plugin) {
          plugin.status = 'Unloaded'
          plugin.enabled = false
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : `卸载插件失败`
      console.error(`Failed to unload plugin ${pluginId}:`, err)
    } finally {
      loading.value = false
    }
  }

  async function restartPlugin(pluginId: string) {
    try {
      loading.value = true

      const invoke = await getTauriInvoke()

      if (invoke) {
        await invoke('restart_plugin', { pluginId })
        await loadPlugins() // 重新加载插件列表
        devLog(`Plugin restarted: ${pluginId}`)
      } else {
        // 开发环境模拟重启
        devLog(`Mock restarting plugin: ${pluginId}`)
        const plugin = plugins.value.find(p => p.id === pluginId)
        if (plugin) {
          plugin.status = 'Loading'
          setTimeout(() => {
            plugin.status = 'Loaded'
          }, 1000)
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : `重启插件失败`
      console.error(`Failed to restart plugin ${pluginId}:`, err)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // 状态
    appInfo,
    plugins,
    settings,
    loading,
    error,
    
    // 计算属性
    loadedPlugins,
    availableTools,
    
    // 方法
    initialize,
    loadPlugins,
    loadPlugin,
    unloadPlugin,
    restartPlugin,
    clearError
  }
})
