import {
  BookOpenTextIcon,
  BookTextIcon,
  ChartNoAxesColumnIncreasingIcon,
  KeyRoundIcon,
  PlugZapIcon,
} from "lucide-react"

type ConsoleChildPage = {
  path: string
  title: string
}

type ConsolePage = {
  path: string
  title: string
  icon: React.ReactNode
  children?: ConsoleChildPage[]
}

export const consolePages: ConsolePage[] = [
  {
    path: "/access-guide",
    title: "接入指南",
    icon: <BookOpenTextIcon />,
  },
  {
    path: "/knowledge-base",
    title: "知识库",
    icon: <BookTextIcon />,
    children: [
      {
        path: "/knowledge-base/1",
        title: "知识库 1",
      },
      {
        path: "/knowledge-base/2",
        title: "知识库 2",
      },
      {
        path: "/knowledge-base/3",
        title: "知识库 3",
      },
    ],
  },
  {
    path: "/api-keys",
    title: "密钥管理",
    icon: <KeyRoundIcon />,
  },
  {
    path: "/developer-access",
    title: "快速集成",
    icon: <PlugZapIcon />,
  },
  {
    path: "/usage-monitoring",
    title: "用量监控",
    icon: <ChartNoAxesColumnIncreasingIcon />,
  },
] as const

export const defaultConsolePage = consolePages[0].path

export const defaultKnowledgeBasePage =
  consolePages.find((page) => page.path === "/knowledge-base")?.children?.[0]
    ?.path ?? defaultConsolePage

export function getConsolePage(pathname: string) {
  for (const page of consolePages) {
    if (page.path === pathname) {
      return {
        page,
        parent: undefined,
      }
    }

    const child = page.children?.find((item) => item.path === pathname)
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
