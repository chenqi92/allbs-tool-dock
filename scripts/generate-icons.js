#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

const sourceIcon = join(rootDir, 'icon.png')
const iconDir = join(rootDir, 'apps/shell/icons')

console.log('🎨 生成应用图标...\n')

// 检查源图标文件
if (!existsSync(sourceIcon)) {
  console.error('❌ 源图标文件不存在: icon.png')
  process.exit(1)
}

// 创建图标目录
if (!existsSync(iconDir)) {
  mkdirSync(iconDir, { recursive: true })
}

// 检查是否安装了 ImageMagick
function checkImageMagick() {
  try {
    execSync('magick -version', { stdio: 'ignore' })
    return 'magick'
  } catch {
    try {
      execSync('convert -version', { stdio: 'ignore' })
      return 'convert'
    } catch {
      return null
    }
  }
}

const magickCmd = checkImageMagick()

if (!magickCmd) {
  console.log('⚠️  ImageMagick 未安装，将使用备用方案')
  console.log('   安装 ImageMagick 以获得更好的图标质量:')
  console.log('   - Windows: https://imagemagick.org/script/download.php#windows')
  console.log('   - macOS: brew install imagemagick')
  console.log('   - Linux: sudo apt-get install imagemagick')
  
  // 备用方案：直接复制原图标
  console.log('\n📋 复制原图标到各个位置...')
  
  const iconSizes = [
    { size: '32x32', file: '32x32.png' },
    { size: '128x128', file: '128x128.png' },
    { size: '256x256', file: '128x128@2x.png' }
  ]
  
  iconSizes.forEach(({ file }) => {
    const destPath = join(iconDir, file)
    copyFileSync(sourceIcon, destPath)
    console.log(`✅ 复制到 ${file}`)
  })
  
  // 复制到其他格式（虽然不是正确的格式，但至少有占位符）
  copyFileSync(sourceIcon, join(iconDir, 'icon.ico'))
  copyFileSync(sourceIcon, join(iconDir, 'icon.icns'))
  
  console.log('✅ 复制到 icon.ico')
  console.log('✅ 复制到 icon.icns')
  console.log('\n⚠️  注意: 由于未安装 ImageMagick，图标可能不是最佳格式')
  console.log('   建议安装 ImageMagick 后重新运行此脚本')
  
} else {
  console.log(`✅ 检测到 ImageMagick (${magickCmd})`)
  
  // 生成不同尺寸的 PNG 图标
  const iconSizes = [
    { size: 32, file: '32x32.png' },
    { size: 128, file: '128x128.png' },
    { size: 256, file: '128x128@2x.png' },
    { size: 512, file: '512x512.png' },
    { size: 1024, file: '512x512@2x.png' }
  ]
  
  console.log('\n🖼️  生成 PNG 图标...')
  iconSizes.forEach(({ size, file }) => {
    try {
      const destPath = join(iconDir, file)
      execSync(`${magickCmd} "${sourceIcon}" -resize ${size}x${size} "${destPath}"`, { stdio: 'ignore' })
      console.log(`✅ 生成 ${file} (${size}x${size})`)
    } catch (error) {
      console.error(`❌ 生成 ${file} 失败:`, error.message)
    }
  })
  
  // 生成 Windows ICO 文件
  console.log('\n🪟 生成 Windows ICO 图标...')
  try {
    const icoPath = join(iconDir, 'icon.ico')
    const sizes = [16, 32, 48, 64, 128, 256]
    const sizeArgs = sizes.map(size => `"${sourceIcon}" -resize ${size}x${size}`).join(' ')
    execSync(`${magickCmd} ${sizeArgs} "${icoPath}"`, { stdio: 'ignore' })
    console.log('✅ 生成 icon.ico')
  } catch (error) {
    console.error('❌ 生成 ICO 文件失败:', error.message)
  }
  
  // 生成 macOS ICNS 文件
  console.log('\n🍎 生成 macOS ICNS 图标...')
  try {
    const icnsDir = join(iconDir, 'icon.iconset')
    const icnsPath = join(iconDir, 'icon.icns')
    
    // 创建 iconset 目录
    if (!existsSync(icnsDir)) {
      mkdirSync(icnsDir, { recursive: true })
    }
    
    // 生成 iconset 所需的各种尺寸
    const icnsSizes = [
      { size: 16, name: 'icon_16x16.png' },
      { size: 32, name: 'icon_16x16@2x.png' },
      { size: 32, name: 'icon_32x32.png' },
      { size: 64, name: 'icon_32x32@2x.png' },
      { size: 128, name: 'icon_128x128.png' },
      { size: 256, name: 'icon_128x128@2x.png' },
      { size: 256, name: 'icon_256x256.png' },
      { size: 512, name: 'icon_256x256@2x.png' },
      { size: 512, name: 'icon_512x512.png' },
      { size: 1024, name: 'icon_512x512@2x.png' }
    ]
    
    icnsSizes.forEach(({ size, name }) => {
      const iconPath = join(icnsDir, name)
      execSync(`${magickCmd} "${sourceIcon}" -resize ${size}x${size} "${iconPath}"`, { stdio: 'ignore' })
    })
    
    // 使用 iconutil 生成 ICNS (仅在 macOS 上可用)
    try {
      execSync(`iconutil -c icns "${icnsDir}" -o "${icnsPath}"`, { stdio: 'ignore' })
      console.log('✅ 生成 icon.icns')
      
      // 清理临时 iconset 目录
      execSync(`rm -rf "${icnsDir}"`, { stdio: 'ignore' })
    } catch {
      // 如果不在 macOS 上，使用 ImageMagick 生成
      const sizes = [16, 32, 64, 128, 256, 512, 1024]
      const sizeArgs = sizes.map(size => `"${sourceIcon}" -resize ${size}x${size}`).join(' ')
      execSync(`${magickCmd} ${sizeArgs} "${icnsPath}"`, { stdio: 'ignore' })
      console.log('✅ 生成 icon.icns (使用 ImageMagick)')
    }
    
  } catch (error) {
    console.error('❌ 生成 ICNS 文件失败:', error.message)
  }
}

// 更新 Tauri 配置文件
console.log('\n⚙️  更新 Tauri 配置...')
try {
  const tauriConfigPath = join(rootDir, 'apps/shell/tauri.conf.json')
  const configContent = readFileSync(tauriConfigPath, 'utf8')
  const config = JSON.parse(configContent)
  
  // 更新图标路径
  config.bundle.icon = [
    'icons/32x32.png',
    'icons/128x128.png',
    'icons/128x128@2x.png',
    'icons/icon.icns',
    'icons/icon.ico'
  ]
  
  // 写回配置文件
  const updatedConfig = JSON.stringify(config, null, 2)
  writeFileSync(tauriConfigPath, updatedConfig)
  
  console.log('✅ 更新 tauri.conf.json')
} catch (error) {
  console.error('❌ 更新 Tauri 配置失败:', error.message)
}

// 移动原图标到 assets 目录
console.log('\n📁 整理文件...')
try {
  const assetsDir = join(rootDir, 'assets')
  if (!existsSync(assetsDir)) {
    mkdirSync(assetsDir, { recursive: true })
  }
  
  const originalIconPath = join(assetsDir, 'icon-original.png')
  copyFileSync(sourceIcon, originalIconPath)
  
  console.log('✅ 原图标已备份到 assets/icon-original.png')
} catch (error) {
  console.error('❌ 备份原图标失败:', error.message)
}

console.log('\n🎉 图标生成完成！')
console.log('\n📋 生成的文件:')
console.log('  apps/shell/icons/32x32.png')
console.log('  apps/shell/icons/128x128.png')
console.log('  apps/shell/icons/128x128@2x.png')
console.log('  apps/shell/icons/icon.ico')
console.log('  apps/shell/icons/icon.icns')
console.log('  assets/icon-original.png (备份)')

console.log('\n✨ 下一步:')
console.log('  1. 检查生成的图标质量')
console.log('  2. 运行 pnpm build 测试打包')
console.log('  3. 如需要，可以手动调整图标文件')
