#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🔍 检查 GitHub Actions 发布配置...\n')

// 1. 检查工作流文件
console.log('📋 检查工作流文件:')
const workflowFiles = [
  '.github/workflows/release.yml',
  '.github/workflows/prerelease.yml',
  '.github/workflows/ci.yml'
]

workflowFiles.forEach(file => {
  const filePath = join(rootDir, file)
  if (existsSync(filePath)) {
    console.log(`✅ ${file} - 存在`)
  } else {
    console.log(`❌ ${file} - 缺失`)
  }
})

// 2. 检查 Git 配置
console.log('\n🔧 检查 Git 配置:')
try {
  const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()
  console.log(`✅ 远程仓库: ${remoteUrl}`)
  
  // 检查是否是 GitHub 仓库
  if (remoteUrl.includes('github.com')) {
    console.log('✅ 确认是 GitHub 仓库')
  } else {
    console.log('⚠️  不是 GitHub 仓库，GitHub Actions 不会触发')
  }
} catch (error) {
  console.log('❌ 无法获取远程仓库信息')
}

// 3. 检查标签
console.log('\n🏷️  检查 Git 标签:')
try {
  const tags = execSync('git tag -l', { encoding: 'utf8' }).trim()
  if (tags) {
    const tagList = tags.split('\n')
    console.log(`✅ 找到 ${tagList.length} 个标签:`)
    tagList.slice(-5).forEach(tag => {
      console.log(`   - ${tag}`)
    })
    
    // 检查最新标签是否已推送
    const latestTag = tagList[tagList.length - 1]
    try {
      execSync(`git ls-remote --tags origin ${latestTag}`, { stdio: 'ignore' })
      console.log(`✅ 最新标签 ${latestTag} 已推送到远程`)
    } catch {
      console.log(`❌ 最新标签 ${latestTag} 未推送到远程`)
    }
  } else {
    console.log('❌ 没有找到任何标签')
  }
} catch (error) {
  console.log('❌ 无法获取标签信息')
}

// 4. 检查分支
console.log('\n🌿 检查分支状态:')
try {
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
  console.log(`✅ 当前分支: ${currentBranch}`)
  
  // 检查是否有未推送的提交
  try {
    const unpushed = execSync('git log @{u}..HEAD --oneline', { encoding: 'utf8' }).trim()
    if (unpushed) {
      console.log('⚠️  有未推送的提交:')
      unpushed.split('\n').forEach(commit => {
        console.log(`   - ${commit}`)
      })
    } else {
      console.log('✅ 所有提交已推送')
    }
  } catch {
    console.log('⚠️  无法检查未推送的提交（可能没有上游分支）')
  }
} catch (error) {
  console.log('❌ 无法获取分支信息')
}

// 5. 检查 GitHub Actions 权限
console.log('\n🔐 GitHub Actions 权限检查:')
console.log('请手动检查以下设置:')
console.log('1. 仓库设置 → Actions → General')
console.log('2. 确保 "Allow all actions and reusable workflows" 已启用')
console.log('3. 确保 "Read and write permissions" 已启用')
console.log('4. 确保 "Allow GitHub Actions to create and approve pull requests" 已启用')

// 6. 检查工作流语法
console.log('\n📝 检查工作流语法:')
const releaseWorkflow = join(rootDir, '.github/workflows/release.yml')
if (existsSync(releaseWorkflow)) {
  try {
    const content = readFileSync(releaseWorkflow, 'utf8')
    
    // 检查触发条件
    if (content.includes('push:') && content.includes('tags:') && content.includes("- 'v*'")) {
      console.log('✅ 标签触发条件正确')
    } else {
      console.log('❌ 标签触发条件可能有问题')
    }
    
    // 检查 jobs
    if (content.includes('jobs:')) {
      console.log('✅ 包含 jobs 定义')
    } else {
      console.log('❌ 缺少 jobs 定义')
    }
    
    // 检查 runs-on
    if (content.includes('runs-on:')) {
      console.log('✅ 包含 runs-on 定义')
    } else {
      console.log('❌ 缺少 runs-on 定义')
    }
    
  } catch (error) {
    console.log('❌ 无法读取工作流文件')
  }
}

// 7. 生成测试命令
console.log('\n🧪 测试建议:')
console.log('1. 手动触发工作流:')
console.log('   - 访问 GitHub 仓库')
console.log('   - 点击 Actions 标签')
console.log('   - 选择 Release 工作流')
console.log('   - 点击 "Run workflow"')
console.log('')
console.log('2. 创建测试标签:')
console.log('   git tag v0.1.0-test')
console.log('   git push origin v0.1.0-test')
console.log('')
console.log('3. 检查 Actions 日志:')
console.log('   访问: https://github.com/YOUR_USERNAME/YOUR_REPO/actions')

// 8. 常见问题排查
console.log('\n🔧 常见问题排查:')
console.log('❓ 如果工作流没有触发，可能的原因:')
console.log('   1. 标签格式不正确（必须是 v* 格式，如 v1.0.0）')
console.log('   2. GitHub Actions 被禁用')
console.log('   3. 工作流文件语法错误')
console.log('   4. 权限不足')
console.log('   5. 仓库是 fork，需要在 fork 仓库中启用 Actions')
console.log('')
console.log('❓ 如果工作流触发但失败，检查:')
console.log('   1. Actions 日志中的错误信息')
console.log('   2. secrets 配置是否正确')
console.log('   3. 依赖安装是否成功')
console.log('   4. 构建命令是否正确')

console.log('\n🎯 下一步操作:')
console.log('1. 检查上述所有项目')
console.log('2. 访问 GitHub Actions 页面查看状态')
console.log('3. 如有问题，查看具体的错误日志')
console.log('4. 必要时手动触发工作流进行测试')
