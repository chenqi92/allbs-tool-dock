#!/usr/bin/env node

import { execSync } from 'child_process'
import { platform } from 'os'

console.log('🎨 ImageMagick 安装助手\n')

const currentPlatform = platform()

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

if (magickCmd) {
  console.log('✅ ImageMagick 已安装')
  console.log(`   命令: ${magickCmd}`)
  
  // 显示版本信息
  try {
    const version = execSync(`${magickCmd} -version`, { encoding: 'utf8' })
    console.log(`   版本: ${version.split('\n')[0]}`)
  } catch (error) {
    console.log('   版本: 无法获取')
  }
  
  console.log('\n🎉 你可以运行 pnpm generate:icons 来生成高质量图标')
  process.exit(0)
}

console.log('❌ ImageMagick 未安装')
console.log('\n📦 安装说明:')

switch (currentPlatform) {
  case 'win32':
    console.log('Windows:')
    console.log('  1. 访问: https://imagemagick.org/script/download.php#windows')
    console.log('  2. 下载 ImageMagick-7.x.x-Q16-HDRI-x64-dll.exe')
    console.log('  3. 运行安装程序，确保勾选 "Install development headers and libraries for C and C++"')
    console.log('  4. 重启命令行窗口')
    console.log('\n  或者使用 Chocolatey:')
    console.log('    choco install imagemagick')
    console.log('\n  或者使用 Scoop:')
    console.log('    scoop install imagemagick')
    break
    
  case 'darwin':
    console.log('macOS:')
    console.log('  使用 Homebrew (推荐):')
    console.log('    brew install imagemagick')
    console.log('\n  使用 MacPorts:')
    console.log('    sudo port install ImageMagick')
    break
    
  case 'linux':
    console.log('Linux:')
    console.log('  Ubuntu/Debian:')
    console.log('    sudo apt-get update')
    console.log('    sudo apt-get install imagemagick')
    console.log('\n  CentOS/RHEL/Fedora:')
    console.log('    sudo yum install ImageMagick')
    console.log('    # 或者')
    console.log('    sudo dnf install ImageMagick')
    console.log('\n  Arch Linux:')
    console.log('    sudo pacman -S imagemagick')
    break
    
  default:
    console.log('  请访问 https://imagemagick.org/script/download.php 查看适合你系统的安装方法')
}

console.log('\n🔧 安装完成后:')
console.log('  1. 重启终端/命令行')
console.log('  2. 运行 node scripts/install-imagemagick.js 验证安装')
console.log('  3. 运行 pnpm generate:icons 生成高质量图标')

console.log('\n💡 提示:')
console.log('  - ImageMagick 可以生成更高质量的图标')
console.log('  - 支持自动生成 Windows ICO 和 macOS ICNS 格式')
console.log('  - 如果不安装，脚本会使用备用方案（复制原图标）')
