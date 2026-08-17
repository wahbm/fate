# Architecture

## 总体结构

这是一个静态 SPA：

```text
/fate/index.html
        │
        └── app.js
             ├── #/                  → FATE 首页
             ├── #/wenbu/*           → wenbu/app.js mount(root, method)
             └── #/eight-gates       → eight-gates/app.js mount(root)
```

根 `app.js` 负责解析 hash、清空当前视图、加载对应页面 CSS、挂载新视图和更新 `document.title`。不使用服务器端路由 fallback，因此 hash 是部署约束的一部分。

## 目录职责

- `index.html`：唯一生产入口，只提供 `#app` 容器和根模块。
- `app.js`：首页模板、算法卡片、路由解析、动态视图 CSS 管理。
- `styles.css`：FATE 首页国风视觉；功能页样式仍分别位于各模块目录。
- `wenbu/app.js`：导出 `mount(root, initialMethod)`，负责问卜视图和本地历史。
- `wenbu/fortune-data.js`：八卦、六十四卦和测字数据源。
- `eight-gates/app.js`：导出 `mount(root)`，负责牌局状态机、动画和结算。
- `wenbu/index.html`、`eight-gates/index.html`：旧书签兼容跳转，不是业务入口。
- `.github/workflows/deploy.yml`：生产部署和统一入口验证。

## 视图生命周期

1. 根路由解析 hash。
2. 调用上一个视图返回的 cleanup，并清空 `#app`。
3. 移除上一个视图 CSS，插入当前视图 CSS。
4. 调用对应模块的 `mount`。
5. 离开路由时必须清理事件监听器、定时器和 DOM 引用。

`wenbu` 使用 `AbortController` 清理根事件监听器；`eight-gates` 清理终局定时器。新增视图应遵循同样的 mount/cleanup 约定。

## 状态边界

- 根路由状态只来自 `window.location.hash`，不写入后端。
- `wenbu-history-v1` 是问卜历史的浏览器本地存储键，最多保留十条。
- `wenbu` 的卦辞和测字映射均来自仓库内静态数据。
- `eight-gates` 使用随机洗牌，牌局和结算只存在当前页面内存，刷新即重开。

## 部署

- `main` push 或手动 `workflow_dispatch` 触发部署。
- Actions checkout 后，用 SSH 创建 `${DEPLOY_PATH}`，再用 `rsync --delete` 同步仓库内容。
- 配置来自 `DEPLOY_HOST`、`DEPLOY_KNOWN_HOSTS`、`DEPLOY_PATH`、`DEPLOY_PORT`、`DEPLOY_USER` Variables 和 `SSH_PRIVATE_KEY` Secret。
- 工作流至少验证 `/fate/` 返回包含 `id="app"`，并检查旧 `/fate/eight-gates/` 路径可访问。
- 线上最后确认的旧基线页面是 `https://8.130.116.192/fate/wenbu/` 和 `https://8.130.116.192/fate/eight-gates/`；本轮改造部署后，入口应使用 `https://8.130.116.192/fate/#/`。

## 关键设计决策

- 使用 hash 路由，避免为静态 ECS/Nginx 增加 fallback 配置。
- 统一入口展示所有能力，功能模块只负责视图和业务逻辑。
- 保留旧目录作为兼容跳转，避免已有书签失效。
- 按路由动态加载功能页 CSS，避免两个旧页面的全局样式互相污染首页和彼此。
- 不引入框架、打包器或运行时依赖；修改应保持可直接静态托管。

## 验证命令

```bash
git diff --check
node --check app.js
node --check wenbu/app.js
node --check eight-gates/app.js
python3 -m http.server 4173
```

浏览器中验证 `#/`、三个 `#/wenbu/*` 入口、`#/eight-gates`、问卜按钮交互、返回首页以及 `/wenbu/` 和 `/eight-gates/` 兼容跳转。
