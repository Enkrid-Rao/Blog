# rxx's notes

基于 [MkDocs](https://www.mkdocs.org/) + [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 构建的个人笔记本，主要记录数学、物理、编程等领域的学习内容。

在线访问：[251890411.xyz](https://251890411.xyz)

## 技术栈

- **框架**：MkDocs + Material for MkDocs
- **数学渲染**：MathJax 3（`pymdownx.arithmatex`）
- **字体**：霞鹜文楷（LXGW WenKai）
- **部署**：[Vercel](https://vercel.com)
- **许可证**：内容 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)，代码 MIT

## 本地开发

```bash
# 安装依赖
pip install mkdocs-material

# 启动开发服务器（热重载）
mkdocs serve

# 构建静态站点
mkdocs build
```

构建输出在 `site/` 目录。

## 目录结构

```
docs/
├── index.md              # 首页
├── 关于/                 # 关于本站 & 阅读指南
├── 数学/
│   └── 数论/             # 数论笔记（数论函数、二次剩余等）
├── 物理/
└── 编程/
```

## 自定义功能

- **多配色主题**：亮色 / 暗色 / 护眼暖黄三套配色，可通过顶部调色盘切换，主题偏好储存在 localStorage
- **页面浏览量**：基于 CountAPI 的 PV 计数器，显示在页面底部
- **学术排版**：行间公式以浮动笔记样式呈现，引用块采用旁注风格
