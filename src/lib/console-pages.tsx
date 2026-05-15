import {
  ActivityIcon,
  BarChart3Icon,
  ServerIcon,
} from "lucide-react"

type ConsoleChildPage = {
  path: string
  title: string
  match?: (pathname: string) => boolean
  hidden?: boolean
}

type ConsolePage = {
  path: string
  title: string
  icon: React.ReactNode
  children?: ConsoleChildPage[]
}

export const consolePages: ConsolePage[] = [
  {
    path: "/analytics",
    title: "统计分析",
    icon: <BarChart3Icon />,
  },
  {
    path: "/mcp-services",
    title: "服务管理",
    icon: <ServerIcon />,
    children: [
      {
        path: "/mcp-services",
        title: "服务详情",
        match: (pathname) => pathname.startsWith("/mcp-services/"),
        hidden: true,
      },
    ],
  },
  {
    path: "/logs",
    title: "日志记录",
    icon: <ActivityIcon />,
  },
] as const

export const defaultConsolePage = consolePages[0].path

export function getConsolePage(pathname: string) {
  for (const page of consolePages) {
    if (page.path === pathname) {
      return {
        page,
        parent: undefined,
      }
    }

    const child = page.children?.find((item) => (
      item.match ? item.match(pathname) : item.path === pathname
    ))
    if (child) {
      return {
        page: child,
        parent: page,
      }
    }
  }

  return {
    page: consolePages[0],
    parent: undefined,
  }
}
