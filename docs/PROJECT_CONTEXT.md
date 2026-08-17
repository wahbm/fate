# Project Context

## 项目目标

`fate` 是一个偏国风的浏览器互动项目：把问卜、取象和牌局做成轻量数字仪式，帮助用户停下来观察自己的问题。内容仅供娱乐与自我反思，不替用户做医疗、法律、金融或重大人生决定。

## 当前状态

- 仓库：`wahbm/fate`，默认分支：`main`。
- 最后确认的远端/线上基线：`5253ca4`；GitHub Actions run #13 已成功部署到 ECS。
- 本轮已完成：根入口页、国风首页、hash 路由、可挂载的 `wenbu` / `eight-gates` 视图、旧路径兼容 bootstrap、部署入口校验和线上验证。
- 原 `HANDOFF.md` 已按约定移除；本组文档是新的上下文来源。

## 技术栈

- 原生 HTML、CSS、ES modules、浏览器 DOM API。
- 无框架、无 `package.json`、无构建步骤、无后端和数据库。
- 静态文件由 ECS/Nginx 提供；GitHub Actions 使用 SSH + rsync 发布。
- `wenbu` 的历史记录使用 `localStorage`；`eight-gates` 的牌局只保存在内存。

## 已完成模块

- 统一 FATE 首页：项目介绍、国风视觉、四个支持算法入口。
- 问卜：掷铜钱六爻、六十四卦抽签、单汉字取象、最多十条本地历史记录。
- 八方牌局：52 张牌、八方牌位、中央牌叠、配对、终局检查、酒色财气计分和结算明细。
- 路由：`#/`、`#/wenbu`、`#/wenbu/coin`、`#/wenbu/lot`、`#/wenbu/character`、`#/eight-gates`。
- 旧 `/wenbu/`、`/eight-gates/` URL 保留为兼容 bootstrap，业务不再写在旧 `index.html` 中。

## 当前未完成

1. 增加浏览器 smoke test，覆盖首页、路由、问卜入口和牌局初始化。
2. 如果可以修改 ECS/Nginx，移除 `/fate/` 到 `/fate/eight-gates/` 的 302，让根 `index.html` 成为规范入口；完成前保留兼容 bootstrap。
3. 用正式域名和 TLS 证书替代 IP 访问。
4. 处理 `actions/checkout@v4` 的 Node.js 20 弃用提示。

## 本地命令

```bash
python3 -m http.server 4173
```

打开 `http://localhost:4173/#/`。关键路由和校验命令见 `docs/ARCHITECTURE.md` 与 `AGENTS.md`。
