#!/usr/bin/env node

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// 获取命令行参数
const args = process.argv.slice(2)
const bumpType = args[0] || 'patch'

console.log('📈 版本升级工具\n')

// 验证升级类型
const validBumpTypes = ['major', 'minor', 'patch', 'prerelease']
if (!validBumpTypes.includes(bumpType)) {
  console.error(`❌ 无效的升级类型: ${bumpType}`)
  console.log('✅ 有效类型: major, minor, patch, prerelease')
  console.log('\n示例:')
  console.log('  pnpm bump:patch    # 0.1.0 -> 0.1.1')
  console.log('  pnpm bump:minor    # 0.1.0 -> 0.2.0')
  console.log('  pnpm bump:major    # 0.1.0 -> 1.0.0')
  process.exit(1)
}

// 读取当前版本
const packagePath = join(rootDir, 'package.json')
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
const currentVersion = pkg.version

console.log(`📦 当前版本: ${currentVersion}`)

// 计算新版本
function calculateNewVersion(current, type) {
  const parts = current.split('.').map(Number)
  let [major, minor, patch] = parts
  
  switch (type) {
    case 'major':
      major += 1
      minor = 0
      patch = 0
      break
    case 'minor':
      minor += 1
      patch = 0
      break
    case 'patch':
      patch += 1
      break
    case 'prerelease':
      // 简单的预发布版本处理
      if (current.includes('-')) {
        const [base, pre] = current.split('-')
        const preNum = parseInt(pre.split('.').pop() || '0') + 1
        return `${base}-beta.${preNum}`
      } else {
        return `${current}-beta.1`
      }
  }
  
  return `${major}.${minor}.${patch}`
}

const newVersion = calculateNewVersion(currentVersion, bumpType)
console.log(`🎯 新版本: ${newVersion}`)

// 确认升级
console.log(`\n🔄 升级类型: ${bumpType}`)
console.log(`📋 变更: ${currentVersion} -> ${newVersion}`)

// 更新 package.json
pkg.version = newVersion
writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n')
console.log('✅ 已更新 package.json')

// 同步其他文件的版本
console.log('\n🔄 同步版本到其他文件...')
try {
  execSync('node scripts/sync-version.js', { stdio: 'inherit', cwd: rootDir })
  console.log('✅ 版本同步完成')
} catch (error) {
  console.error('❌ 版本同步失败:', error.message)
  process.exit(1)
}

// 生成变更日志条目
const changelogEntry = `
## [${newVersion}] - ${new Date().toISOString().split('T')[0]}

### Added
- 

### Changed
- 

### Fixed
- 

### Removed
- 
`

console.log('\n📝 建议的变更日志条目:')
console.log(changelogEntry)

console.log('\n✨ 下一步:')
console.log('1. 编辑 CHANGELOG.md 添加变更内容')
console.log('2. 提交更改:')
console.log(`   git add .`)
console.log(`   git commit -m "chore: bump version to ${newVersion}"`)
console.log('3. 发布版本:')
console.log('   pnpm release')

console.log('\n💡 或者直接运行发布流程:')
console.log('   pnpm release')
