# GitHub Actions 发布故障排除

## 🔍 问题诊断

### 1. 快速检查

```bash
# 运行诊断脚本
pnpm check:release

# 测试发布流程
pnpm test:release
```

### 2. 常见问题及解决方案

#### ❌ 推送标签后 GitHub Actions 没有触发

**可能原因：**
1. **标签格式错误**
   - ✅ 正确格式：`v1.0.0`, `v0.1.0-beta.1`
   - ❌ 错误格式：`1.0.0`, `release-1.0.0`

2. **GitHub Actions 被禁用**
   ```
   解决方案：
   1. 访问仓库设置 → Actions → General
   2. 确保 "Allow all actions and reusable workflows" 已启用
   ```

3. **工作流文件路径错误**
   ```
   检查文件是否存在：
   .github/workflows/release.yml
   ```

4. **权限不足**
   ```
   检查仓库设置 → Actions → General → Workflow permissions
   确保选择 "Read and write permissions"
   ```

#### ❌ 工作流触发但构建失败

**检查步骤：**

1. **查看 Actions 日志**
   ```
   访问：https://github.com/YOUR_USERNAME/YOUR_REPO/actions
   点击失败的工作流查看详细日志
   ```

2. **常见构建错误**

   **Node.js 依赖安装失败：**
   ```yaml
   # 确保 package.json 中的依赖正确
   # 检查 pnpm-lock.yaml 是否存在
   ```

   **Rust 编译失败：**
   ```yaml
   # 检查 Cargo.toml 语法
   # 确保所有依赖版本兼容
   ```

   **Tauri 构建失败：**
   ```yaml
   # 检查 tauri.conf.json 配置
   # 确保图标文件存在
   ```

3. **系统依赖问题（Linux）**
   ```bash
   # 工作流中已包含，但如果失败检查：
   sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf
   ```

#### ❌ Release 创建失败

**可能原因：**

1. **GITHUB_TOKEN 权限不足**
   ```
   解决方案：
   1. 仓库设置 → Actions → General
   2. 确保 "Allow GitHub Actions to create and approve pull requests" 已启用
   ```

2. **标签已存在**
   ```bash
   # 删除现有标签
   git tag -d v1.0.0
   git push origin :refs/tags/v1.0.0
   ```

3. **CHANGELOG.md 格式问题**
   ```markdown
   # 确保格式正确
   ## [1.0.0] - 2024-07-08
   ### Added
   - 新功能描述
   ```

## 🛠️ 手动修复步骤

### 1. 重新触发工作流

```bash
# 方法1：删除并重新创建标签
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0
git tag v1.0.0
git push origin v1.0.0

# 方法2：手动触发工作流
# 访问 GitHub → Actions → Release → Run workflow
```

### 2. 本地测试构建

```bash
# 测试前端构建
pnpm --filter shell build

# 测试 Tauri 构建
cd apps/shell
cargo tauri build
```

### 3. 检查配置文件

```bash
# 检查版本同步
pnpm sync:version

# 检查图标
pnpm check:icons

# 验证 JSON 语法
node -e "console.log(JSON.parse(require('fs').readFileSync('apps/shell/tauri.conf.json', 'utf8')))"
```

## 🔧 GitHub 仓库设置检查

### Actions 权限设置

1. **访问仓库设置**
   ```
   GitHub 仓库 → Settings → Actions → General
   ```

2. **Actions permissions**
   ```
   ✅ Allow all actions and reusable workflows
   ```

3. **Workflow permissions**
   ```
   ✅ Read and write permissions
   ✅ Allow GitHub Actions to create and approve pull requests
   ```

### Secrets 配置（如需要）

```
仓库设置 → Secrets and variables → Actions

常用 Secrets：
- GITHUB_TOKEN (自动提供，无需手动设置)
- TAURI_PRIVATE_KEY (如果使用代码签名)
- TAURI_KEY_PASSWORD (如果使用代码签名)
```

## 📊 监控和调试

### 1. 实时监控

```bash
# 监控工作流状态
watch -n 30 'curl -s "https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/actions/runs" | jq ".workflow_runs[0] | {status, conclusion, created_at}"'
```

### 2. 日志分析

**下载工作流日志：**
```bash
# 使用 GitHub CLI
gh run download RUN_ID

# 或访问 Actions 页面手动下载
```

### 3. 构建时间优化

**缓存策略：**
```yaml
# Cargo 缓存
- uses: actions/cache@v3
  with:
    path: |
      ~/.cargo/registry
      ~/.cargo/git
      target
    key: ${{ runner.os }}-cargo-${{ hashFiles('**/Cargo.lock') }}

# Node.js 缓存
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

## 🚨 紧急修复

### 发布失败后的快速恢复

1. **回滚到上一版本**
   ```bash
   # 如果新版本有问题，可以重新发布上一版本
   git checkout v0.9.0
   git tag v0.9.1
   git push origin v0.9.1
   ```

2. **修复并重新发布**
   ```bash
   # 修复问题
   git add .
   git commit -m "fix: critical issue"
   
   # 升级补丁版本
   pnpm bump:patch
   
   # 重新发布
   pnpm release
   ```

## 📞 获取帮助

### 1. 检查资源

- [Tauri 文档](https://tauri.app/v1/guides/distribution/publishing)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [项目 Issues](https://github.com/YOUR_USERNAME/YOUR_REPO/issues)

### 2. 报告问题

创建 Issue 时请包含：
- 错误日志
- 工作流运行链接
- 系统环境信息
- 复现步骤

### 3. 社区支持

- GitHub Discussions
- Tauri Discord
- Stack Overflow (标签: tauri, github-actions)
