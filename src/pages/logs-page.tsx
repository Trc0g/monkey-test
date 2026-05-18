import * as React from "react"
import { ListFilterIcon, SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

const DEFAULT_PAGE_SIZE = 20

const pageSizeOptions = [10, 20, 50] as const

const statusOptions = {
  "all-statuses": "全部状态",
  success: "成功",
  failed: "失败",
} as const

type LogStatus = Exclude<keyof typeof statusOptions, "all-statuses">

const logTemplates = [
  {
    id: "log_01",
    time: "05/13 14:22:08",
    service: "petstore-mcp",
    keyName: "默认密钥",
    toolName: "listPets",
    latency: "186ms",
    status: "success" as LogStatus,
    request: {
      method: "GET",
      path: "/pets",
      query: { limit: 20, status: "available" },
    },
    response: {
      status: 200,
      body: { data: [{ id: "pet_001", name: "Lucky" }], total: 1 },
    },
  },
  {
    id: "log_02",
    time: "05/13 14:18:33",
    service: "billing-api-mcp",
    keyName: "生产环境 Key",
    toolName: "createInvoice",
    latency: "1.02s",
    status: "success" as LogStatus,
    request: {
      method: "POST",
      path: "/invoices",
      body: { customerId: "cus_018", amount: 12800 },
    },
    response: {
      status: 201,
      body: { invoiceId: "inv_9281", status: "created" },
    },
  },
  {
    id: "log_03",
    time: "05/13 14:11:49",
    service: "crm-admin-mcp",
    keyName: "测试环境 Key",
    toolName: "searchCustomers",
    latency: "381ms",
    status: "success" as LogStatus,
    request: {
      method: "GET",
      path: "/customers/search",
      query: { keyword: "demo" },
    },
    response: {
      status: 200,
      body: { data: [{ id: "cus_018", name: "Demo Corp" }] },
    },
  },
  {
    id: "log_04",
    time: "05/13 13:58:12",
    service: "order-center-mcp",
    keyName: "默认密钥",
    toolName: "updateOrderStatus",
    latency: "2.31s",
    status: "failed" as LogStatus,
    request: {
      method: "PATCH",
      path: "/orders/order_381/status",
      body: { status: "paid" },
    },
    response: {
      status: 502,
      body: { error: "Bad Gateway", message: "Upstream service timeout" },
    },
  },
  {
    id: "log_05",
    time: "05/13 13:41:27",
    service: "petstore-mcp",
    keyName: "演示客户端 Key",
    toolName: "getPetById",
    latency: "92ms",
    status: "success" as LogStatus,
    request: {
      method: "GET",
      path: "/pets/pet_001",
    },
    response: {
      status: 200,
      body: { id: "pet_001", name: "Lucky", status: "available" },
    },
  },
]

const logs = Array.from({ length: 45 }, (_, index) => {
  const template = logTemplates[index % logTemplates.length]

  return {
    ...template,
    id: `log_${String(index + 1).padStart(2, "0")}`,
  }
})

export default function LogsPage() {
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE)
  const [selectedLog, setSelectedLog] = React.useState<(typeof logs)[number] | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<keyof typeof statusOptions>("all-statuses")
  const filteredLogs = logs.filter((log) => {
    return statusFilter === "all-statuses" || log.status === statusFilter
  })
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize))
  const startIndex = (page - 1) * pageSize
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize)

  function changeStatusFilter(value: keyof typeof statusOptions) {
    setStatusFilter(value)
    setPage(1)
  }

  function changePageSize(value: string) {
    setPageSize(Number(value))
    setPage(1)
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <InputGroup className="rounded-xl sm:max-w-md">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="搜索服务、Key 名称、工具名称" />
          </InputGroup>
          <Select
            onValueChange={(value) => changeStatusFilter(value as keyof typeof statusOptions)}
            value={statusFilter}
          >
            <SelectTrigger className="w-full justify-start rounded-xl bg-background px-3 sm:w-36">
              <ListFilterIcon data-icon="inline-start" />
              <SelectValue>{statusOptions[statusFilter]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-statuses">全部状态</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-xl border bg-background shadow-xs">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>时间</TableHead>
                  <TableHead>服务</TableHead>
                  <TableHead>Key 名称</TableHead>
                  <TableHead>工具名称</TableHead>
                  <TableHead className="text-right">耗时</TableHead>
                  <TableHead className="text-right">状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => (
                  <TableRow
                    className="cursor-pointer hover:bg-muted/40"
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                  >
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {log.time}
                    </TableCell>
                    <TableCell className="font-medium">{log.service}</TableCell>
                    <TableCell>{log.keyName}</TableCell>
                    <TableCell>
                      <Badge className="font-mono font-normal" variant="secondary">
                        {log.toolName}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-mono text-xs">
                      {log.latency}
                    </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={log.status === "success" ? "default" : "destructive"}>
                          {log.status === "success" ? "成功" : "失败"}
                        </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-3 border-t px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span>共 {filteredLogs.length} 条</span>
              <Select onValueChange={changePageSize} value={String(pageSize)}>
                <SelectTrigger className="h-8 w-28 bg-background px-2">
                  <SelectValue>{pageSize} 条 / 页</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {pageSizeOptions.map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option} 条 / 页
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                size="sm"
                variant="outline"
              >
                上一页
              </Button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <Button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  size="icon-sm"
                  variant={pageNumber === page ? "default" : "ghost"}
                >
                  {pageNumber}
                </Button>
              ))}
              <Button
                disabled={page === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                size="sm"
                variant="outline"
              >
                下一页
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={Boolean(selectedLog)} onOpenChange={(open) => !open && setSelectedLog(null)}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>调用日志详情</DialogTitle>
          </DialogHeader>
          {selectedLog ? (
            <div className="grid gap-5">
              <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <LogDetailItem label="服务" value={selectedLog.service} />
                <LogDetailItem label="Key 名称" value={selectedLog.keyName} />
                <LogDetailItem label="工具名称" value={selectedLog.toolName} />
                <LogDetailItem label="调用状态" value={statusOptions[selectedLog.status]} />
              </div>
              <LogPayloadBlock title="请求内容" value={selectedLog.request} />
              <LogPayloadBlock title="响应内容" value={selectedLog.response} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  )
}

function LogDetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 truncate font-medium">{value}</div>
    </div>
  )
}

function LogPayloadBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <section className="grid gap-2">
      <div className="text-sm font-semibold">{title}</div>
      <pre className="max-h-80 overflow-auto rounded-xl border bg-muted/30 p-4 text-xs leading-6 text-muted-foreground">
        {JSON.stringify(value, null, 2)}
      </pre>
    </section>
  )
}
