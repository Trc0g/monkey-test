# OpenAPI 转 MCP

这是长亭百智云中的 OpenAPI 转 MCP 控制台前端，用于管理 MCP 服务、查看调用统计、审计调用日志，并提供快速接入配置示例。

## 技术栈

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- shadcn/ui

## 快速开始

```bash
pnpm install

pnpm dev
```

默认启动后可访问本地 Vite 开发服务。

## 常用命令

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm typecheck
pnpm format
```

## 项目结构

```text
src/
  components/
    app-sidebar.tsx         # 应用侧边栏
    nav-console-pages.tsx   # 控制台页面导航
    ui/                     # shadcn/ui 组件
  lib/
    console-pages.tsx       # 控制台路由与导航配置
    mcp-services.ts         # MCP 服务演示数据
  pages/
    analytics-page.tsx              # 统计分析
    logs-page.tsx                   # 调用日志
    mcp-service-detail-page.tsx     # 服务详情与快速接入
    mcp-services-page.tsx           # MCP 服务列表与创建流程
  App.tsx                   # 路由入口
  console.tsx               # 控制台壳层与面包屑
```

## 功能说明

- 左侧导航页面配置集中在 `src/lib/console-pages.tsx`。
- MCP 服务演示数据集中在 `src/lib/mcp-services.ts`。
- 控制台整体布局在 `src/console.tsx`，包含面包屑、主题切换和内容出口。
- 服务详情页提供 MCP Server URL、API Base URL、API Key、快速接入配置示例和工具列表。
- 日志页支持状态筛选、日志详情查看、分页和每页条数配置。

## 添加 UI 组件

项目已集成 `shadcn/ui`。新增组件时可使用：

```bash
pnpm dlx shadcn@latest add button
```

新增后的组件默认放在 `src/components/ui` 下。
