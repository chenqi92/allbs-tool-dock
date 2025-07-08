#!/usr/bin/env node

import { existsSync, statSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const iconDir = join(rootDir, 'apps/shell/icons')

console.log('🔍 检查应用图标...\n')

// 需要的图标文件
const requiredIcons = [
  { file: '32x32.png', description: '32x32 PNG 图标' },
  { file: '128x128.png', description: '128x128 PNG 图标' },
  { file: '128x128@2x.png', description: '256x256 PNG 图标 (高分辨率)' },
  { file: 'icon.ico', description: 'Windows ICO 图标' },
  { file: 'icon.icns', description: 'macOS ICNS 图标' }
]

let allIconsPresent = true
let totalSize = 0

console.log('📋 图标文件检查:')
requiredIcons.forEach(({ file, description }) => {
  const iconPath = join(iconDir, file)
  
  if (existsSync(iconPath)) {
    const stats = statSync(iconPath)
    const sizeKB = (stats.size / 1024).toFixed(1)
    totalSize += stats.size
    
    console.log(`✅ ${file.padEnd(20)} - ${description} (${sizeKB} KB)`)
  } else {
    console.log(`❌ ${file.padEnd(20)} - ${description} (缺失)`)
    allIconsPresent = false
  }
})

console.log(`\n📊 总大小: ${(totalSize / 1024).toFixed(1)} KB`)

// 检查 Tauri 配置
console.log('\n⚙️  Tauri 配置检查:')
try {
  const tauriConfigPath = join(rootDir, 'apps/shell/tauri.conf.json')
  if (existsSync(tauriConfigPath)) {
    const configContent = readFileSync(tauriConfigPath, 'utf8')
    const config = JSON.parse(configContent)
    
    if (config.bundle && config.bundle.icon) {
      const configuredIcons = config.bundle.icon
      console.log('✅ Tauri 配置包含图标路径:')
      configuredIcons.forEach(icon => {
        console.log(`   - ${icon}`)
      })
      
      // 检查配置的图标是否存在
      let missingConfigIcons = false
      configuredIcons.forEach(iconPath => {
        const fullPath = join(rootDir, 'apps/shell', iconPath)
        if (!existsSync(fullPath)) {
          console.log(`❌ 配置的图标文件不存在: ${iconPath}`)
          missingConfigIcons = true
        }
      })
      
      if (!missingConfigIcons) {
        console.log('✅ 所有配置的图标文件都存在')
      }
    } else {
      console.log('❌ Tauri 配置中未找到图标配置')
      allIconsPresent = false
    }
  } else {
    console.log('❌ 未找到 Tauri 配置文件')
    allIconsPresent = false
  }
} catch (error) {
  console.log('❌ 读取 Tauri 配置失败:', error.message)
  allIconsPresent = false
}

// 检查原图标备份
console.log('\n💾 原图标备份检查:')
const originalIconPath = join(rootDir, 'assets/icon-original.png')
if (existsSync(originalIconPath)) {
  const stats = statSync(originalIconPath)
  const sizeKB = (stats.size / 1024).toFixed(1)
  console.log(`✅ 原图标已备份: assets/icon-original.png (${sizeKB} KB)`)
} else {
  console.log('⚠️  未找到原图标备份')
}

// 总结
console.log('\n📋 检查总结:')
if (allIconsPresent) {
  console.log('🎉 所有图标文件都已准备就绪！')
  console.log('\n✨ 下一步:')
  console.log('  1. 运行 pnpm build 测试打包')
  console.log('  2. 检查生成的安装包是否包含正确的图标')
} else {
  console.log('❌ 发现问题，需要修复')
  console.log('\n🔧 建议操作:')
  console.log('  1. 确保根目录有 icon.png 文件')
  console.log('  2. 运行 pnpm generate:icons 重新生成图标')
  console.log('  3. 如需高质量图标，先运行 pnpm install:imagemagick')
}

console.log('\n💡 提示:')
console.log('  - 图标应该是正方形，推荐 512x512 或更高分辨率')
console.log('  - PNG 格式，透明背景效果最佳')
console.log('  - 避免过于复杂的细节，在小尺寸下可能不清晰')
