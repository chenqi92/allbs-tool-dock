#!/usr/bin/env node

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🚀 开始发布流程...\n')

// 读取当前版本
const packagePath = join(rootDir, 'package.json')
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
const version = pkg.version

console.log(`📦 当前版本: ${version}`)

// 检查工作目录是否干净
function checkGitStatus() {
  try {
    execSync('git diff --quiet', { stdio: 'ignore' })
    execSync('git diff --cached --quiet', { stdio: 'ignore' })
    console.log('✅ Git 工作目录干净')
    return true
  } catch {
    console.log('❌ Git 工作目录有未提交的更改')
    console.log('   请先提交所有更改后再发布')
    return false
  }
}

// 运行测试
function runTests() {
  console.log('\n🧪 运行测试...')
  try {
    execSync('pnpm test', { stdio: 'inherit', cwd: rootDir })
    console.log('✅ 测试通过')
    return true
  } catch {
    console.log('❌ 测试失败')
    return false
  }
}

// 同步版本
function syncVersions() {
  console.log('\n🔄 同步版本号...')
  try {
    execSync('node scripts/sync-version.js', { stdio: 'inherit', cwd: rootDir })
    console.log('✅ 版本同步完成')
    return true
  } catch {
    console.log('❌ 版本同步失败')
    return false
  }
}

// 创建 Git 标签
function createGitTag() {
  console.log('\n🏷️  创建 Git 标签...')
  try {
    const tagName = `v${version}`
    
    // 检查标签是否已存在
    try {
      execSync(`git rev-parse ${tagName}`, { stdio: 'ignore' })
      console.log(`⚠️  标签 ${tagName} 已存在`)
      return false
    } catch {
      // 标签不存在，可以创建
    }
    
    execSync(`git tag ${tagName}`, { stdio: 'inherit' })
    console.log(`✅ 创建标签: ${tagName}`)
    return true
  } catch {
    console.log('❌ 创建标签失败')
    return false
  }
}

// 推送到远程
function pushToRemote() {
  console.log('\n📤 推送到远程仓库...')
  try {
    // 获取当前分支名
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
    execSync(`git push origin ${currentBranch} --tags`, { stdio: 'inherit' })
    console.log('✅ 推送完成')
    return true
  } catch {
    console.log('❌ 推送失败')
    return false
  }
}

// 主流程
async function main() {
  const steps = [
    { name: '检查 Git 状态', fn: checkGitStatus },
    { name: '运行测试', fn: runTests },
    { name: '同步版本', fn: syncVersions },
    { name: '创建标签', fn: createGitTag },
    { name: '推送到远程', fn: pushToRemote }
  ]
  
  for (const step of steps) {
    if (!step.fn()) {
      console.log(`\n❌ 发布失败: ${step.name}`)
      process.exit(1)
    }
  }
  
  console.log('\n🎉 发布流程完成！')
  console.log(`📋 版本 ${version} 已发布`)
  console.log('🔗 GitHub Actions 将自动构建和发布到 Releases')
  console.log('   查看进度: https://github.com/your-repo/actions')
}

main().catch(console.error)
