#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🔄 同步版本号...\n')

// 读取根 package.json 的版本
const rootPackagePath = join(rootDir, 'package.json')
const rootPackage = JSON.parse(readFileSync(rootPackagePath, 'utf8'))
const version = rootPackage.version

console.log(`📦 当前版本: ${version}`)

// 需要同步版本的文件
const filesToSync = [
  {
    path: join(rootDir, 'apps/shell/tauri.conf.json'),
    name: 'Tauri 配置',
    update: (content) => {
      const config = JSON.parse(content)
      config.version = version
      return JSON.stringify(config, null, 2)
    }
  },
  {
    path: join(rootDir, 'apps/shell/Cargo.toml'),
    name: 'Cargo 配置',
    update: (content) => {
      return content.replace(/^version = ".*"$/m, `version = "${version}"`)
    }
  },
  {
    path: join(rootDir, 'ui/shell/package.json'),
    name: 'Shell UI 包配置',
    update: (content) => {
      const pkg = JSON.parse(content)
      pkg.version = version
      return JSON.stringify(pkg, null, 2)
    }
  }
]

let syncCount = 0

// 同步所有文件
filesToSync.forEach(({ path, name, update }) => {
  try {
    const content = readFileSync(path, 'utf8')
    const updatedContent = update(content)
    writeFileSync(path, updatedContent)
    console.log(`✅ ${name}: ${path}`)
    syncCount++
  } catch (error) {
    console.log(`⚠️  ${name}: ${path} (文件不存在或更新失败)`)
    console.log(`   错误: ${error.message}`)
  }
})

console.log(`\n🎉 版本同步完成！已更新 ${syncCount} 个文件`)
console.log(`📋 所有文件现在都使用版本: ${version}`)

// 检查是否有 Git 变更
try {
  const { execSync } = await import('child_process')
  
  // 检查是否有未提交的更改
  try {
    execSync('git diff --quiet', { stdio: 'ignore' })
    console.log('\n📝 没有检测到 Git 变更')
  } catch {
    console.log('\n📝 检测到 Git 变更，建议提交:')
    console.log('   git add .')
    console.log(`   git commit -m "chore: bump version to ${version}"`)
    console.log(`   git tag v${version}`)
    console.log('   git push origin main --tags')
  }
} catch (error) {
  console.log('\n⚠️  无法检查 Git 状态')
}
