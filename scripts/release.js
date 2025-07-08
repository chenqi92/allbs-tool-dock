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
    // 使用 CI 模式运行测试，避免监听模式
    execSync('pnpm --filter shell test:ci', { stdio: 'inherit', cwd: rootDir })
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

// 提交版本变更
function commitVersionChanges() {
  console.log('\n📝 提交版本变更...')
  try {
    // 检查是否有变更
    try {
      execSync('git diff --quiet', { stdio: 'ignore' })
      console.log('📋 没有检测到变更')
      return true
    } catch {
      // 有变更，需要提交
    }

    execSync('git add .', { stdio: 'inherit' })
    execSync(`git commit -m "chore: bump version to ${version}"`, { stdio: 'inherit' })
    console.log(`✅ 已提交版本变更: ${version}`)
    return true
  } catch {
    console.log('❌ 提交版本变更失败')
    return false
  }
}

// 推送到远程
function pushToRemote() {
  console.log('\n📤 推送到远程仓库...')
  try {
    // 获取当前分支名
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
    execSync(`git push origin ${currentBranch}`, { stdio: 'inherit' })
    console.log('✅ 推送完成')
    console.log('🤖 GitHub Actions 将自动检测版本变更并创建发布')
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
    { name: '提交版本变更', fn: commitVersionChanges },
    { name: '推送到远程', fn: pushToRemote }
  ]

  for (const step of steps) {
    if (!step.fn()) {
      console.log(`\n❌ 发布失败: ${step.name}`)
      process.exit(1)
    }
  }

  console.log('\n🎉 发布流程完成！')
  console.log(`📋 版本 ${version} 已推送到远程`)
  console.log('🤖 GitHub Actions 将自动检测版本变更并：')
  console.log('   1. 创建 Git 标签')
  console.log('   2. 构建多平台应用包')
  console.log('   3. 创建 GitHub Release')
  console.log('   4. 上传构建产物')
  console.log('\n🔗 查看构建进度: https://github.com/your-repo/actions')
}

main().catch(console.error)
