import {
  AlertCircleIcon,
  CheckCircle2Icon,
  DownloadIcon,
  FilterIcon,
  InfoIcon,
  SearchIcon,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const logs = [
  {
    id: "log_01",
    time: "2026-05-13 14:22:08",
    level: "info",
    service: "petstore-mcp",
    stage: "tool_call",
    message: "GET /pets 工具调用成功，耗时 186 ms",
    requestId: "req_6ca901",
  },
  {
    id: "log_02",
    time: "2026-05-13 14:18:33",
    level: "success",
    service: "billing-api-mcp",
    stage: "deploy",
    message: "SSE endpoint 已发布，生成 37 个 MCP tools",
    requestId: "job_9ff182",
  },
  {
    id: "log_03",
    time: "2026-05-13 14:11:49",
    level: "warning",
    service: "crm-admin-mcp",
    stage: "convert",
    message: "发现 3 个 operationId 重复，已自动添加路径后缀",
    requestId: "job_a18d03",
  },
  {
    id: "log_04",
    time: "2026-05-13 13:58:12",
    level: "error",
    service: "order-center-mcp",
    stage: "validate",
    message: "securitySchemes.oauth2 缺少 tokenUrl，转换已暂停",
    requestId: "job_447acb",
  },
  {
    id: "log_05",
    time: "2026-05-13 13:41:27",
    level: "info",
    service: "petstore-mcp",
    stage: "sync",
    message: "检测到 OpenAPI 文档更新，开始增量转换",
    requestId: "job_48ac71",
  },
]

const levelMeta = {
  info: {
    label: "INFO",
    icon: InfoIcon,
    variant: "secondary",
  },
  success: {
    label: "SUCCESS",
    icon: CheckCircle2Icon,
    variant: "default",
  },
  warning: {
    label: "WARN",
    icon: AlertCircleIcon,
    variant: "outline",
  },
  error: {
    label: "ERROR",
    icon: AlertCircleIcon,
    variant: "destructive",
  },
} as const

export default function LogsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex justify-end">
        <Button variant="outline">
          <DownloadIcon data-icon="inline-start" />
          导出日志
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>事件流</CardTitle>
          <CardDescription>默认展示最近 24 小时日志</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_180px_auto]">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput placeholder="搜索日志内容、服务名或请求 ID" />
            </InputGroup>
            <Select defaultValue="all-levels">
              <SelectTrigger>
                <SelectValue placeholder="日志级别" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-levels">全部级别</SelectItem>
                  <SelectItem value="info">INFO</SelectItem>
                  <SelectItem value="success">SUCCESS</SelectItem>
                  <SelectItem value="warning">WARN</SelectItem>
                  <SelectItem value="error">ERROR</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select defaultValue="all-stages">
              <SelectTrigger>
                <SelectValue placeholder="阶段" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-stages">全部阶段</SelectItem>
                  <SelectItem value="validate">校验</SelectItem>
                  <SelectItem value="convert">转换</SelectItem>
                  <SelectItem value="deploy">部署</SelectItem>
                  <SelectItem value="tool_call">工具调用</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <FilterIcon data-icon="inline-start" />
              筛选
            </Button>
          </div>

          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>级别</TableHead>
                  <TableHead>服务</TableHead>
                  <TableHead>阶段</TableHead>
                  <TableHead>日志内容</TableHead>
                  <TableHead>请求 ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const meta = levelMeta[log.level as keyof typeof levelMeta]
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {log.time}
                      </TableCell>
                      <TableCell>
                        <Badge variant={meta.variant}>
                          <meta.icon data-icon="inline-start" />
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.service}</TableCell>
                      <TableCell>{log.stage}</TableCell>
                      <TableCell className="min-w-80">{log.message}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {log.requestId}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
