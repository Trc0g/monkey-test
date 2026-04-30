import { Link, useLocation } from "react-router-dom"
import { PlusIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarMenuAction,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function NavConsolePages({
  pages,
}: {
  pages: {
    name: string
    url: string
    icon: React.ReactNode
    children?: {
      name: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {pages.map((item) => {
          const defaultUrl = item.children?.[0]?.url ?? item.url

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                isActive={
                  location.pathname === item.url ||
                  item.children?.some(
                    (child) => child.url === location.pathname
                  )
                }
                onClick={() => {
                  if (isMobile) {
                    setOpenMobile(false)
                  }
                }}
                render={<Link to={defaultUrl} />}
              >
                {item.icon}
                <span>{item.name}</span>
              </SidebarMenuButton>
              {item.url === "/knowledge-base" ? (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <SidebarMenuAction
                        aria-label="创建知识库"
                        className="text-sidebar-foreground/50 opacity-100 peer-hover/menu-button:text-sidebar-foreground/50 hover:text-sidebar-accent-foreground"
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                        }}
                      />
                    }
                  >
                    <PlusIcon />
                  </TooltipTrigger>
                  <TooltipContent side="right">创建知识库</TooltipContent>
                </Tooltip>
              ) : null}
              {item.children?.length ? (
                <SidebarMenuSub>
                  {item.children.map((child) => (
                    <SidebarMenuSubItem key={child.name}>
                      <SidebarMenuSubButton
                        isActive={location.pathname === child.url}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false)
                          }
                        }}
                        render={<Link to={child.url} />}
                      >
                        <span>{child.name}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              ) : null}
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
