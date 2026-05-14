import { Link } from "react-router-dom"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ChevronRightIcon,
  CopyIcon,
  FileJsonIcon,
  GlobeIcon,
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  ShieldCheckIcon,
  UploadIcon,
  WrenchIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { mcpServices, type ServiceStatus } from "@/lib/mcp-services"
import { cn } from "@/lib/utils"

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
  syncing: {
    label: "同步中",
    icon: RefreshCwIcon,
    className: "bg-secondary text-secondary-foreground",
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
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight">服务管理</h1>
          <p className="text-sm text-muted-foreground">
            管理由 OpenAPI 文档生成的 MCP 服务、工具数量、运行状态和连接地址。
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <InputGroup className="w-full sm:w-80">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="搜索服务名称" />
          </InputGroup>
          <CreateServiceDialog />
          <Button aria-label="健康检查" size="icon" variant="outline">
            <RefreshCwIcon />
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mcpServices.map((service) => {
          const meta = statusMeta[service.status]

          return (
            <Card className="gap-4 border-border/70 py-5" key={service.id}>
              <CardContent className="flex flex-col gap-5 px-5">
                <Link className="group block rounded-lg" to={`/mcp-services/${service.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle className="truncate transition-colors group-hover:text-primary">
                          {service.name}
                        </CardTitle>
                        <ChevronRightIcon className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                      </div>
                      <Tooltip>
                        <TooltipTrigger>
                          <CardDescription className="mt-1 line-clamp-1 text-left">
                            {service.description}
                          </CardDescription>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-80 whitespace-pre-wrap break-words">
                          {service.description}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Badge variant="secondary">{service.tools.length} 个工具</Badge>
                  </div>
                </Link>

                <div className="grid gap-3">
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileJsonIcon />
                      OpenAPI 文档
                    </div>
                    <div className="mt-2 truncate text-sm font-medium">
                      {service.source}
                    </div>
                  </div>
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <WrenchIcon />
                      Server URL
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        aria-label={`${service.name} endpoint`}
                        className="font-mono text-xs"
                        readOnly
                        value={service.endpoint}
                      />
                      <Button
                        aria-label="复制 endpoint"
                        size="icon"
                        variant="outline"
                      >
                        <CopyIcon />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs",
                        meta.className
                      )}
                    >
                      <meta.icon data-icon="inline-start" />
                      {meta.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {service.lastCheck}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{service.version}</Badge>
                    <Button aria-label="健康检查" size="icon" variant="ghost">
                      <RefreshCwIcon />
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
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        <PlusIcon data-icon="inline-start" />
        新建服务
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>新建 OpenAPI 转 MCP 服务</DialogTitle>
          <DialogDescription>
            填写 OpenAPI 文档来源、目标 API 基础地址和转换策略，系统将解析 paths 并生成 MCP tools。
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="gap-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="service-name">服务名称</FieldLabel>
              <Input id="service-name" placeholder="例如：billing-api-mcp" />
              <FieldDescription>
                用于 MCP 服务标识，建议使用小写字母、数字和短横线。
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="source-type">OpenAPI 来源</FieldLabel>
              <Select defaultValue="url">
                <SelectTrigger className="w-full" id="source-type">
                  <SelectValue placeholder="选择来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="url">
                      <GlobeIcon />
                      远程 URL
                    </SelectItem>
                    <SelectItem value="upload">
                      <UploadIcon />
                      上传文件
                    </SelectItem>
                    <SelectItem value="repository">
                      <FileJsonIcon />
                      代码仓库
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="openapi-url">OpenAPI 文档地址</FieldLabel>
            <Input
              id="openapi-url"
              placeholder="https://api.example.com/openapi.json"
            />
            <FieldDescription>
              支持 OpenAPI 3.x 的 JSON 或 YAML；上传模式下这里会替换为文件选择器。
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="base-url">目标 API Base URL</FieldLabel>
            <Input id="base-url" placeholder="https://api.example.com" />
            <FieldDescription>
              MCP tool 被调用时会按 OpenAPI path 拼接这个地址转发请求。
            </FieldDescription>
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="auth-mode">目标 API 鉴权</FieldLabel>
              <Select defaultValue="bearer">
                <SelectTrigger className="w-full" id="auth-mode">
                  <SelectValue placeholder="选择鉴权方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none">无鉴权</SelectItem>
                    <SelectItem value="bearer">Bearer Token</SelectItem>
                    <SelectItem value="api-key">API Key Header</SelectItem>
                    <SelectItem value="passthrough">调用方透传</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="transport">MCP 传输协议</FieldLabel>
              <Select defaultValue="sse">
                <SelectTrigger className="w-full" id="transport">
                  <SelectValue placeholder="选择协议" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="sse">SSE</SelectItem>
                    <SelectItem value="streamable-http">
                      Streamable HTTP
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="description">服务说明</FieldLabel>
            <Textarea
              id="description"
              placeholder="说明这个 MCP 服务覆盖的业务域和主要工具用途"
              rows={3}
            />
          </Field>

          <div className="rounded-lg border bg-muted/30 p-4">
            <FieldGroup className="gap-4">
              <Field orientation="horizontal">
                <Checkbox defaultChecked id="validate-schema" />
                <FieldContent>
                  <FieldTitle>导入前校验 OpenAPI Schema</FieldTitle>
                  <FieldDescription>
                    检查 paths、parameters、requestBody 和 response schema，阻止明显不可转换的文档发布。
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <Checkbox defaultChecked id="auto-name" />
                <FieldContent>
                  <FieldTitle>自动补齐缺失 operationId</FieldTitle>
                  <FieldDescription>
                    对缺少 operationId 的接口按 method + path 生成稳定 tool name。
                  </FieldDescription>
                </FieldContent>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="hide-dangerous" />
                <FieldContent>
                  <FieldTitle>默认禁用高风险写操作</FieldTitle>
                  <FieldDescription>
                    POST、PUT、PATCH、DELETE 工具先生成但不启用，确认后再发布给 MCP 客户端。
                  </FieldDescription>
                </FieldContent>
              </Field>
            </FieldGroup>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheckIcon />
              生成预期
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              提交后会解析 OpenAPI 文档，生成工具名、参数 JSON Schema、鉴权转发配置和 MCP endpoint。转换完成前服务状态会显示为“同步中”。
            </p>
          </div>
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline">保存草稿</Button>
          <Button>解析并生成服务</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
