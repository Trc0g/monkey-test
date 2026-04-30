import * as React from "react"
import {
  BlocksIcon,
  CableIcon,
  ChevronDownIcon,
  CopyIcon,
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const sharedSkillFileName = "SKILL.md"

const sharedSkillContent = [
  "---",
  'name: "baizhi-mcp-skill"',
  'description: "在接入百智 MCP 后，统一约束何时调用百智图片搜索、知识检索和相关工具能力。"',
  "---",
  "",
  "# Trigger",
  "- 用户需要图片搜索结果、知识检索、安装文档、FAQ 或接入排障时触发。",
  "- 当任务明显依赖百智能力而不是通用推理时优先触发。",
  "",
  "# Workflow",
  "1. 先确认百智 MCP 服务已连通。",
  "2. 根据任务类型选择对应的百智工具。",
  "3. 读取 MCP 返回结果后再组织最终回答。",
  "",
  "# Notes",
  "- 不要跳过检索结果直接臆测。",
  "- 返回为空时明确说明并建议用户缩小范围或补充关键词。",
]

const initialApiKeys = [
  {
    id: "bk_live_prod_a1b2",
    name: "生产环境密钥",
    maskedKey: "bz-live-****-****-a1b2",
    activity: "14 天前创建，6 天前使用过",
    enabled: true,
  },
  {
    id: "bk_staging_e5f6",
    name: "预发环境密钥",
    maskedKey: "bz-stag-****-****-e5f6",
    activity: "9 天前创建，2 天前使用过",
    enabled: false,
  },
]

const apiBaseUrl = "https://ragcloud.app.baizhi.cloud/openapi/v1"

const apiReference = {
  heroTitle: "接口列表",
  endpoints: [
    {
      method: "POST",
      methodVariant: "default" as const,
      path: "/documents/text",
      title: "创建文档",
      requestFields: [
        {
          name: "title *",
          location: "body",
          type: "string",
          description: "文档标题，系统会自动生成对应文件名。",
        },
        {
          name: "content *",
          location: "body",
          type: "string",
          description: "文档正文，支持 Markdown 或纯文本。",
        },
      ],
      requestExample: [
        `curl -X POST ${apiBaseUrl}/documents/text \\`,
        '  -H "Authorization: Bearer YOUR_API_KEY" \\',
        '  -H "Content-Type: application/json" \\',
        "  -d '{",
        '    "title": "产品手册",',
        '    "content": "这里是文档正文（Markdown 或纯文本）"',
        "  }'",
      ],
      responseFields: [
        {
          name: "document_id *",
          location: "-",
          type: "string",
          description: "新创建文档的 ID。",
        },
        {
          name: "status *",
          location: "-",
          type: "string",
          description: "文档当前状态，uploaded 表示已入队等待处理。",
        },
      ],
      responseExample: ['{', '  "document_id": "doc_abc123",', '  "status": "uploaded"', "}"],
    },
    {
      method: "PUT",
      methodVariant: "secondary" as const,
      path: "/documents/<document_id>/text",
      title: "更新文档",
    },
    {
      method: "DELETE",
      methodVariant: "destructive" as const,
      path: "/documents/<document_id>",
      title: "删除文档",
    },
  ],
}

const accessMethods = [
  {
    value: "mcp",
    title: "MCP",
    icon: CableIcon,
    summary: "面向 MCP Server 接入场景，提供不同 agent 的快速接入命令和配置模板。",
    highlights: ["Server 配置", "工具声明", "资源暴露", "调试验证"],
    agents: [
      {
        value: "auto-install",
        title: "自动安装",
        prompt:
          "请按照以下文档安装并配置：\n\nhttps://imgsearch.app.baizhi.cloud/docs/agent_installation.md",
        skillFileName: sharedSkillFileName,
        skillContent: sharedSkillContent,
      },
      {
        value: "openclaw",
        title: "OpenClaw",
        skillFileName: sharedSkillFileName,
        skillContent: sharedSkillContent,
        steps: [
          {
            title: "修改 MCP 配置文件",
            detail: "先把百智 MCP Server 配置写进 OpenClaw 的客户端配置文件，补齐服务地址、认证信息和传输方式。",
            codeTitle: "openclaw.mcp.json",
            code: [
              "{",
              '  "mcpServers": {',
              '    "baizhi": {',
              '      "transport": "sse",',
              '      "url": "<server-url>",',
              '      "headers": {',
              '        "Authorization": "Bearer <api-key>"',
              "      }",
              "    }",
              "  }",
              "}",
            ],
          },
          {
            title: "加载 Skill 指引",
            detail: "把面向 OpenClaw 的 Skill 文档或规则说明放到客户端可读取的位置，让模型知道如何调用百智能力。",
            codeTitle: "示例目录",
            code: [
              "mkdir -p .openclaw/skills/baizhi",
              "curl -fsSL <skill-template-url> -o .openclaw/skills/baizhi/SKILL.md",
            ],
          },
          {
            title: "重启并验证连接",
            detail: "重启 OpenClaw 或重载工作区后，执行一次最小验证，确认百智工具已经可见。",
            codeTitle: "验证命令",
            code: [
              "openclaw reload",
              "openclaw tools list | grep baizhi",
            ],
          },
        ],
      },
      {
        value: "claude-code",
        title: "Claude Code",
        skillFileName: sharedSkillFileName,
        skillContent: sharedSkillContent,
        steps: [
          {
            title: "写入 MCP Server 配置",
            detail: "把百智 MCP 配置写入 Claude Code 使用的 MCP 配置文件，确保服务名和认证字段完整。",
            codeTitle: "claude-code.mcp.json",
            code: [
              "{",
              '  "mcpServers": {',
              '    "baizhi": {',
              '      "transport": "sse",',
              '      "url": "<server-url>",',
              '      "headers": {',
              '        "Authorization": "Bearer <api-key>"',
              "      }",
              "    }",
              "  }",
              "}",
            ],
          },
          {
            title: "补充项目级 Skill 说明",
            detail: "在项目内加入给 Claude Code 使用的 Skill 或规则文档，说明哪些场景应优先调用百智能力。",
            codeTitle: "示例目录",
            code: [
              "mkdir -p .claude/skills/baizhi",
              "curl -fsSL <skill-template-url> -o .claude/skills/baizhi/SKILL.md",
            ],
          },
          {
            title: "重载客户端并验证",
            detail: "重载 Claude Code 后，检查工具列表并做一次最小调用，确认接入成功。",
            codeTitle: "验证命令",
            code: [
              "claude-code mcp reload",
              "claude-code mcp list",
            ],
          },
        ],
      },
      {
        value: "opencode",
        title: "OpenCode",
        skillFileName: sharedSkillFileName,
        skillContent: sharedSkillContent,
        steps: [
          {
            title: "准备 MCP 配置文件",
            detail: "先在 OpenCode 使用的配置目录中添加百智 MCP Server 的配置片段。",
            codeTitle: "baizhi.mcp.json",
            code: [
              "{",
              '  "name": "baizhi",',
              '  "transport": "sse",',
              '  "url": "<server-url>",',
              '  "headers": {',
              '    "Authorization": "Bearer <api-key>"',
              "  }",
              "}",
            ],
          },
          {
            title: "注册并启用服务",
            detail: "把配置文件注册到 OpenCode，然后显式启用百智服务。",
            codeTitle: "接入命令",
            code: [
              "opencode mcp add baizhi --config ./baizhi.mcp.json",
              "opencode mcp enable baizhi",
            ],
          },
          {
            title: "挂载 Skill 模板并重载",
            detail: "把 Skill 模板加入工作区规则目录，然后重载 OpenCode 以便生效。",
            codeTitle: "示例目录",
            code: [
              "mkdir -p .opencode/skills/baizhi",
              "curl -fsSL <skill-template-url> -o .opencode/skills/baizhi/SKILL.md",
              "opencode reload",
            ],
          },
        ],
      },
      {
        value: "cursor",
        title: "Cursor",
        skillFileName: sharedSkillFileName,
        skillContent: sharedSkillContent,
        steps: [
          {
            title: "写入 Cursor MCP 配置",
            detail: "把百智服务加入 Cursor 的 MCP 配置中，优先写工作区级配置，便于团队共享。",
            codeTitle: ".cursor/mcp.json",
            code: [
              "{",
              '  "mcpServers": {',
              '    "baizhi": {',
              '      "transport": "sse",',
              '      "url": "<server-url>",',
              '      "headers": {',
              '        "Authorization": "Bearer <api-key>"',
              "      }",
              "    }",
              "  }",
              "}",
            ],
          },
          {
            title: "同步规则与 Skill 模板",
            detail: "把面向 Cursor 的 Skill 文档、调用建议和规则文件放到项目规则目录中。",
            codeTitle: "示例目录",
            code: [
              "mkdir -p .cursor/rules/baizhi",
              "curl -fsSL <skill-template-url> -o .cursor/rules/baizhi/skill.mdc",
            ],
          },
          {
            title: "重载并检查工具",
            detail: "重载 Cursor 后检查 MCP 工具面板，确认百智服务和工具已经出现。",
            codeTitle: "验证命令",
            code: [
              "cursor mcp reload",
              "cursor mcp list",
            ],
          },
        ],
      },
      {
        value: "codex",
        title: "Codex",
        skillFileName: sharedSkillFileName,
        skillContent: sharedSkillContent,
        steps: [
          {
            title: "注册 MCP Server",
            detail: "在 Codex 当前工作区中注册百智 MCP 服务，补齐地址和鉴权参数。",
            codeTitle: "接入命令",
            code: [
              "codex mcp add baizhi --url <server-url>",
              "codex mcp list",
            ],
          },
          {
            title: "加入 Skill 说明文件",
            detail: "把百智 Skill 文档放进项目 skill 目录或上下文说明目录，让 Codex 知道何时调用这些能力。",
            codeTitle: "示例目录",
            code: [
              "mkdir -p .codex/skills/baizhi",
              "curl -fsSL <skill-template-url> -o .codex/skills/baizhi/SKILL.md",
            ],
          },
          {
            title: "刷新线程上下文并验证",
            detail: "重新加载当前线程或工作区，然后验证百智工具、资源和 Skill 是否都能被正常识别。",
            codeTitle: "验证命令",
            code: [
              "codex mcp verify baizhi",
              "codex tools list | rg baizhi",
            ],
          },
        ],
      },
      {
        value: "other-clients",
        title: "其他客户端",
        skillFileName: sharedSkillFileName,
        skillContent: sharedSkillContent,
        steps: [
          {
            title: "补齐客户端配置映射",
            detail: "先把百智 MCP 的 URL、headers、传输方式映射到目标客户端的配置结构中。",
            codeTitle: "配置模板",
            code: [
              "{",
              '  "name": "baizhi",',
              '  "transport": "sse",',
              '  "url": "<server-url>",',
              '  "headers": {',
              '    "Authorization": "Bearer <api-key>"',
              "  }",
              "}",
            ],
          },
          {
            title: "注册 MCP 服务",
            detail: "按目标客户端的 CLI 或配置格式把百智服务注册进去。",
            codeTitle: "接入命令",
            code: [
              "<agent-cli> mcp add baizhi --url <server-url>",
              "<agent-cli> mcp list",
            ],
          },
          {
            title: "挂载 Skill 或规则文件",
            detail: "如果目标客户端支持规则、插件或技能目录，把 Skill 模板一并挂载到对应路径。",
            codeTitle: "示例目录",
            code: [
              "mkdir -p .agent/skills/baizhi",
              "curl -fsSL <skill-template-url> -o .agent/skills/baizhi/SKILL.md",
            ],
          },
        ],
      },
    ],
    notes: ["按 Agent 切换接入命令", "补充鉴权方式与环境变量", "补充常见失败场景"],
  },
  {
    value: "api",
    title: "API",
    icon: BlocksIcon,
    summary: "面向直接调用开放接口的场景，沉淀鉴权方式、请求示例和错误处理。",
    highlights: ["鉴权说明", "接口示例", "SDK 片段", "错误码与限流"],
    commandTitle: "请求示例",
    command: [
      "# TODO: 替换为正式 API 示例",
      "curl <api-endpoint> \\",
      "  -H 'Authorization: Bearer <api-key>' \\",
      "  -H 'Content-Type: application/json'",
    ],
    notes: ["适合直接 API 调用", "补充错误码与限流说明", "补充 SDK 示例链接"],
  },
] as const

export default function DeveloperAccessPage() {
  const mcpMethod = accessMethods.find((method) => method.value === "mcp")
  const defaultMcpAgent =
    mcpMethod && "agents" in mcpMethod ? mcpMethod.agents[0].value : ""
  const [apiKeys, setApiKeys] = React.useState(initialApiKeys)
  const [isCreateKeyDialogOpen, setIsCreateKeyDialogOpen] = React.useState(false)
  const [newApiKeyName, setNewApiKeyName] = React.useState("")
  const [selectedMcpAgent, setSelectedMcpAgent] = React.useState(defaultMcpAgent)
  const currentMcpAgent =
    mcpMethod && "agents" in mcpMethod
      ? mcpMethod.agents.find((agent) => agent.value === selectedMcpAgent) ??
        mcpMethod.agents[0]
      : undefined

  function handleCreateApiKey(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedName = newApiKeyName.trim()
    if (!trimmedName) {
      return
    }

    const suffix = Math.random().toString(36).slice(-4)

    setApiKeys((currentKeys) => [
      {
        id: `bk_${Date.now()}`,
        name: trimmedName,
        maskedKey: `bz-live-****-****-${suffix}`,
        activity: "刚刚创建，暂未使用",
        enabled: true,
      },
      ...currentKeys,
    ])
    setNewApiKeyName("")
    setIsCreateKeyDialogOpen(false)
  }

  return (
    <div className="flex flex-1 flex-col p-4 pt-0">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">快速集成</h1>
      </div>

      <Card className="mt-6">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>API Key 管理</CardTitle>
            </div>
            <Dialog
              onOpenChange={(open) => {
                setIsCreateKeyDialogOpen(open)
                if (!open) {
                  setNewApiKeyName("")
                }
              }}
              open={isCreateKeyDialogOpen}
            >
              <DialogTrigger render={<Button size="sm" />}>
                <PlusIcon />
                <span>创建 API Key</span>
              </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>创建 API Key</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-5" onSubmit={handleCreateApiKey}>
                  <div className="space-y-2">
                    <Label htmlFor="api-key-name">名称</Label>
                    <Input
                      autoFocus
                      id="api-key-name"
                      onChange={(event) => setNewApiKeyName(event.target.value)}
                      placeholder="例如：生产环境密钥"
                      value={newApiKeyName}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => setIsCreateKeyDialogOpen(false)}
                      type="button"
                      variant="outline"
                    >
                      取消
                    </Button>
                    <Button disabled={!newApiKeyName.trim()} type="submit">
                      创建
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-background px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3 pt-1">
                    <div className="font-medium">{key.name}</div>
                    <Switch
                      aria-label={`${key.name}状态切换`}
                      checked={key.enabled}
                      size="sm"
                    />
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {key.activity}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            aria-label="更多操作"
                            size="icon-sm"
                            variant="ghost"
                          />
                        }
                      >
                        <MoreHorizontalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem>
                          <PencilIcon />
                          <span>修改</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Trash2Icon />
                          <span>删除</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
                  <div className="min-w-0 flex-1 truncate font-mono text-sm text-muted-foreground">
                    {key.maskedKey}
                  </div>
                  <Button aria-label="查看 API Key" size="icon-sm" variant="outline">
                    <EyeIcon />
                  </Button>
                  <Button aria-label="复制 API Key" size="icon-sm" variant="outline">
                    <CopyIcon />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <Tabs defaultValue="mcp">
          <CardHeader>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle>接入方式</CardTitle>
              <TabsList className="inline-flex h-auto w-fit max-w-full items-center gap-1 rounded-lg bg-muted/70 p-1.5 ring-1 ring-border/70">
              {accessMethods.map((method) => (
                <TabsTrigger
                  key={method.value}
                  className="h-8 flex-none rounded-md px-4 py-1.5 text-sm font-medium leading-none text-muted-foreground hover:text-foreground data-active:bg-primary data-active:text-primary-foreground"
                  value={method.value}
                >
                  {method.title}
                </TabsTrigger>
              ))}
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            {accessMethods.map((method) => {
              return (
                <TabsContent key={method.value} className="pt-2" value={method.value}>
                  {method.value === "mcp" && "agents" in method ? (
                    <div className="pt-0.5">
                      <Card className="gap-0 py-3" size="sm">
                        <CardContent className="px-4 pt-0">
                          <Tabs
                            defaultValue={method.agents[0].value}
                            onValueChange={setSelectedMcpAgent}
                            value={selectedMcpAgent}
                          >
                            <div className="mb-2 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                              <TabsList className="inline-flex h-auto w-fit max-w-full items-center gap-1 self-start rounded-lg bg-muted/70 p-1.5 ring-1 ring-border/70">
                                {method.agents.map((agent) => (
                                  <TabsTrigger
                                    key={agent.value}
                                    className="h-8 flex-none rounded-md px-3 py-1.5 text-sm font-medium leading-none text-muted-foreground hover:text-foreground data-active:bg-background data-active:text-foreground"
                                    value={agent.value}
                                  >
                                    {agent.title}
                                  </TabsTrigger>
                                ))}
                              </TabsList>
                              {currentMcpAgent && "skillContent" in currentMcpAgent ? (
                                <Dialog>
                                  <DialogTrigger
                                    render={<Button size="sm" variant="link" />}
                                  >
                                    查看 Skill
                                  </DialogTrigger>
                                  <DialogContent className="max-w-5xl">
                                    <DialogHeader>
                                      <div className="flex items-start justify-between gap-4 pr-10">
                                        <div className="space-y-2">
                                          <DialogTitle>Skill 预览</DialogTitle>
                                          <DialogDescription>
                                            当前展示的是通用 Skill 模板内容，后续可替换为正式版本。
                                          </DialogDescription>
                                        </div>
                                        <Button
                                          onClick={() =>
                                            navigator.clipboard.writeText(
                                              currentMcpAgent.skillContent.join("\n")
                                            )
                                          }
                                          size="sm"
                                          variant="outline"
                                        >
                                          <CopyIcon />
                                          <span>一键复制</span>
                                        </Button>
                                      </div>
                                    </DialogHeader>
                                    <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
                                      <div className="border-b border-border px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                        {currentMcpAgent.skillFileName}
                                      </div>
                                      <pre className="max-h-[60vh] overflow-auto px-4 py-4 font-mono text-sm leading-7 text-foreground whitespace-pre-wrap">
                                        <code>
                                          {currentMcpAgent.skillContent.join("\n")}
                                        </code>
                                      </pre>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ) : null}
                            </div>
                            {method.agents.map((agent) => (
                              <TabsContent
                                key={agent.value}
                                className="pt-2"
                                value={agent.value}
                              >
                                {"prompt" in agent ? (
                                  <div className="space-y-3">
                                    <p className="text-sm leading-6 text-muted-foreground">
                                      把下面这段 prompt 直接复制给你的 AI 助手，按文档完成安装。
                                    </p>
                                    <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
                                      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
                                        <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                          Prompt
                                        </div>
                                        <Button
                                          aria-label="复制安装 prompt"
                                          onClick={() =>
                                            navigator.clipboard.writeText(
                                              agent.prompt
                                            )
                                          }
                                          size="sm"
                                          variant="ghost"
                                        >
                                          <CopyIcon />
                                          <span>复制</span>
                                        </Button>
                                      </div>
                                      <pre className="overflow-x-auto px-4 py-4 font-mono text-sm leading-7 text-foreground whitespace-pre-wrap">
                                        <code>{agent.prompt}</code>
                                      </pre>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {"steps" in agent ? (
                                      <div className="space-y-3">
                                        {agent.steps.map((step, index) => (
                                          <div
                                            key={step.title}
                                            className="rounded-xl border border-border bg-muted/20 p-4"
                                          >
                                            <div className="mb-2 text-sm font-medium">
                                              {index + 1}. {step.title}
                                            </div>
                                            <div className="mb-3 text-sm leading-6 text-muted-foreground">
                                              {step.detail}
                                            </div>
                                            {"code" in step ? (
                                              <div className="overflow-hidden rounded-lg border border-border bg-background">
                                                <div className="border-b border-border px-3 py-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                  {"codeTitle" in step ? step.codeTitle : "配置示例"}
                                                </div>
                                                <pre className="overflow-x-auto px-3 py-3 font-mono text-xs leading-6 text-foreground whitespace-pre-wrap">
                                                  <code>{step.code.join("\n")}</code>
                                                </pre>
                                              </div>
                                            ) : null}
                                          </div>
                                        ))}
                                      </div>
                                    ) : null}
                                  </div>
                                )}
                              </TabsContent>
                            ))}
                          </Tabs>
                        </CardContent>
                      </Card>
                    </div>
                  ) : method.value === "api" ? (
                    <div className="space-y-4 pt-2">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="text-base font-semibold tracking-tight text-foreground">
                          {apiReference.heroTitle}
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-2">
                          <div className="font-mono text-sm leading-6 text-muted-foreground">
                            {apiBaseUrl}
                          </div>
                          <Button
                            aria-label="复制 API Base URL"
                            onClick={() => navigator.clipboard.writeText(apiBaseUrl)}
                            size="icon-sm"
                            variant="ghost"
                          >
                            <CopyIcon />
                          </Button>
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-xl border border-border bg-background">
                        <div className="border-b border-border px-4 py-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge variant={apiReference.endpoints[0].methodVariant}>
                                {apiReference.endpoints[0].method}
                              </Badge>
                              <div className="font-mono text-base font-medium leading-6">
                                {apiReference.endpoints[0].path}
                              </div>
                              <div className="text-sm leading-6 text-muted-foreground">
                                {apiReference.endpoints[0].title}
                              </div>
                            </div>
                            <ChevronDownIcon className="mt-1 size-4 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="grid gap-4 px-4 py-4 xl:grid-cols-2">
                          <section className="space-y-2.5">
                            <div className="text-sm font-medium tracking-tight">请求参数</div>
                            <div className="overflow-hidden rounded-lg border border-border">
                              <Table>
                                <TableHeader className="bg-muted/40">
                                  <TableRow>
                                    <TableHead className="text-xs text-muted-foreground">字段</TableHead>
                                    <TableHead className="text-xs text-muted-foreground">位置</TableHead>
                                    <TableHead className="text-xs text-muted-foreground">类型</TableHead>
                                    <TableHead className="text-xs text-muted-foreground">说明</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {apiReference.endpoints[0].requestFields.map((field) => (
                                    <TableRow key={field.name}>
                                      <TableCell className="py-2.5 font-mono text-sm">{field.name}</TableCell>
                                      <TableCell className="py-2.5 text-sm text-muted-foreground">{field.location}</TableCell>
                                      <TableCell className="py-2.5 text-sm text-muted-foreground">{field.type}</TableCell>
                                      <TableCell className="py-2.5 whitespace-normal text-sm leading-6 text-muted-foreground">
                                        {field.description}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </section>

                          <section className="space-y-2.5">
                            <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
                              <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
                                <div className="font-mono text-xs text-muted-foreground uppercase">
                                  cURL
                                </div>
                                <Button
                                  aria-label="复制请求示例"
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      apiReference.endpoints[0].requestExample.join("\n")
                                    )
                                  }
                                  size="icon-sm"
                                  variant="ghost"
                                >
                                  <CopyIcon />
                                </Button>
                              </div>
                              <pre className="overflow-x-auto px-4 py-3 font-mono text-xs leading-6 text-foreground whitespace-pre-wrap sm:text-sm">
                                <code>{apiReference.endpoints[0].requestExample.join("\n")}</code>
                              </pre>
                            </div>
                          </section>

                          <section className="space-y-2.5">
                            <div className="text-sm font-medium tracking-tight">响应字段</div>
                            <div className="overflow-hidden rounded-lg border border-border">
                              <Table>
                                <TableHeader className="bg-muted/40">
                                  <TableRow>
                                    <TableHead className="text-xs text-muted-foreground">字段</TableHead>
                                    <TableHead className="text-xs text-muted-foreground">位置</TableHead>
                                    <TableHead className="text-xs text-muted-foreground">类型</TableHead>
                                    <TableHead className="text-xs text-muted-foreground">说明</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {apiReference.endpoints[0].responseFields.map((field) => (
                                    <TableRow key={field.name}>
                                      <TableCell className="py-2.5 font-mono text-sm">{field.name}</TableCell>
                                      <TableCell className="py-2.5 text-sm text-muted-foreground">{field.location}</TableCell>
                                      <TableCell className="py-2.5 text-sm text-muted-foreground">{field.type}</TableCell>
                                      <TableCell className="py-2.5 whitespace-normal text-sm leading-6 text-muted-foreground">
                                        {field.description}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </section>

                          <section className="space-y-2.5">
                            <div className="overflow-hidden rounded-lg border border-border bg-muted/20">
                              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                                <div className="font-mono text-xs text-muted-foreground uppercase">
                                  Response
                                </div>
                                <Button
                                  aria-label="复制响应示例"
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      apiReference.endpoints[0].responseExample.join("\n")
                                    )
                                  }
                                  size="icon-sm"
                                  variant="ghost"
                                >
                                  <CopyIcon />
                                </Button>
                              </div>
                              <pre className="overflow-x-auto px-4 py-3 font-mono text-xs leading-6 text-foreground whitespace-pre-wrap sm:text-sm">
                                <code>{apiReference.endpoints[0].responseExample.join("\n")}</code>
                              </pre>
                            </div>
                          </section>
                        </div>
                      </div>

                      <div className="overflow-hidden rounded-xl border border-border bg-background">
                        {apiReference.endpoints.slice(1).map((endpoint) => (
                          <div
                            key={`${endpoint.method}-${endpoint.path}`}
                            className="flex items-start justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0"
                          >
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge variant={endpoint.methodVariant}>
                                {endpoint.method}
                              </Badge>
                              <div className="font-mono text-base font-medium leading-6">
                                {endpoint.path}
                              </div>
                              <div className="text-sm leading-6 text-muted-foreground">
                                {endpoint.title}
                              </div>
                            </div>
                            <ChevronDownIcon className="mt-1 size-4 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="grid gap-4 pt-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]"
                    >
                      <Card size="sm">
                        <CardHeader>
                          <CardTitle>{method.title}</CardTitle>
                          <CardDescription>{method.summary}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid gap-3 md:grid-cols-2">
                              {method.highlights.map((item) => (
                                <div
                                  key={item}
                                  className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-5 text-sm text-muted-foreground"
                                >
                                  {item}
                                </div>
                              ))}
                            </div>
                            {"command" in method ? (
                              <div className="rounded-xl border border-border bg-muted/20 p-4">
                                <div className="mb-3 text-sm font-medium">
                                  {method.commandTitle}
                                </div>
                                <pre className="overflow-x-auto rounded-lg border border-border bg-background px-4 py-3 text-xs leading-6 text-muted-foreground">
                                  <code>{method.command.join("\n")}</code>
                                </pre>
                              </div>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>

                      <Card size="sm">
                        <CardHeader>
                          <CardTitle>补充说明</CardTitle>
                          <CardDescription>这一列用于承接注意事项、前置条件和后续补充位。</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-3">
                            {method.notes.map((note) => (
                              <div
                                key={note}
                                className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-4 text-sm text-muted-foreground"
                              >
                                {note}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              )
            })}
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
