#!/usr/bin/env node

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🧪 测试发布流程...\n')

// 读取当前版本
const packagePath = join(rootDir, 'package.json')
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
const version = pkg.version

console.log(`📦 当前版本: ${version}`)

// 获取当前分支
const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
console.log(`🌿 当前分支: ${currentBranch}`)

// 检查 Git 状态
console.log('\n🔍 检查 Git 状态...')
try {
  execSync('git diff --quiet', { stdio: 'ignore' })
  execSync('git diff --cached --quiet', { stdio: 'ignore' })
  console.log('✅ Git 工作目录干净')
} catch {
  console.log('⚠️  Git 工作目录有未提交的更改')
  console.log('   继续测试流程...')
}

// 创建测试标签
const testTag = `v${version}-test`
console.log(`\n🏷️  创建测试标签: ${testTag}`)

try {
  // 检查标签是否已存在
  try {
    execSync(`git rev-parse ${testTag}`, { stdio: 'ignore' })
    console.log(`⚠️  标签 ${testTag} 已存在，删除旧标签...`)
    execSync(`git tag -d ${testTag}`, { stdio: 'ignore' })
    execSync(`git push origin :refs/tags/${testTag}`, { stdio: 'ignore' })
  } catch {
    // 标签不存在，继续
  }
  
  // 创建新标签
  execSync(`git tag ${testTag}`, { stdio: 'inherit' })
  console.log(`✅ 创建标签: ${testTag}`)
  
  // 推送标签
  console.log('\n📤 推送测试标签...')
  execSync(`git push origin ${testTag}`, { stdio: 'inherit' })
  console.log('✅ 推送完成')
  
  console.log('\n🎉 测试标签创建成功！')
  console.log(`📋 标签名称: ${testTag}`)
  console.log('🔗 请检查 GitHub Actions:')
  console.log('   1. 访问: https://github.com/chenqi92/allbs-tool-dock/actions')
  console.log('   2. 查看是否有新的工作流运行')
  console.log('   3. 检查 Release 工作流的状态')
  
  console.log('\n⏰ 等待几分钟后检查:')
  console.log('   - GitHub Actions 页面')
  console.log('   - GitHub Releases 页面')
  
  console.log('\n🧹 清理测试标签 (可选):')
  console.log(`   git tag -d ${testTag}`)
  console.log(`   git push origin :refs/tags/${testTag}`)
  
} catch (error) {
  console.error('❌ 测试失败:', error.message)
  process.exit(1)
}
