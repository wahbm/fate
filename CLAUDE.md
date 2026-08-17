# fate：AI 开发说明

## 接手顺序

开始改代码前，依次阅读：

1. `AGENTS.md`
2. `docs/PROJECT_CONTEXT.md`
3. `docs/ARCHITECTURE.md`
4. `docs/TODO.md`

然后运行 `git status --short --branch`，确认当前工作区改动归属。不要假设远端或线上已经包含工作区改动。

## 项目约束

- 项目是无构建步骤的原生 HTML/CSS/JavaScript SPA，唯一生产入口是根目录 `index.html`。
- 路由使用 URL hash：`#/`、`#/wenbu/*`、`#/eight-gates`。不要重新引入“每个功能一个独立部署页”的架构。
- `wenbu/app.js` 和 `eight-gates/app.js` 必须保持可挂载视图的 `mount(...)` 契约，并在离开路由时清理状态/监听器。
- 旧的 `/wenbu/`、`/eight-gates/` 目录只负责兼容 bootstrap（直接加载根应用并设置默认 hash）；不要在其中恢复完整业务页面或独立业务逻辑。
- 没有 `package.json`、构建产物或自动化测试套件；修改后至少运行文档中列出的语法、差异和本地浏览器检查。

## 交付边界

除非用户明确要求，不要自动提交、推送、部署或创建 PR。`main` 的 push 会触发生产部署；部署相关上下文和变量名称见 `docs/ARCHITECTURE.md`。
