# TODO

按优先级记录下一位 AI 可以继续处理的事项。

## P0：发布闭环

- [ ] 只提交本轮架构和文档改动，不要带入 `.DS_Store`、`fate-direct.yaml`。
- [ ] 推送到 `main`，跟踪 GitHub Actions，确认统一入口和兼容路径部署成功。
- [ ] 成功后把实际 commit、Actions run 和线上验证结果更新到 `docs/PROJECT_CONTEXT.md` 与 `docs/ARCHITECTURE.md`。

## P1：可靠性与可维护性

- [ ] 增加不依赖框架的浏览器 smoke test：首页四卡片、三个问卜入口、八方牌局初始化、旧路径跳转。
- [ ] 处理 `actions/checkout@v4` 的 Node.js 20 弃用提示，并重新验证部署。
- [ ] 为未知 hash 路由增加明确的回首页行为或轻量 404 状态。

## P2：产品与基础设施

- [ ] 配置正式域名和 TLS 证书，替代 IP URL。
- [ ] 评估 PR 检查/staging 环境，避免每次 `main` push 直接进入生产。
- [ ] 明确 `.DS_Store`、`fate-direct.yaml` 的归属；确认后再决定是否加入忽略规则或移出工作区。
