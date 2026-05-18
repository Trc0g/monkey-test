import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  ActivityIcon,
  Clock3Icon,
  ServerIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const callTrend = [
  { day: "05-07", success: 1240, failed: 36 },
  { day: "05-08", success: 1386, failed: 42 },
  { day: "05-09", success: 1528, failed: 61 },
  { day: "05-10", success: 1462, failed: 48 },
  { day: "05-11", success: 1715, failed: 39 },
  { day: "05-12", success: 1842, failed: 74 },
  { day: "05-13", success: 1936, failed: 44 },
]

const toolUsage = [
  { name: "listPets", meta: "服务：petstore-mcp", count: "2,860" },
  { name: "createInvoice", meta: "服务：billing-api-mcp", count: "2,140" },
  { name: "searchCustomers", meta: "服务：crm-admin-mcp", count: "1,680" },
  { name: "getPetById", meta: "服务：petstore-mcp", count: "1,268" },
  { name: "updateOrderStatus", meta: "服务：order-center-mcp", count: "842" },
]

const serviceUsage = [
  { name: "petstore-mcp", meta: "18 个工具", count: "4,128" },
  { name: "billing-api-mcp", meta: "24 个工具", count: "3,406" },
  { name: "crm-admin-mcp", meta: "31 个工具", count: "2,219" },
  { name: "order-center-mcp", meta: "16 个工具", count: "1,647" },
  { name: "inventory-mcp", meta: "12 个工具", count: "936" },
]

const keyUsage = [
  { name: "生产环境 Key", meta: "服务：billing-api-mcp", count: "3,012" },
  { name: "默认密钥", meta: "服务：petstore-mcp", count: "2,786" },
  { name: "测试环境 Key", meta: "服务：crm-admin-mcp", count: "1,936" },
  { name: "演示客户端 Key", meta: "服务：petstore-mcp", count: "1,144" },
  { name: "订单服务 Key", meta: "服务：order-center-mcp", count: "731" },
]

const callTrendConfig = {
  success: {
    label: "成功调用",
    color: "oklch(0.555 0.163 48.998)",
  },
  failed: {
    label: "失败调用",
    color: "oklch(0.577 0.245 27.325)",
  },
} satisfies ChartConfig

const summaryCards = [
  {
    title: "接入服务",
    value: "42",
    status: [
      { label: "异常", value: "3", className: "text-[oklch(0.577_0.245_27.325)]" },
    ],
    icon: ServerIcon,
  },
  {
    title: "今日工具调用",
    value: "1,980",
    status: [
      { label: "异常", value: "44", className: "text-[oklch(0.577_0.245_27.325)]" },
    ],
    icon: ActivityIcon,
  },
  {
    title: "平均响应耗时",
    value: "284ms",
    icon: Clock3Icon,
  },
]

export default function AnalyticsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((item) => (
          <Card className="border-[oklch(0.555_0.163_48.998_/_0.18)]" key={item.title} size="sm">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardAction>
                <item.icon className="text-[oklch(0.555_0.163_48.998)]" />
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                <div className="text-3xl font-semibold tracking-tight">
                  {item.value}
                </div>
                {item.status ? (
                  <div className="flex flex-wrap items-center gap-1.5 pb-1">
                    {item.status.map((status) => (
                      <span
                        className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground"
                        key={status.label}
                      >
                        <span>{status.label}</span>
                        <span className={status.className}>{status.value}</span>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>调用趋势</CardTitle>
              <Badge
                className="w-fit bg-[oklch(0.555_0.163_48.998_/_0.1)] text-[oklch(0.555_0.163_48.998)]"
                variant="secondary"
              >
                近 30 天
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[280px] w-full"
              config={callTrendConfig}
            >
              <AreaChart data={callTrend}>
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="day"
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis axisLine={false} tickLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="success"
                  fill="oklch(0.555 0.163 48.998)"
                  fillOpacity={0.3}
                  stroke="oklch(0.555 0.163 48.998)"
                  type="monotone"
                />
                <Area
                  dataKey="failed"
                  fill="oklch(0.577 0.245 27.325)"
                  fillOpacity={0.16}
                  stroke="oklch(0.577 0.245 27.325)"
                  type="monotone"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <RankingCard items={serviceUsage} title="今日服务调用排行" />
        <RankingCard items={toolUsage} title="今日工具调用排行" />
        <RankingCard items={keyUsage} title="今日 Key 调用排行" />
      </section>
    </main>
  )
}

function RankingCard({
  items,
  title,
}: {
  items: Array<{ count: string; meta: string; name: string }>
  title: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {items.map((item, index) => (
          <div
            className="flex items-center gap-3 rounded-xl border bg-muted/20 p-3"
            key={item.name}
          >
            <div className="w-5 shrink-0 text-sm font-medium text-muted-foreground">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{item.name}</div>
              <div className="truncate text-xs text-muted-foreground">{item.meta}</div>
            </div>
            <Badge
              className="bg-[oklch(0.555_0.163_48.998_/_0.1)] text-[oklch(0.555_0.163_48.998)]"
              variant="secondary"
            >
              {item.count} 次调用
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
