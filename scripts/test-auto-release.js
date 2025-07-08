#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🧪 测试自动化发布配置...\n')

// 1. 检查自动发布工作流文件
console.log('📋 检查工作流文件:')
const autoReleaseWorkflow = join(rootDir, '.github/workflows/auto-release.yml')
if (existsSync(autoReleaseWorkflow)) {
  console.log('✅ auto-release.yml - 存在')
  
  // 检查工作流内容
  const content = readFileSync(autoReleaseWorkflow, 'utf8')
  
  // 检查触发条件
  if (content.includes('push:') && content.includes("paths: ['package.json']")) {
    console.log('✅ 触发条件正确 - 监听 package.json 变更')
  } else {
    console.log('❌ 触发条件可能有问题')
  }
  
  // 检查分支配置
  if (content.includes('branches: [main, master]')) {
    console.log('✅ 分支配置正确 - 监听 main/master 分支')
  } else {
    console.log('❌ 分支配置可能有问题')
  }
  
  // 检查版本检测逻辑
  if (content.includes('check-version') && content.includes('fetch-depth: 2')) {
    console.log('✅ 版本检测逻辑正确')
  } else {
    console.log('❌ 版本检测逻辑可能有问题')
  }
  
  // 检查构建矩阵
  if (content.includes('ubuntu-latest') && content.includes('windows-latest') && content.includes('macos-latest')) {
    console.log('✅ 多平台构建配置正确')
  } else {
    console.log('❌ 多平台构建配置可能有问题')
  }
  
} else {
  console.log('❌ auto-release.yml - 缺失')
}

// 2. 检查 Git 配置
console.log('\n🔧 检查 Git 配置:')
try {
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
  console.log(`✅ 当前分支: ${currentBranch}`)
  
  if (currentBranch === 'main' || currentBranch === 'master') {
    console.log('✅ 在主分支上，符合自动发布条件')
  } else {
    console.log('⚠️  不在主分支上，自动发布不会触发')
  }
  
  const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
  console.log(`✅ 远程仓库: ${remoteUrl}`)
  
  if (remoteUrl.includes('github.com')) {
    console.log('✅ 确认是 GitHub 仓库')
  } else {
    console.log('⚠️  不是 GitHub 仓库，GitHub Actions 不会触发')
  }
} catch (error) {
  console.log('❌ 无法获取 Git 信息')
}

// 3. 检查版本相关文件
console.log('\n📦 检查版本管理:')
const packagePath = join(rootDir, 'package.json')
if (existsSync(packagePath)) {
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
  console.log(`✅ 当前版本: ${pkg.version}`)
  
  // 检查版本同步脚本
  const syncScript = join(rootDir, 'scripts/sync-version.js')
  if (existsSync(syncScript)) {
    console.log('✅ 版本同步脚本存在')
  } else {
    console.log('❌ 版本同步脚本缺失')
  }
  
  // 检查发布脚本
  const releaseScript = join(rootDir, 'scripts/release.js')
  if (existsSync(releaseScript)) {
    console.log('✅ 发布脚本存在')
    
    // 检查发布脚本是否已更新
    const releaseContent = readFileSync(releaseScript, 'utf8')
    if (releaseContent.includes('commitVersionChanges') && !releaseContent.includes('createGitTag')) {
      console.log('✅ 发布脚本已更新为自动化模式')
    } else {
      console.log('⚠️  发布脚本可能需要更新')
    }
  } else {
    console.log('❌ 发布脚本缺失')
  }
} else {
  console.log('❌ package.json 不存在')
}

// 4. 检查文档
console.log('\n📚 检查文档:')
const autoReleaseDoc = join(rootDir, 'docs/AUTO_RELEASE.md')
if (existsSync(autoReleaseDoc)) {
  console.log('✅ 自动化发布文档存在')
} else {
  console.log('❌ 自动化发布文档缺失')
}

const quickReleaseDoc = join(rootDir, 'docs/QUICK_RELEASE.md')
if (existsSync(quickReleaseDoc)) {
  console.log('✅ 快速发布指南存在')
} else {
  console.log('❌ 快速发布指南缺失')
}

// 5. 模拟版本检测
console.log('\n🔍 模拟版本检测:')
try {
  // 获取当前版本
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
  const currentVersion = pkg.version
  
  // 检查是否有对应的标签
  try {
    execSync(`git rev-parse v${currentVersion}`, { stdio: 'ignore' })
    console.log(`⚠️  标签 v${currentVersion} 已存在，不会触发新的发布`)
  } catch {
    console.log(`✅ 标签 v${currentVersion} 不存在，版本变更时会触发发布`)
  }
  
  // 检查工作目录状态
  try {
    execSync('git diff --quiet', { stdio: 'ignore' })
    console.log('✅ 工作目录干净，适合发布')
  } catch {
    console.log('⚠️  工作目录有未提交的变更')
  }
  
} catch (error) {
  console.log('❌ 无法模拟版本检测')
}

console.log('\n🎉 自动化发布配置检查完成！')
console.log('\n💡 使用方法:')
console.log('1. pnpm bump:patch  # 升级版本')
console.log('2. 编辑 CHANGELOG.md')
console.log('3. pnpm release     # 推送并触发自动发布')
console.log('\n🔗 查看详细文档: docs/AUTO_RELEASE.md')
