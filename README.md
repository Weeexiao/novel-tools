# 小说工具集 - Novel Tools

一个现代化的小说写作辅助工具集合，专为中文小说创作优化。

## ✨ 功能特性

- **小说拆分器**: 智能识别章节格式，支持批量导出
- **现代化UI**: 响应式设计，支持深色模式
- **拖拽上传**: 便捷的文件上传体验
- **实时预览**: 即时查看处理结果

## 🚀 技术栈

- **Next.js 15.4.4** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

## 🌐 在线访问

访问 [GitHub Pages 部署版本](https://yourusername.github.io/novel-tools)

## 🛠️ 本地开发

```bash
# 克隆项目
git clone https://github.com/yourusername/novel-tools.git
cd novel-tools

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📦 部署到GitHub Pages

1. Fork 这个仓库
2. 在 Settings > Pages 中启用 GitHub Pages
3. 选择 GitHub Actions 作为部署源
4. 将 `package.json` 中的 `homepage` 改为你的仓库地址
5. 推送代码到 main 分支，自动部署

## 🎯 使用说明

1. 访问网站首页
2. 选择"小说拆分器"工具
3. 拖拽或选择TXT格式的小说文件
4. 系统将自动识别章节并拆分
5. 下载拆分后的章节文件

## 📄 支持格式

- **输入**: .txt 格式小说文件
- **输出**: .txt 格式章节文件，支持ZIP打包
- **最大文件**: 10MB

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License
