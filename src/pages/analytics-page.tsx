import {
  Area,
  AreaChart,
  CartesianGrid,
  Bar,
  BarChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  ActivityIcon,
  ArrowUpRightIcon,
  CheckCircle2Icon,
  Clock3Icon,
  ServerIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

const conversionTrend = [
  { day: "05-07", success: 18, failed: 2 },
  { day: "05-08", success: 24, failed: 1 },
  { day: "05-09", success: 31, failed: 4 },
  { day: "05-10", success: 28, failed: 3 },
  { day: "05-11", success: 36, failed: 2 },
  { day: "05-12", success: 42, failed: 5 },
  { day: "05-13", success: 39, failed: 1 },
]

const toolDistribution = [
  { type: "GET", count: 126 },
  { type: "POST", count: 84 },
  { type: "PUT", count: 29 },
  { type: "DELETE", count: 13 },
  { type: "PATCH", count: 18 },
]

const conversionConfig = {
  success: {
    label: "成功转换",
    color: "var(--color-chart-3)",
  },
  failed: {
    label: "失败",
    color: "var(--color-destructive)",
  },
} satisfies ChartConfig

const methodConfig = {
  count: {
    label: "工具数量",
    color: "var(--color-chart-4)",
  },
} satisfies ChartConfig

const summaryCards = [
  {
    title: "OpenAPI 文档",
    value: "128",
    helper: "本周新增 18 个",
    icon: ActivityIcon,
  },
  {
    title: "MCP 服务",
    value: "42",
    helper: "31 个运行中",
    icon: ServerIcon,
  },
  {
    title: "转换成功率",
    value: "96.8%",
    helper: "较上周 +2.4%",
    icon: CheckCircle2Icon,
  },
  {
    title: "平均转换耗时",
    value: "4.2s",
    helper: "P95 8.7s",
    icon: Clock3Icon,
  },
]

const queueItems = [
  { name: "petstore-v3.yaml", status: "转换完成", value: 100 },
  { name: "billing-openapi.json", status: "生成工具描述", value: 72 },
  { name: "crm-admin.yaml", status: "等待校验", value: 38 },
]

export default function AnalyticsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <Card key={item.title} size="sm">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardAction>
                <item.icon className="text-muted-foreground" />
              </CardAction>
              <CardDescription>{item.helper}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-semibold tracking-tight">
                  {item.value}
                </div>
                <Badge variant="secondary">
                  <ArrowUpRightIcon data-icon="inline-start" />
                  稳定
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>转换趋势</CardTitle>
            <CardDescription>最近 7 天成功与失败任务数量</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="h-[300px] w-full"
              config={conversionConfig}
            >
              <AreaChart data={conversionTrend}>
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
                  fill="var(--color-success)"
                  fillOpacity={0.35}
                  stroke="var(--color-success)"
                  type="monotone"
                />
                <Area
                  dataKey="failed"
                  fill="var(--color-failed)"
                  fillOpacity={0.16}
                  stroke="var(--color-failed)"
                  type="monotone"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>工具方法分布</CardTitle>
            <CardDescription>按 OpenAPI operation method 统计</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[300px] w-full" config={methodConfig}>
              <BarChart data={toolDistribution}>
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="type"
                  tickLine={false}
                  tickMargin={10}
                />
                <YAxis axisLine={false} tickLine={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(360px,1fr)_minmax(0,1.6fr)]">
        <Card>
          <CardHeader>
            <CardTitle>转换队列</CardTitle>
            <CardDescription>当前待处理和进行中的 OpenAPI 文档</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {queueItems.map((item) => (
              <div key={item.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-medium">{item.name}</span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {item.status}
                  </span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>质量概览</CardTitle>
            <CardDescription>转换前校验与 MCP 工具生成质量</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Badge variant="outline">Schema 校验</Badge>
              <div className="text-2xl font-semibold">98.4%</div>
              <p className="text-sm text-muted-foreground">
                参数类型、必填项和响应结构可被正常解析。
              </p>
            </div>
            <Separator className="hidden md:block" orientation="vertical" />
            <div className="flex flex-col gap-2">
              <Badge variant="outline">工具命名</Badge>
              <div className="text-2xl font-semibold">91.2%</div>
              <p className="text-sm text-muted-foreground">
                operationId 完整且可生成稳定 MCP tool name。
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Badge variant="destructive">
                <TriangleAlertIcon data-icon="inline-start" />
                12 个风险项
              </Badge>
              <div className="text-2xl font-semibold">需处理</div>
              <p className="text-sm text-muted-foreground">
                主要集中在鉴权声明缺失和重复路径参数。
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
