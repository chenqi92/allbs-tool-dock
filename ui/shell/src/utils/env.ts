/**
 * 环境检测工具
 */

// 检查是否在Tauri环境中
export const isTauriEnv = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI__' in window
}

// 检查是否在开发环境中
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV
}

// 检查是否在生产环境中
export const isProduction = (): boolean => {
  return import.meta.env.PROD
}

// 获取环境信息
export const getEnvInfo = () => {
  return {
    isTauri: isTauriEnv(),
    isDev: isDevelopment(),
    isProd: isProduction(),
    mode: import.meta.env.MODE,
    baseUrl: import.meta.env.BASE_URL
  }
}

// 开发环境日志
export const devLog = (message: string, ...args: any[]) => {
  if (isDevelopment()) {
    console.log(`[DEV] ${message}`, ...args)
  }
}

// 开发环境警告
export const devWarn = (message: string, ...args: any[]) => {
  if (isDevelopment()) {
    console.warn(`[DEV] ${message}`, ...args)
  }
}

// 开发环境错误
export const devError = (message: string, ...args: any[]) => {
  if (isDevelopment()) {
    console.error(`[DEV] ${message}`, ...args)
  }
}
