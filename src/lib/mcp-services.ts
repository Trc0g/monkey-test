export type ServiceStatus = "online" | "syncing" | "offline"

export type McpTool = {
  name: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  description: string
  enabled: boolean
}

export type McpService = {
  id: string
  name: string
  description: string
  source: string
  sourceType: "url" | "upload" | "repository"
  status: ServiceStatus
  version: string
  endpoint: string
  updatedAt: string
  createdAt: string
  lastCheck: string
  baseUrl: string
  auth: string
  namingStrategy: string
  transport: "SSE" | "Streamable HTTP"
  schemaValidation: string
  tools: McpTool[]
  warnings: string[]
}

export const mcpServices: McpService[] = [
  {
    id: "svc_petstore",
    name: "petstore-mcp",
    description: "由 Petstore OpenAPI v3 文档生成，覆盖宠物、库存与订单查询工具。",
    source: "petstore-v3.yaml",
    sourceType: "upload",
    status: "online",
    version: "v1.3.2",
    endpoint: "https://mcp.example.com/sse/petstore",
    updatedAt: "2026-05-13 14:18",
    createdAt: "2026-05-02 09:42",
    lastCheck: "05-13 14:20",
    baseUrl: "https://petstore.example.com/api/v3",
    auth: "Bearer Token",
    namingStrategy: "operationId 优先，缺失时按 method + path 生成",
    transport: "SSE",
    schemaValidation: "通过，2 个 optional response schema 已跳过",
    warnings: [],
    tools: [
      {
        name: "listPets",
        method: "GET",
        path: "/pets",
        description: "按分页参数查询宠物列表。",
        enabled: true,
      },
      {
        name: "createPet",
        method: "POST",
        path: "/pets",
        description: "创建新的宠物档案。",
        enabled: true,
      },
      {
        name: "getPetById",
        method: "GET",
        path: "/pets/{petId}",
        description: "根据 petId 读取宠物详情。",
        enabled: true,
      },
    ],
  },
  {
    id: "svc_billing",
    name: "billing-api-mcp",
    description: "账单中心接口转换服务，包含账单查询、开票和付款状态同步。",
    source: "https://docs.example.com/openapi/billing.json",
    sourceType: "url",
    status: "syncing",
    version: "v0.9.8",
    endpoint: "https://mcp.example.com/sse/billing",
    updatedAt: "2026-05-13 13:46",
    createdAt: "2026-05-06 16:05",
    lastCheck: "同步中",
    baseUrl: "https://billing.example.com/openapi",
    auth: "自定义 Header：X-API-Key",
    namingStrategy: "自动补齐缺失 operationId",
    transport: "Streamable HTTP",
    schemaValidation: "校验中",
    warnings: ["3 个接口缺少 response examples，工具说明将使用 schema 摘要生成。"],
    tools: [
      {
        name: "queryInvoices",
        method: "GET",
        path: "/invoices",
        description: "按客户、日期范围和状态查询账单。",
        enabled: true,
      },
      {
        name: "createInvoice",
        method: "POST",
        path: "/invoices",
        description: "创建待支付账单。",
        enabled: true,
      },
      {
        name: "voidInvoice",
        method: "POST",
        path: "/invoices/{invoiceId}/void",
        description: "作废指定账单。",
        enabled: false,
      },
    ],
  },
  {
    id: "svc_crm",
    name: "crm-admin-mcp",
    description: "CRM 管理后台接口，当前因鉴权配置缺失暂停对外提供 MCP 服务。",
    source: "crm-admin.yaml",
    sourceType: "upload",
    status: "offline",
    version: "v2.1.0",
    endpoint: "https://mcp.example.com/sse/crm-admin",
    updatedAt: "2026-05-12 18:09",
    createdAt: "2026-04-28 11:18",
    lastCheck: "05-12 18:12",
    baseUrl: "https://crm.example.com/admin-api",
    auth: "未配置",
    namingStrategy: "按 tag 分组后生成工具名",
    transport: "SSE",
    schemaValidation: "失败，securitySchemes.oauth2 缺少 tokenUrl",
    warnings: [
      "OAuth2 配置缺少 tokenUrl。",
      "2 个路径参数在 path 和 parameters 中命名不一致。",
    ],
    tools: [
      {
        name: "searchCustomers",
        method: "GET",
        path: "/customers",
        description: "按关键词检索客户。",
        enabled: false,
      },
      {
        name: "updateCustomerOwner",
        method: "PATCH",
        path: "/customers/{customerId}/owner",
        description: "调整客户负责人。",
        enabled: false,
      },
    ],
  },
  {
    id: "svc_order",
    name: "order-center-mcp",
    description: "订单中心 OpenAPI 转换服务，面向订单检索、履约和退款处理场景。",
    source: "order-center.openapi.yaml",
    sourceType: "repository",
    status: "online",
    version: "v1.0.4",
    endpoint: "https://mcp.example.com/sse/order-center",
    updatedAt: "2026-05-12 11:32",
    createdAt: "2026-05-01 10:26",
    lastCheck: "05-13 13:58",
    baseUrl: "https://orders.example.com/api",
    auth: "Bearer Token",
    namingStrategy: "operationId 优先",
    transport: "Streamable HTTP",
    schemaValidation: "通过",
    warnings: [],
    tools: [
      {
        name: "getOrder",
        method: "GET",
        path: "/orders/{orderId}",
        description: "读取订单详情。",
        enabled: true,
      },
      {
        name: "createRefund",
        method: "POST",
        path: "/orders/{orderId}/refunds",
        description: "创建退款申请。",
        enabled: true,
      },
      {
        name: "updateFulfillment",
        method: "PUT",
        path: "/orders/{orderId}/fulfillment",
        description: "更新订单履约状态。",
        enabled: true,
      },
    ],
  },
]

export function getMcpService(id: string | undefined) {
  return mcpServices.find((service) => service.id === id)
}
