import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const apiCallRecords = [
  {
    id: "req_01jqs4q9a1",
    calledAt: "2026-03-25 18:42:15",
    endpoint: "/v1/chat/completions",
    model: "gpt-5.4",
    status: 200,
    latency: "842 ms",
    tokens: "1,284",
  },
  {
    id: "req_01jqs4g2bz",
    calledAt: "2026-03-25 18:36:49",
    endpoint: "/v1/responses",
    model: "gpt-5.4-mini",
    status: 200,
    latency: "513 ms",
    tokens: "642",
  },
  {
    id: "req_01jqs45nwv",
    calledAt: "2026-03-25 18:30:08",
    endpoint: "/v1/embeddings",
    model: "text-embedding-3-large",
    status: 200,
    latency: "167 ms",
    tokens: "3,096",
  },
  {
    id: "req_01jqs3x7mp",
    calledAt: "2026-03-25 18:12:54",
    endpoint: "/v1/chat/completions",
    model: "gpt-5.4",
    status: 429,
    latency: "91 ms",
    tokens: "0",
  },
  {
    id: "req_01jqs3m1fd",
    calledAt: "2026-03-25 17:58:22",
    endpoint: "/v1/images/generations",
    model: "gpt-image-1",
    status: 200,
    latency: "2,341 ms",
    tokens: "0",
  },
]

export default function UsageMonitoringPage() {
  return (
    <div className="flex flex-1 flex-col p-4 pt-0">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">用量监控</h1>
        <p className="text-sm text-muted-foreground">
          最近 API 调用记录
        </p>
      </div>

      <div className="mt-4 rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>调用时间</TableHead>
              <TableHead>请求 ID</TableHead>
              <TableHead>API</TableHead>
              <TableHead>模型</TableHead>
              <TableHead>状态码</TableHead>
              <TableHead>耗时</TableHead>
              <TableHead className="text-right">Token</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiCallRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.calledAt}</TableCell>
                <TableCell className="font-mono text-xs">{record.id}</TableCell>
                <TableCell>{record.endpoint}</TableCell>
                <TableCell>{record.model}</TableCell>
                <TableCell>{record.status}</TableCell>
                <TableCell>{record.latency}</TableCell>
                <TableCell className="text-right">{record.tokens}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
