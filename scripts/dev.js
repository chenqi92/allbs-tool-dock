#!/usr/bin/env node

import { spawn } from 'child_process'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🚀 启动 KKAPE Gearbox 开发环境...\n')

// 启动前端开发服务器
console.log('📦 启动前端开发服务器...')
const frontend = spawn('pnpm', ['dev'], {
  cwd: join(rootDir, 'ui/shell'),
  stdio: 'inherit',
  shell: true
})

// 等待前端服务器启动
setTimeout(() => {
  console.log('\n🦀 启动 Tauri 开发服务器...')
  
  // 启动 Tauri 开发服务器
  const tauri = spawn('cargo', ['tauri', 'dev'], {
    cwd: join(rootDir, 'apps/shell'),
    stdio: 'inherit',
    shell: true
  })

  // 处理进程退出
  process.on('SIGINT', () => {
    console.log('\n🛑 正在关闭开发服务器...')
    frontend.kill('SIGINT')
    tauri.kill('SIGINT')
    process.exit(0)
  })

  tauri.on('exit', (code) => {
    console.log(`\n🦀 Tauri 开发服务器退出，代码: ${code}`)
    frontend.kill('SIGINT')
    process.exit(code)
  })

}, 3000)

frontend.on('exit', (code) => {
  console.log(`\n📦 前端开发服务器退出，代码: ${code}`)
  process.exit(code)
})
