import * as React from "react"
import { Navigate, useParams } from "react-router-dom"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  CopyIcon,
  EyeIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  PlayIcon,
  UploadIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { defaultConsolePage } from "@/lib/console-pages"
import {
  getMcpService,
  type McpService,
  type ServiceStatus,
} from "@/lib/mcp-services"
import { cn } from "@/lib/utils"

type EditableService = {
  description: string
  auth: "API Key" | "公开访问"
  baseUrl: string
  apiKey: string
  source: string
  sourceMode: "url" | "file"
}

type EditableTool = McpService["tools"][number]

type ParsedTool = {
  id: string
  method: EditableTool["method"]
  name: string
  path: string
}

const parsedTools: ParsedTool[] = [
  { id: "listPets", method: "GET", name: "listPets", path: "/pets" },
  { id: "createPet", method: "POST", name: "createPet", path: "/pets" },
  { id: "getPetById", method: "GET", name: "getPetById", path: "/pets/{petId}" },
  { id: "updatePet", method: "PUT", name: "updatePet", path: "/pets/{petId}" },
  { id: "deletePet", method: "DELETE", name: "deletePet", path: "/pets/{petId}" },
  { id: "listOrders", method: "GET", name: "listOrders", path: "/orders" },
  { id: "createOrder", method: "POST", name: "createOrder", path: "/orders" },
  { id: "getOrderById", method: "GET", name: "getOrderById", path: "/orders/{orderId}" },
  { id: "updateOrderStatus", method: "PATCH", name: "updateOrderStatus", path: "/orders/{orderId}/status" },
  { id: "createRefund", method: "POST", name: "createRefund", path: "/orders/{orderId}/refunds" },
]

const methodBadgeClassName: Record<EditableTool["method"], string> = {
  GET: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  POST: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  PUT: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  PATCH: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  DELETE: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
}

const MAX_SELECTED_TOOLS = 30

const apiKeys = [
  {
    name: "默认密钥",
    key: "mcp_sk_live_••••••••9f3a",
    usageMeta: "21 天前创建，未使用过",
  },
]

const statusMeta: Record<
  ServiceStatus,
  {
    label: string
    icon: typeof CheckCircle2Icon
    className: string
  }
> = {
  online: {
    label: "在线",
    icon: CheckCircle2Icon,
    className: "bg-primary text-primary-foreground",
  },
  offline: {
    label: "离线",
    icon: AlertCircleIcon,
    className: "bg-destructive text-white",
  },
}

export default function McpServiceDetailPage() {
  const { id } = useParams()
  const service = getMcpService(id)

  if (!service) {
    return <Navigate replace to={defaultConsolePage} />
  }

  return <McpServiceDetailContent service={service} />
}

function McpServiceDetailContent({ service }: { service: McpService }) {
  const [editOpen, setEditOpen] = React.useState(false)
  const [editStep, setEditStep] = React.useState(2)
  const [editableService, setEditableService] = React.useState<EditableService>({
    description: service.description,
    auth: service.auth,
    baseUrl: service.baseUrl,
    apiKey: "",
    source: service.source,
    sourceMode: service.sourceType === "url" ? "url" : "file",
  })
  const [draftService, setDraftService] = React.useState<EditableService>(editableService)
  const [detailTools, setDetailTools] = React.useState<EditableTool[]>(service.tools)
  const [selectedToolIds, setSelectedToolIds] = React.useState<string[]>(
    service.tools.filter((tool) => tool.enabled).map((tool) => tool.name)
  )

  const meta = statusMeta[service.status]
  const apiConfigChanged =
    draftService.baseUrl !== editableService.baseUrl ||
    draftService.apiKey !== editableService.apiKey ||
    draftService.source !== editableService.source ||
    draftService.sourceMode !== editableService.sourceMode
  const canContinueToConfig = selectedToolIds.length > 0

  function openEditDialog() {
    setDraftService(editableService)
    setSelectedToolIds(detailTools.filter((tool) => tool.enabled).map((tool) => tool.name))
    setEditStep(2)
    setEditOpen(true)
  }

  function saveEditDialog() {
    setEditableService(draftService)
    if (apiConfigChanged) {
      setDetailTools(
        parsedTools.map((tool) => ({
          name: tool.name,
          method: tool.method,
          path: tool.path,
          description: `由 ${tool.method} ${tool.path} 重新解析生成。`,
          enabled: selectedToolIds.includes(tool.id),
        }))
      )
    }
    setEditOpen(false)
  }

  function toggleTool(toolId: string, checked: boolean) {
    setSelectedToolIds((current) => {
      if (checked) {
        if (current.includes(toolId) || current.length >= MAX_SELECTED_TOOLS) {
          return current
        }

        return [...current, toolId]
      }

      return current.filter((id) => id !== toolId)
    })
  }

  function handleEditNext() {
    setEditStep(2)
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                    meta.className
                  )}
                >
                  <meta.icon className="size-3" data-icon="inline-start" />
                  {meta.label}
                </span>
              </div>
              <CardDescription className="mt-2 max-w-3xl">
                {editableService.description}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button aria-label="服务操作" size="icon" variant="ghost">
                    <MoreHorizontalIcon />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-28">
                <DropdownMenuItem onClick={openEditDialog}>编辑</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <InfoItem copyable label="MCP Server URL" value={service.endpoint} />
          <InfoItem label="认证方式" value={editableService.auth} />
          <InfoItem copyable label="API Base URL" value={editableService.baseUrl} />
          <TimeInfoItem createdAt={service.createdAt} updatedAt={service.updatedAt} />
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
          <DialogHeader className="shrink-0 px-6 pt-6 pb-3">
            <DialogTitle>编辑服务</DialogTitle>
          </DialogHeader>

          <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto px-6 py-3">
          <div className="grid gap-2 md:grid-cols-2">
            {[
              { id: 1, title: "接口解析", description: "导入接口并选择工具" },
              { id: 2, title: "配置服务", description: "配置 MCP 与 API 信息" },
            ].map((item) => {
              const active = editStep === item.id
              const completed = editStep > item.id

              return (
                <div
                  className={cn(
                    "rounded-lg border px-3 py-2 transition-colors",
                    active && "border-primary/40 bg-primary/5",
                    completed && "border-primary/20 bg-primary/[0.03]",
                    !active && !completed && "border-border/60 bg-background text-muted-foreground"
                  )}
                  key={item.id}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex h-6 min-w-6 items-center justify-center rounded-full border text-[11px] font-medium",
                        active && "border-primary/50 bg-primary text-primary-foreground",
                        completed && "border-primary/30 bg-primary/10 text-primary",
                        !active && !completed && "border-border/60 bg-muted/20 text-muted-foreground"
                      )}
                    >
                      {item.id}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-[11px] leading-4 text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {editStep === 1 ? (
            <FieldGroup className="gap-5">
              <section className="rounded-lg border bg-muted/20 p-4">
                <FieldGroup className="gap-4">
                  <Field className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <FieldLabel htmlFor="edit-source-mode">来源</FieldLabel>
                    <Select
                      onValueChange={(value) => setDraftService((current) => ({
                        ...current,
                        sourceMode: value as EditableService["sourceMode"],
                      }))}
                      value={draftService.sourceMode}
                    >
                      <SelectTrigger className="w-full sm:w-44" id="edit-source-mode">
                        <SelectValue placeholder="选择来源" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="url">
                            <LinkIcon />
                            从 URL 导入
                          </SelectItem>
                          <SelectItem value="file">
                            <UploadIcon />
                            从文件导入
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  {draftService.sourceMode === "url" ? (
                    <div className="grid gap-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <FieldLabel className="shrink-0" htmlFor="edit-openapi-url">
                          OpenAPI URL
                        </FieldLabel>
                        <Input
                          className="h-9 w-full flex-1"
                          id="edit-openapi-url"
                          onChange={(event) => setDraftService((current) => ({
                            ...current,
                            source: event.target.value,
                          }))}
                          placeholder="https://api.example.com/openapi.json"
                          value={draftService.source}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="button">导入工具</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      <Field className="flex-1">
                        <FieldLabel htmlFor="edit-openapi-file">OpenAPI 文件</FieldLabel>
                        <Input id="edit-openapi-file" type="file" />
                      </Field>
                      <div className="flex justify-end">
                        <Button type="button">导入工具</Button>
                      </div>
                    </div>
                  )}
                </FieldGroup>
              </section>

              <section className="rounded-lg border bg-muted/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">选择工具</div>
                  </div>
                  <Badge variant="secondary">
                    {selectedToolIds.length}/{MAX_SELECTED_TOOLS}
                  </Badge>
                </div>
                <ScrollArea className="mt-4 h-[19rem] rounded-lg border bg-background">
                  <div className="grid gap-3 p-3">
                    {parsedTools.map((tool) => {
                      const checked = selectedToolIds.includes(tool.id)
                      const disabled = !checked && selectedToolIds.length >= MAX_SELECTED_TOOLS

                      return (
                        <label
                          className={cn(
                            "flex items-center gap-3 rounded-lg border bg-background p-3",
                            checked && "border-primary/40 bg-primary/5",
                            disabled && "opacity-60"
                          )}
                          htmlFor={`edit-${tool.id}`}
                          key={tool.id}
                        >
                          <Checkbox
                            checked={checked}
                            disabled={disabled}
                            id={`edit-${tool.id}`}
                            onCheckedChange={(nextChecked) =>
                              toggleTool(tool.id, nextChecked)
                            }
                          />
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <span
                              className={cn(
                                "inline-flex shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium",
                                methodBadgeClassName[tool.method]
                              )}
                            >
                              {tool.method}
                            </span>
                            <span className="shrink-0 text-sm font-medium">{tool.name}</span>
                            <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">
                              {tool.path}
                            </span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </ScrollArea>
              </section>
            </FieldGroup>
          ) : (
            <div className="grid gap-4">
              <section className="rounded-lg border bg-muted/20 p-4">
                <div className="mb-4">
                  <div className="text-sm font-medium">MCP 配置</div>
                </div>
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel htmlFor="edit-service-name">MCP 服务名称</FieldLabel>
                    <Input id="edit-service-name" readOnly value={service.name} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="edit-service-description">服务描述</FieldLabel>
                    <Textarea
                      id="edit-service-description"
                      onChange={(event) => setDraftService((current) => ({
                        ...current,
                        description: event.target.value,
                      }))}
                      placeholder="描述这个 MCP 服务的用途"
                      rows={3}
                      value={draftService.description}
                    />
                  </Field>
                  <Field className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <FieldLabel htmlFor="edit-mcp-auth-mode">认证方式</FieldLabel>
                    <Select
                      onValueChange={(value) => setDraftService((current) => ({
                        ...current,
                        auth: value as EditableService["auth"],
                      }))}
                      value={draftService.auth}
                    >
                      <SelectTrigger
                        className="w-full rounded-lg border-border/70 bg-background sm:w-44"
                        id="edit-mcp-auth-mode"
                      >
                        <SelectValue placeholder="选择认证方式" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="API Key">API Key</SelectItem>
                          <SelectItem value="公开访问">公开访问</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
              </section>

              <section className="rounded-lg border bg-muted/20 p-4">
                <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="text-sm font-medium">API 配置</div>
                  <div className="text-xs text-muted-foreground">
                    配置工具调用上游 API 时使用的地址与鉴权信息。
                  </div>
                </div>
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel htmlFor="edit-api-base-url">API Base URL</FieldLabel>
                    <Input
                      id="edit-api-base-url"
                      onChange={(event) => setDraftService((current) => ({
                        ...current,
                        baseUrl: event.target.value,
                      }))}
                      placeholder="https://api.example.com"
                      value={draftService.baseUrl}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="edit-api-key">API Key</FieldLabel>
                    <Input
                      id="edit-api-key"
                      onChange={(event) => setDraftService((current) => ({
                        ...current,
                        apiKey: event.target.value,
                      }))}
                      placeholder="填写 API Key"
                      type="password"
                      value={draftService.apiKey}
                    />
                  </Field>
                </FieldGroup>
              </section>

              <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                本次将保存 {apiConfigChanged ? selectedToolIds.length : detailTools.filter((tool) => tool.enabled).length} 个启用工具。
              </div>

            </div>
          )}
          </div>

          <DialogFooter className="shrink-0 border-t px-6 py-3">
            {editStep === 1 ? (
              <>
                <Button onClick={() => setEditOpen(false)} variant="outline">
                  取消
                </Button>
                <Button disabled={!canContinueToConfig} onClick={handleEditNext}>
                  下一步
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setEditStep(1)} variant="outline">
                  返回上一步
                </Button>
                <Button onClick={saveEditDialog}>保存修改</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs className="gap-3" defaultValue="tools">
        <TabsList>
          <TabsTrigger value="tools">工具列表</TabsTrigger>
          <TabsTrigger value="access">快速接入</TabsTrigger>
        </TabsList>
        <TabsContent value="tools">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>工具列表</CardTitle>
              <Badge variant="secondary">{detailTools.length} 个工具</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {detailTools.map((tool) => (
                  <div
                    className="rounded-xl border bg-background p-4 shadow-xs"
                    key={tool.name}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="font-mono text-sm font-semibold">
                          {tool.name}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Button aria-label="在线测试" size="icon-sm" variant="outline">
                          <PlayIcon className="size-3.5" />
                        </Button>
                        <Button aria-label="编辑" size="icon-sm" variant="outline">
                          <PencilIcon className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg border bg-muted/30 p-3 text-sm leading-6 text-muted-foreground">
                      {tool.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="access">
          <div className="flex flex-col gap-5">
              <section className="rounded-xl border bg-muted/20 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">API Key</div>
                  </div>
                  <Button size="sm">
                    <PlusIcon data-icon="inline-start" />
                    创建 Key
                  </Button>
                </div>

                <div className="mt-4 grid gap-2">
                  {apiKeys.map((apiKey) => (
                    <div
                      className="flex flex-col gap-3 rounded-lg border bg-background p-3 sm:flex-row sm:items-center sm:justify-between"
                      key={apiKey.key}
                    >
                      <div className="grid min-w-0 flex-1 items-center gap-3 sm:grid-cols-[minmax(7rem,0.8fr)_minmax(14rem,1fr)_minmax(10rem,0.8fr)]">
                        <div className="min-w-0 truncate text-sm font-medium">{apiKey.name}</div>
                        <code className="min-w-0 truncate rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                          {apiKey.key}
                        </code>
                        <span className="min-w-0 truncate text-right text-xs text-muted-foreground sm:text-left lg:text-right">
                          {apiKey.usageMeta}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button aria-label="复制 API Key" size="icon" variant="ghost">
                          <CopyIcon className="size-3.5" />
                        </Button>
                        <Button aria-label="显示 API Key" size="icon" variant="ghost">
                          <EyeIcon className="size-3.5" />
                        </Button>
                        <Button aria-label="更多 API Key 操作" size="icon" variant="ghost">
                          <MoreHorizontalIcon className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border bg-muted/20 p-4">
                <Tabs className="gap-4" defaultValue="general">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="text-sm font-semibold">接入使用</div>
                    </div>
                    <TabsList className="h-auto w-fit max-w-full flex-wrap">
                      <TabsTrigger value="general">通用配置</TabsTrigger>
                      <TabsTrigger value="claude">Claude</TabsTrigger>
                      <TabsTrigger value="codex">Codex</TabsTrigger>
                      <TabsTrigger value="cursor">Cursor</TabsTrigger>
                      <TabsTrigger value="opencode">OpenCode</TabsTrigger>
                      <TabsTrigger value="openclaw">openclaw</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent className="mt-0 grid gap-4" value="general">
                    <EndpointItem label="Server URL" value={service.endpoint} />
                    <ConfigBlock
                      code={mcpClientExample(service.name, service.endpoint)}
                      title="JSON 配置示例"
                    />
                    <ConfigBlock
                      code={headerExample()}
                      title="请求头 Key-Value 配置示例"
                    />
                  </TabsContent>
                  {[
                    ["claude", "Claude"],
                    ["codex", "Codex"],
                    ["cursor", "Cursor"],
                    ["opencode", "OpenCode"],
                    ["openclaw", "openclaw"],
                  ].map(([value, label]) => (
                    <TabsContent className="mt-0 grid gap-4" key={value} value={value}>
                      <ConfigBlock
                        code={mcpClientExample(service.name, service.endpoint)}
                        title={`${label} 配置示例`}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </section>

          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}

function InfoItem({
  copyable = false,
  label,
  value,
}: {
  copyable?: boolean
  label: string
  value: string
}) {
  return (
    <div className="min-w-0 rounded-lg border bg-muted/30 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex min-h-7 min-w-0 items-center gap-2">
        <div className="min-w-0 flex-1 truncate text-sm font-medium">{value}</div>
        {copyable ? (
          <Button aria-label={`复制${label}`} className="size-7" size="icon" variant="ghost">
            <CopyIcon className="size-3.5" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function EndpointItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-background px-3 py-2">
        <div className="min-w-0 flex-1 truncate font-mono text-xs">{value}</div>
        <Button aria-label={`复制${label}`} className="size-7" size="icon" variant="ghost">
          <CopyIcon className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

function ConfigBlock({ code, title }: { code: string; title: string }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">{title}</div>
        <Button size="sm" variant="ghost">
          <CopyIcon data-icon="inline-start" />
          复制
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-lg border bg-background p-4 text-xs leading-6 text-muted-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function TimeInfoItem({
  createdAt,
  updatedAt,
}: {
  createdAt: string
  updatedAt: string
}) {
  return (
    <div className="min-w-0 rounded-lg border bg-muted/30 p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">创建时间</div>
          <div className="mt-1 flex min-h-7 items-center truncate text-sm font-medium">{createdAt}</div>
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">更新时间</div>
          <div className="mt-1 flex min-h-7 items-center truncate text-sm font-medium">{updatedAt}</div>
        </div>
      </div>
    </div>
  )
}

function mcpClientExample(name: string, endpoint: string) {
  return JSON.stringify(
    {
      mcpServers: {
        [name]: {
          type: "streamable-http",
          url: endpoint,
          headers: {
            Authorization: "Bearer ${API_KEY}",
          },
        },
      },
    },
    null,
    2
  )
}

function headerExample() {
  return JSON.stringify(
    {
      key: "Authorization",
      value: "Bearer ${API_KEY}",
    },
    null,
    2
  )
}
