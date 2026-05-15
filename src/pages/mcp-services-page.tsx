import * as React from "react"
import { Link } from "react-router-dom"
import {
  AlertCircleIcon,
  CheckIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  LinkIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { mcpServices, type ServiceStatus } from "@/lib/mcp-services"
import { cn } from "@/lib/utils"

type SourceMode = "url" | "file"
type FileInputMode = "upload" | "paste"

type ParsedTool = {
  id: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  name: string
  path: string
}

type FailedTool = {
  id: string
  method: string
  path: string
  reason: string
}

const parsedTools: ParsedTool[] = [
  { id: "tool-1", method: "GET", name: "listPets", path: "/pets" },
  { id: "tool-2", method: "POST", name: "createPet", path: "/pets" },
  { id: "tool-3", method: "GET", name: "getPetById", path: "/pets/{petId}" },
  { id: "tool-4", method: "PUT", name: "updatePet", path: "/pets/{petId}" },
  { id: "tool-5", method: "DELETE", name: "deletePet", path: "/pets/{petId}" },
  { id: "tool-6", method: "GET", name: "listOrders", path: "/orders" },
  { id: "tool-7", method: "POST", name: "createOrder", path: "/orders" },
  { id: "tool-8", method: "GET", name: "getOrderById", path: "/orders/{orderId}" },
  { id: "tool-9", method: "PATCH", name: "updateOrderStatus", path: "/orders/{orderId}/status" },
  { id: "tool-10", method: "POST", name: "createRefund", path: "/orders/{orderId}/refunds" },
  { id: "tool-11", method: "GET", name: "listInvoices", path: "/invoices" },
  { id: "tool-12", method: "POST", name: "createInvoice", path: "/invoices" },
  { id: "tool-13", method: "GET", name: "getInvoiceById", path: "/invoices/{invoiceId}" },
  { id: "tool-14", method: "POST", name: "voidInvoice", path: "/invoices/{invoiceId}/void" },
  { id: "tool-15", method: "GET", name: "listCustomers", path: "/customers" },
  { id: "tool-16", method: "GET", name: "searchCustomers", path: "/customers/search" },
  { id: "tool-17", method: "POST", name: "createCustomer", path: "/customers" },
  { id: "tool-18", method: "PATCH", name: "updateCustomerOwner", path: "/customers/{customerId}/owner" },
  { id: "tool-19", method: "GET", name: "listTickets", path: "/tickets" },
  { id: "tool-20", method: "POST", name: "createTicket", path: "/tickets" },
  { id: "tool-21", method: "GET", name: "getTicketById", path: "/tickets/{ticketId}" },
  { id: "tool-22", method: "PATCH", name: "updateTicket", path: "/tickets/{ticketId}" },
  { id: "tool-23", method: "GET", name: "listProjects", path: "/projects" },
  { id: "tool-24", method: "POST", name: "createProject", path: "/projects" },
  { id: "tool-25", method: "GET", name: "getProjectById", path: "/projects/{projectId}" },
  { id: "tool-26", method: "GET", name: "listDeployments", path: "/deployments" },
  { id: "tool-27", method: "POST", name: "createDeployment", path: "/deployments" },
  { id: "tool-28", method: "GET", name: "listUsageRecords", path: "/usage/records" },
  { id: "tool-29", method: "GET", name: "listAuditLogs", path: "/audit/logs" },
  { id: "tool-30", method: "GET", name: "listApiKeys", path: "/api-keys" },
  { id: "tool-31", method: "POST", name: "createApiKey", path: "/api-keys" },
  { id: "tool-32", method: "DELETE", name: "revokeApiKey", path: "/api-keys/{keyId}" },
]

const failedTools: FailedTool[] = [
  {
    id: "failed-1",
    method: "POST",
    path: "/payments/{paymentId}/capture",
    reason: "缺少 operationId，无法生成稳定工具名称。",
  },
  {
    id: "failed-2",
    method: "GET",
    path: "/reports/export",
    reason: "返回 schema 引用了未定义的组件，解析结果不完整。",
  },
  {
    id: "failed-3",
    method: "PATCH",
    path: "/inventory/{sku}",
    reason: "请求体 schema 存在循环引用，当前示例未展开。",
  },
]

const methodBadgeClassName: Record<ParsedTool["method"], string> = {
  GET: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  POST: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  PUT: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  PATCH: "border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  DELETE: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
}

const MAX_SELECTED_TOOLS = 30

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

export default function McpServicesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <InputGroup className="w-full sm:w-80">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="搜索服务名称" />
        </InputGroup>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <CreateServiceDialog />
          <Button aria-label="健康检查" size="icon" variant="outline">
            <RefreshCwIcon />
          </Button>
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {mcpServices.map((service) => {
          const meta = statusMeta[service.status]

          return (
            <Card className="gap-3 border-border/70 py-4 shadow-none" key={service.id}>
              <CardContent className="flex flex-col gap-3 px-4">
                <Link className="group block rounded-lg" to={`/mcp-services/${service.id}`}>
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-base font-semibold leading-6 transition-colors group-hover:text-primary">
                        {service.name}
                      </CardTitle>
                      <div className="mt-1 line-clamp-2 text-xs leading-4 text-muted-foreground">
                        {service.description || "未填写描述"}
                      </div>
                    </div>
                    <div className="shrink-0 inline-flex items-center gap-2">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                        {service.tools.length} 个工具
                      </span>
                      <ChevronRightIcon className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>

                <div className="rounded-lg border bg-muted/20 p-3">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    MCP Server URL
                  </div>
                  <div className="mt-1.5 truncate font-mono text-[11px] leading-4 text-foreground">
                    {service.endpoint}
                  </div>
                </div>

                <div className="rounded-lg border bg-muted/20 p-3">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    API Base URL
                  </div>
                  <div className="mt-1.5 truncate font-mono text-[11px] leading-4 text-foreground">
                    {service.baseUrl}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t pt-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        meta.className
                      )}
                    >
                      {service.status === "offline" ? (
                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <span className="inline-flex size-3.5 items-center justify-center">
                                <meta.icon
                                  className="size-3.5"
                                  data-icon="inline-start"
                                />
                              </span>
                            }
                          />
                          <TooltipContent>
                            {service.warnings[0] || service.schemaValidation}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <meta.icon className="size-3.5" data-icon="inline-start" />
                      )}
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">
                      {service.lastCheck}
                    </span>
                    <Button aria-label="健康检查" className="size-7" size="icon" variant="ghost">
                      <RefreshCwIcon className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>
    </main>
  )
}

function CreateServiceDialog() {
  const [open, setOpen] = React.useState(false)
  const [failedToolsOpen, setFailedToolsOpen] = React.useState(false)
  const [step, setStep] = React.useState<1 | 2>(1)
  const [sourceMode, setSourceMode] = React.useState<SourceMode>("url")
  const [fileInputMode, setFileInputMode] = React.useState<FileInputMode>("paste")
  const [selectedToolIds, setSelectedToolIds] = React.useState<string[]>([])

  const selectedCount = selectedToolIds.length
  const canContinueToConfig = selectedCount > 0 && selectedCount <= MAX_SELECTED_TOOLS

  function handleOpenChange(nextOpen: boolean, details?: { reason?: string }) {
    if (nextOpen) {
      setOpen(true)
      return
    }

    if (details?.reason === "close-press") {
      setOpen(false)
      setStep(1)
    }
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

  return (
    <Dialog
      disablePointerDismissal
      onOpenChange={handleOpenChange}
      open={open}
    >
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" />
        新建服务
      </DialogTrigger>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 px-6 pt-6 pb-3">
          <DialogTitle>新建服务</DialogTitle>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto px-6 py-3">
          <div className="grid gap-2 md:grid-cols-2">
            {[
            { id: 1, title: "接口解析", description: "导入接口并选择工具" },
            { id: 2, title: "配置服务", description: "配置 MCP 与 API 信息" },
          ].map((item) => {
            const active = step === item.id
            const completed = step > item.id

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
                    <div className={cn("text-sm font-medium", !active && !completed && "text-foreground")}>
                      {item.title}
                    </div>
                    <div className="text-[11px] leading-4 text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {step === 1 ? (
          <FieldGroup className="gap-5">
            <section className="rounded-lg border bg-muted/20 p-4">
              <FieldGroup className="gap-4">
                <Field className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <FieldLabel htmlFor="source-mode">来源</FieldLabel>
                  <Select
                    onValueChange={(value) => setSourceMode(value as SourceMode)}
                    value={sourceMode}
                  >
                    <SelectTrigger className="w-full sm:w-44" id="source-mode">
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

                {sourceMode === "url" ? (
                  <div className="grid gap-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <FieldLabel className="shrink-0" htmlFor="openapi-url">
                        OpenAPI URL
                      </FieldLabel>
                      <Input
                        className="h-9 w-full flex-1"
                        id="openapi-url"
                        placeholder="https://api.example.com/openapi.json"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="button">导入工具</Button>
                    </div>
                  </div>
                ) : (
                    <div className="grid gap-3">
                      <div>
                      <div className="flex items-center justify-between gap-3">
                        <FieldLabel htmlFor="spec-file">OpenAPI 文件</FieldLabel>
                        {fileInputMode === "paste" ? (
                          <Button
                            onClick={() => setFileInputMode("upload")}
                            type="button"
                            variant="outline"
                          >
                            <UploadIcon data-icon="inline-start" />
                            上传文件
                          </Button>
                        ) : (
                          <Button
                            className="px-0 text-sm"
                            onClick={() => setFileInputMode("paste")}
                            type="button"
                            variant="link"
                          >
                            粘贴内容
                          </Button>
                        )}
                      </div>

                      {fileInputMode === "upload" ? (
                        <div className="mt-2 rounded-lg border border-dashed p-4">
                          <Input id="spec-file" type="file" />
                        </div>
                      ) : (
                        <Textarea
                          className="mt-2"
                          id="spec-content"
                          placeholder="粘贴 OpenAPI JSON 或 YAML"
                          rows={5}
                        />
                      )}
                      </div>
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
                <Badge variant={selectedCount > MAX_SELECTED_TOOLS ? "destructive" : "secondary"}>
                  {selectedCount}/{MAX_SELECTED_TOOLS}
                </Badge>
              </div>

              <ScrollArea className="mt-4 h-[19rem] rounded-lg border bg-background">
                <div className="grid gap-3 p-3">
                  {parsedTools.map((tool) => {
                    const checked = selectedToolIds.includes(tool.id)
                    const disabled = !checked && selectedCount >= MAX_SELECTED_TOOLS

                    return (
                      <label
                        className={cn(
                          "flex items-center gap-3 rounded-lg border bg-background p-3",
                          checked && "border-primary/40 bg-primary/5",
                          disabled && "opacity-60"
                        )}
                        htmlFor={tool.id}
                        key={tool.id}
                      >
                        <Checkbox
                          checked={checked}
                          disabled={disabled}
                          id={tool.id}
                          onCheckedChange={(nextChecked) =>
                            toggleTool(tool.id, nextChecked)
                          }
                        />
                        <FieldContent className="min-w-0 flex-1 flex-row items-center gap-3">
                          <span
                            className={cn(
                              "inline-flex shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium",
                              methodBadgeClassName[tool.method]
                            )}
                          >
                            {tool.method}
                          </span>
                          <FieldTitle className="shrink-0">{tool.name}</FieldTitle>
                          <FieldDescription className="min-w-0 truncate font-mono text-xs">
                            {tool.path}
                          </FieldDescription>
                        </FieldContent>
                      </label>
                    )
                  })}
                </div>
              </ScrollArea>

              <div className="mt-4 rounded-lg border bg-background p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm font-medium">{failedTools.length} 个接口解析失败</div>
                  <Button onClick={() => setFailedToolsOpen(true)} type="button" variant="outline">
                    查看原因
                  </Button>
                </div>
              </div>
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
                  <FieldLabel htmlFor="service-name">MCP 服务名称</FieldLabel>
                  <Input id="service-name" placeholder="例如：billing-api-mcp" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="service-description">服务描述</FieldLabel>
                  <Textarea
                    id="service-description"
                    placeholder="描述这个 MCP 服务的用途"
                    rows={3}
                  />
                </Field>
                <Field className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <FieldLabel htmlFor="mcp-auth-mode">认证方式</FieldLabel>
                  <Select defaultValue="api-key">
                    <SelectTrigger
                      className="w-full rounded-lg border-border/70 bg-background sm:w-44"
                      id="mcp-auth-mode"
                    >
                      <SelectValue placeholder="选择认证方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="api-key">API Key</SelectItem>
                        <SelectItem value="public">公开访问</SelectItem>
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
                  <FieldLabel htmlFor="base-url">API Base URL</FieldLabel>
                  <Input id="base-url" placeholder="https://api.example.com" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="auth-value">API Key</FieldLabel>
                  <Input id="auth-value" placeholder="填写 API Key" />
                </Field>
              </FieldGroup>
            </section>

            <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
              已选择 {selectedCount} 个工具，将按当前配置生成 MCP 服务。
            </div>
          </div>
        )}
        </div>

        <DialogFooter className="shrink-0 border-t px-6 py-3">
          {step === 1 ? (
            <Button disabled={!canContinueToConfig} onClick={() => setStep(2)}>
              下一步
            </Button>
          ) : (
            <>
              <Button onClick={() => setStep(1)} variant="outline">
                返回上一步
              </Button>
              <Button>
                <CheckIcon data-icon="inline-start" />
                创建服务
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>

      {failedToolsOpen ? (
        <div className="fixed inset-0 z-[70]">
          <button
            aria-label="关闭失败原因弹窗"
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setFailedToolsOpen(false)}
            type="button"
          />
          <div className="absolute top-1/2 left-1/2 z-[71] grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-6 text-sm text-popover-foreground ring-1 ring-foreground/10 sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>解析失败接口</DialogTitle>
            </DialogHeader>

            <Button
              aria-label="关闭失败原因弹窗"
              className="absolute top-4 right-4"
              onClick={() => setFailedToolsOpen(false)}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <XIcon />
            </Button>

            <div className="grid gap-3">
              {failedTools.map((tool) => (
                <div className="rounded-lg border p-4" key={tool.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-md border px-2 py-0.5 text-xs font-medium">
                      {tool.method}
                    </span>
                    <div className="font-medium">{tool.path}</div>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{tool.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Dialog>
  )
}
