# AGENTS.md

本文件是仓库级 AI 开发规则，适用于整个项目。

## 工作方式

- 先读 `docs/PROJECT_CONTEXT.md`、`docs/ARCHITECTURE.md` 和 `docs/TODO.md`，再决定改动范围。
- 先检查 `git status` 和 diff；保留用户已有改动，不要使用 `git add -A` 把无关文件带入提交。
- 文件编辑使用可审查的补丁；不要用破坏性命令覆盖或重置用户改动。
- `.DS_Store`、`fate-direct.yaml` 当前是本地未跟踪文件，不要擅自加入项目提交。
- 代码、注释和文档应说明设计约束，不要写实现过程流水账。

## 架构规则

- 根目录 `index.html` 是唯一应用入口；根 `app.js` 负责首页、hash 路由和视图切换。
- 支持路由：`#/`、`#/wenbu`、`#/wenbu/coin`、`#/wenbu/lot`、`#/wenbu/character`、`#/eight-gates`。
- 视图模块通过 `mount(root, ...)` 挂载，查询 DOM 时应限制在传入的 `root` 内；离开路由要释放事件监听器和定时器。
- `wenbu-history-v1` 是已有浏览器本地数据键，除非有迁移方案，不要改名或改变数据结构。
- `eight-gates` 的终局规则和计分规则是产品逻辑，修改前先核对 `docs/ARCHITECTURE.md` 和现有代码注释。

## 部署与 GitHub

- `.github/workflows/deploy.yml` 监听 `main` push，并通过 SSH/rsync 部署到阿里云 ECS；不要把主机、私钥或 known hosts 写进代码。
- 工作流依赖 `DEPLOY_HOST`、`DEPLOY_KNOWN_HOSTS`、`DEPLOY_PATH`、`DEPLOY_PORT`、`DEPLOY_USER` Variables，以及 `SSH_PRIVATE_KEY` Secret。
- 用户明确要求发布时，先确认范围、检查工作流，再推送并跟踪 Actions；不要创建草稿 PR，正式 PR 直接创建。
- 如果 `gh` 认证失败且表现为沙箱权限问题，提升权限后重试一次，再报告结果。

## 最低验证

```bash
git diff --check
node --check app.js
node --check wenbu/app.js
node --check eight-gates/app.js
python3 -m http.server 4173
```

本地服务下检查首页、四个算法路由、旧路径兼容 bootstrap，以及问卜入口和牌局初始化；不要只检查 HTTP 200。
