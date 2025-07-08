# 应用图标

这个目录包含 KKAPE Gearbox 应用程序的图标文件。

## 📁 图标文件

| 文件名 | 尺寸 | 用途 |
|--------|------|------|
| `32x32.png` | 32×32 | 小图标，任务栏 |
| `128x128.png` | 128×128 | 中等图标，应用列表 |
| `128x128@2x.png` | 256×256 | 高分辨率图标，Retina 显示器 |
| `icon.ico` | 多尺寸 | Windows 应用图标 |
| `icon.icns` | 多尺寸 | macOS 应用图标 |

## 🛠️ 自动生成

这些图标是通过自动化脚本从根目录的 `icon.png` 生成的：

```bash
# 生成所有图标
pnpm generate:icons

# 检查图标状态
pnpm check:icons

# 安装 ImageMagick (可选，用于高质量图标)
pnpm install:imagemagick
```

## 📋 图标要求

### 源图标 (`icon.png`)
- **格式**: PNG
- **尺寸**: 512×512 或更高（推荐 1024×1024）
- **背景**: 透明
- **设计**: 简洁明了，避免过多细节

### 设计建议
- ✅ 使用简单的几何形状
- ✅ 高对比度的颜色
- ✅ 在小尺寸下仍然清晰可辨
- ❌ 避免细小的文字
- ❌ 避免过于复杂的细节

## 🔧 手动生成（高级）

如果需要手动生成图标，可以使用 ImageMagick：

```bash
# 安装 ImageMagick
# Windows: https://imagemagick.org/script/download.php#windows
# macOS: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# 生成 PNG 图标
magick icon.png -resize 32x32 32x32.png
magick icon.png -resize 128x128 128x128.png
magick icon.png -resize 256x256 128x128@2x.png

# 生成 Windows ICO
magick icon.png -resize 16x16 icon.png -resize 32x32 icon.png -resize 48x48 icon.png -resize 64x64 icon.png -resize 128x128 icon.png -resize 256x256 icon.ico

# 生成 macOS ICNS (仅在 macOS 上)
mkdir icon.iconset
magick icon.png -resize 16x16 icon.iconset/icon_16x16.png
magick icon.png -resize 32x32 icon.iconset/icon_16x16@2x.png
magick icon.png -resize 32x32 icon.iconset/icon_32x32.png
magick icon.png -resize 64x64 icon.iconset/icon_32x32@2x.png
magick icon.png -resize 128x128 icon.iconset/icon_128x128.png
magick icon.png -resize 256x256 icon.iconset/icon_128x128@2x.png
magick icon.png -resize 256x256 icon.iconset/icon_256x256.png
magick icon.png -resize 512x512 icon.iconset/icon_256x256@2x.png
magick icon.png -resize 512x512 icon.iconset/icon_512x512.png
magick icon.png -resize 1024x1024 icon.iconset/icon_512x512@2x.png
iconutil -c icns icon.iconset
rm -rf icon.iconset
```

## 🎨 在线工具

如果不想使用命令行，可以使用这些在线工具：

- [favicon.io](https://favicon.io/) - 免费图标生成器
- [realfavicongenerator.net](https://realfavicongenerator.net/) - 专业图标生成
- [iconifier.net](https://iconifier.net/) - 多格式图标转换

## 📦 打包集成

图标已自动配置到 Tauri 构建系统中：

- **Windows**: 生成 `.msi` 安装包时自动包含 ICO 图标
- **macOS**: 生成 `.dmg` 时自动包含 ICNS 图标
- **Linux**: 生成 `.AppImage` 时自动包含 PNG 图标

## 🔍 验证

构建完成后，可以通过以下方式验证图标：

1. **Windows**: 查看 `.exe` 文件属性
2. **macOS**: 在 Finder 中查看应用图标
3. **Linux**: 在应用菜单中查看图标

## 📝 更新图标

要更新应用图标：

1. 替换根目录的 `icon.png`
2. 运行 `pnpm generate:icons`
3. 运行 `pnpm check:icons` 验证
4. 重新构建应用
