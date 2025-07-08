export interface AppInfo {
  name: string
  version: string
  description: string
}

export enum PluginStatus {
  Loaded = 'Loaded',
  Unloaded = 'Unloaded',
  Loading = 'Loading',
  Unloading = 'Unloading',
  Error = 'Error'
}

export interface PluginInfo {
  id: string
  name: string
  version: string
  description: string
  status: PluginStatus
  features: string[]
}

export interface ToolCard {
  id: string
  name: string
  description: string
  icon: string
  category: string
  status: PluginStatus
  route?: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  language: string
  autoUpdate: boolean
  notifications: boolean
}
