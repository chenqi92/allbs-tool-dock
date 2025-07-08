#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🚀 设置 KKAPE Gearbox 开发环境...\n')

// 检查必需的工具
function checkTool(command, name, installCmd) {
  try {
    execSync(`${command} --version`, { stdio: 'ignore' })
    console.log(`✅ ${name} 已安装`)
    return true
  } catch (error) {
    console.log(`❌ ${name} 未安装`)
    if (installCmd) {
      console.log(`   安装命令: ${installCmd}`)
    }
    return false
  }
}

console.log('📋 检查必需工具...')
const tools = [
  ['node', 'Node.js', 'https://nodejs.org/'],
  ['pnpm', 'pnpm', 'npm install -g pnpm'],
  ['cargo', 'Rust', 'https://rustup.rs/'],
  ['cargo tauri', 'Tauri CLI', 'cargo install tauri-cli']
]

let allToolsAvailable = true
for (const [command, name, install] of tools) {
  if (!checkTool(command, name, install)) {
    allToolsAvailable = false
  }
}

if (!allToolsAvailable) {
  console.log('\n❌ 请先安装缺失的工具，然后重新运行此脚本')
  process.exit(1)
}

console.log('\n📦 安装依赖...')

// 安装前端依赖
try {
  console.log('安装前端依赖...')
  execSync('pnpm install', { 
    cwd: rootDir, 
    stdio: 'inherit' 
  })
  console.log('✅ 前端依赖安装完成')
} catch (error) {
  console.error('❌ 前端依赖安装失败:', error.message)
  process.exit(1)
}

// 检查 Rust 依赖
try {
  console.log('检查 Rust 依赖...')
  execSync('cargo check', { 
    cwd: join(rootDir, 'apps/shell'), 
    stdio: 'inherit' 
  })
  console.log('✅ Rust 依赖检查完成')
} catch (error) {
  console.error('❌ Rust 依赖检查失败:', error.message)
  process.exit(1)
}

console.log('\n🎉 设置完成！')
console.log('\n📚 下一步:')
console.log('1. 运行开发服务器: pnpm dev')
console.log('2. 构建应用: pnpm build')
console.log('3. 创建新插件: pnpm create:plugin <name>')
console.log('4. 查看文档: docs/DEVELOPMENT.md')
console.log('\n🔗 有用的命令:')
console.log('- pnpm dev          # 启动开发服务器')
console.log('- pnpm build        # 构建生产版本')
console.log('- pnpm test         # 运行测试')
console.log('- pnpm lint         # 代码检查')
console.log('- pnpm format       # 代码格式化')
