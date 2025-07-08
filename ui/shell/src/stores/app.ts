import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import type { AppInfo, PluginInfo, AppSettings } from '../types'

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
      id: 'logger',
      name: '日志工具',
      description: '查看和管理应用日志',
      icon: 'i-carbon-document',
      category: '开发工具',
      status: plugins.value.find(p => p.name === 'logger')?.status || 'Unloaded',
      route: '/tool/logger'
    },
    {
      id: 'influx-client',
      name: 'InfluxDB 客户端',
      description: '连接和查询 InfluxDB 数据库',
      icon: 'i-carbon-data-base',
      category: '数据库工具',
      status: plugins.value.find(p => p.name === 'influx-client')?.status || 'Unloaded',
      route: '/tool/influx-client'
    }
  ])

  // 方法
  async function initialize() {
    try {
      loading.value = true
      error.value = null
      
      // 获取应用信息
      appInfo.value = await invoke<AppInfo>('get_app_info')
      
      // 获取插件列表
      await loadPlugins()
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : '初始化失败'
      console.error('App initialization failed:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadPlugins() {
    try {
      plugins.value = await invoke<PluginInfo[]>('list_plugins')
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载插件列表失败'
      console.error('Failed to load plugins:', err)
    }
  }

  async function loadPlugin(pluginName: string) {
    try {
      loading.value = true
      await invoke('load_plugin', { pluginName })
      await loadPlugins() // 重新加载插件列表
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
      await invoke('unload_plugin', { pluginId })
      await loadPlugins() // 重新加载插件列表
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
      await invoke('restart_plugin', { pluginId })
      await loadPlugins() // 重新加载插件列表
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
