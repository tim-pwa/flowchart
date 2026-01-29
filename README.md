# 逻辑表单 PWA

一个基于 GitHub Pages 和 Service Worker 的逻辑表单 Progressive Web App (PWA) 应用。

## 功能特性

- ✅ 响应式设计，完美适配移动端
- ✅ PWA 支持，可安装到手机主屏幕
- ✅ Service Worker 离线缓存
- ✅ 三栏布局（侧边栏、顶部栏、内容区）
- ✅ 触摸手势支持
- ✅ 现代化 UI 设计

## 项目结构

```
flowchart/
├── index.html          # 主 HTML 文件
├── styles.css          # 样式文件
├── app.js             # 主 JavaScript 逻辑
├── service-worker.js  # Service Worker
├── manifest.json      # PWA 配置文件
├── icon-192.png      # 应用图标 192x192
├── icon-512.png      # 应用图标 512x512
└── README.md         # 项目说明
```

## 图标生成

您需要创建两个图标文件：

1. **icon-192.png** (192x192 像素)
2. **icon-512.png** (512x512 像素)

可以使用以下工具生成：
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- 或使用任何图片编辑工具

## 部署到 GitHub Pages

### 1. 创建 GitHub 仓库

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/flowchart.git
git push -u origin main
```

### 2. 启用 GitHub Pages

1. 进入仓库的 Settings
2. 找到 Pages 选项
3. 选择 Source 为 `main` 分支
4. 选择 `/ (root)` 文件夹
5. 点击 Save

### 3. 访问应用

应用将在以下地址可用：
`https://yourusername.github.io/flowchart/`

## 本地开发

### 使用 Python 简单服务器

```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### 使用 Node.js http-server

```bash
npx http-server -p 8000
```

然后访问 `http://localhost:8000`

## 注意事项

1. **Service Worker 路径**：确保 Service Worker 的路径与您的 GitHub Pages 路径匹配（当前设置为 `/flowchart/`）
2. **HTTPS 要求**：Service Worker 需要 HTTPS 环境（GitHub Pages 自动提供）
3. **图标文件**：记得添加图标文件，否则 PWA 安装可能失败

## 自定义配置

### 修改颜色主题

在 `styles.css` 中修改 CSS 变量：

```css
:root {
    --primary-color: #4A90E2;
    --secondary-color: #5BA3F5;
    --sidebar-bg: #2C3E50;
    --topbar-bg: #34495E;
    --content-bg: #ECF0F1;
}
```

### 修改 Service Worker 缓存策略

在 `service-worker.js` 中调整缓存策略和资源列表。

## 浏览器支持

- Chrome/Edge (推荐)
- Firefox
- Safari (iOS 11.3+)
- Samsung Internet

## 许可证

MIT License
