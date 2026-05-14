import { Link, Navigate, useParams } from "react-router-dom"
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  CopyIcon,
  FileJsonIcon,
  RefreshCwIcon,
  ShieldCheckIcon,
  WrenchIcon,
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
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { defaultConsolePage } from "@/lib/console-pages"
import { getMcpService, type ServiceStatus } from "@/lib/mcp-services"
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

export default function McpServiceDetailPage() {
  const { id } = useParams()
  const service = getMcpService(id)

  if (!service) {
    return <Navigate replace to={defaultConsolePage} />
  }

  const meta = statusMeta[service.status]
  const enabledTools = service.tools.filter((tool) => tool.enabled).length

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-3">
          <Button className="w-fit" render={<Link to="/mcp-services" />} variant="ghost">
            <ArrowLeftIcon data-icon="inline-start" />
            返回服务管理
          </Button>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">
                {service.name}
              </h1>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs",
                  meta.className
                )}
              >
                <meta.icon data-icon="inline-start" />
                {meta.label}
              </span>
              <Badge variant="outline">{service.version}</Badge>
            </div>
            <p className="max-w-3xl text-sm text-muted-foreground">
              {service.description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">
            <RefreshCwIcon data-icon="inline-start" />
            重新转换
          </Button>
          <Button>
            <ShieldCheckIcon data-icon="inline-start" />
            发布配置
          </Button>
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["工具总数", service.tools.length],
          ["启用工具", enabledTools],
          ["转换状态", meta.label],
          ["最近检查", service.lastCheck],
        ].map(([label, value]) => (
          <div
            className="flex flex-col gap-1 rounded-lg border bg-background px-4 py-3"
            key={label}
          >
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-xl font-semibold">{value}</span>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <Card>
          <CardHeader>
            <CardTitle>连接信息</CardTitle>
            <CardDescription>当前 MCP 服务对外连接与源 API 地址</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <WrenchIcon />
                MCP Endpoint
              </div>
              <div className="flex items-center gap-2">
                <Input
                  aria-label="MCP endpoint"
                  className="font-mono text-xs"
                  readOnly
                  value={service.endpoint}
                />
                <Button aria-label="复制 MCP endpoint" size="icon" variant="outline">
                  <CopyIcon />
                </Button>
              </div>
            </div>
            <Separator />
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem label="OpenAPI 文档" value={service.source} />
              <InfoItem label="文档来源" value={sourceTypeLabel(service.sourceType)} />
              <InfoItem label="Base URL" value={service.baseUrl} />
              <InfoItem label="鉴权方式" value={service.auth} />
              <InfoItem label="传输协议" value={service.transport} />
              <InfoItem label="更新时间" value={service.updatedAt} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>转换配置</CardTitle>
            <CardDescription>OpenAPI 转 MCP 的生成规则</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <InfoBlock
              icon={FileJsonIcon}
              label="工具命名"
              value={service.namingStrategy}
            />
            <InfoBlock
              icon={ShieldCheckIcon}
              label="Schema 校验"
              value={service.schemaValidation}
            />
            {service.warnings.length ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircleIcon />
                  需要处理
                </div>
                <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-sm text-muted-foreground">
                  {service.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                当前转换配置没有阻塞项。
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>工具清单</CardTitle>
          <CardDescription>
            由 OpenAPI paths 和 operations 生成的 MCP tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>工具名</TableHead>
                  <TableHead>方法</TableHead>
                  <TableHead>路径</TableHead>
                  <TableHead>说明</TableHead>
                  <TableHead>状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {service.tools.map((tool) => (
                  <TableRow key={tool.name}>
                    <TableCell className="font-mono text-xs">
                      {tool.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tool.method}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {tool.path}
                    </TableCell>
                    <TableCell>{tool.description}</TableCell>
                    <TableCell>
                      <Badge variant={tool.enabled ? "default" : "secondary"}>
                        {tool.enabled ? "启用" : "未启用"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-lg border bg-muted/30 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-sm font-medium">{value}</div>
    </div>
  )
}

function InfoBlock({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileJsonIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Icon />
        {label}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{value}</p>
    </div>
  )
}

function sourceTypeLabel(sourceType: "url" | "upload" | "repository") {
  const labels = {
    url: "远程 URL",
    upload: "本地上传",
    repository: "代码仓库",
  }

  return labels[sourceType]
}
