# 小说创作工具集

为现代作家打造的AI驱动创作平台，让创作更高效，让灵感更自由。

## 功能特性

- 📚 **小说章节拆解** - 将txt格式的小说按章节拆解成单独的Markdown文档
- 👤 **角色生成器** - 创建丰富的人物设定和背景故事
- 📝 **角色名生成器** - 为你的小说角色生成合适的名字
- 🧭 **情节助手** - 协助构建故事情节和发展脉络
- 🌍 **世界观构建** - 创建完整的世界设定和背景体系（开发中）
- 🎨 **文风分析** - 分析和模仿不同作者的写作风格

## 技术栈

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

## 本地开发

1. 安装依赖：
   ```bash
   npm install
   ```

2. 启动开发服务器：
   ```bash
   npm run dev
   ```

3. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 构建和部署

### 构建静态站点
```bash
npm run build
```

### 部署到 GitHub Pages
此项目配置了 GitHub Actions 工作流，推送到 `main` 分支时会自动部署到 GitHub Pages。

手动部署命令：
```bash
npm run deploy
```

## 项目结构

```
src/
├── app/              # Next.js App Router 页面
│   ├── tools/        # 各种工具页面
│   └── components/   # 公共组件
├── components/       # UI 组件库
├── lib/              # 工具函数和配置
└── public/           # 静态资源
```

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

## 许可证

[MIT](LICENSE)
