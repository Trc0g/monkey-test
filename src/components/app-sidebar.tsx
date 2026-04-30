import * as React from "react"

import { NavConsolePages } from "@/components/nav-console-pages"
import { consolePages } from "@/lib/console-pages"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  AppWindowIcon,
  HomeIcon,
  MessageSquareIcon,
  UsersRoundIcon,
} from "lucide-react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "长亭百智云",
      url: "https://baizhi.cloud/",
      icon: <HomeIcon />,
    },
    {
      title: "技术论坛",
      url: "https://bbs.baizhi.cloud/",
      icon: <MessageSquareIcon />,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<a href="https://baizhi.cloud/apps" />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <AppWindowIcon className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">应用名称</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  长亭百智云
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavConsolePages
          pages={consolePages.map((page) => ({
            name: page.title,
            url: page.path,
            icon: page.icon,
            children: page.children?.map((child) => ({
              name: child.title,
              url: child.path,
            })),
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <HoverCard>
                  <HoverCardTrigger
                    render={
                      <SidebarMenuButton
                        aria-label="技术交流群"
                        className="cursor-default"
                        size="sm"
                        tooltip="技术交流群"
                        type="button"
                      />
                    }
                  >
                    <UsersRoundIcon />
                    <span>技术交流群</span>
                  </HoverCardTrigger>
                  <HoverCardContent
                    align="start"
                    className="w-52"
                    side="top"
                    sideOffset={10}
                  >
                    <div className="flex flex-col gap-3">
                      <div className="overflow-hidden rounded-xl border bg-background shadow-xs">
                        <img
                          alt="技术交流群二维码"
                          className="size-full object-cover"
                          src="/tech-community-qr.png"
                        />
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        扫码加入技术交流群
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </SidebarMenuItem>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size="sm"
                    render={
                      <a
                        href={item.url}
                        rel="noreferrer noopener"
                        target="_blank"
                      />
                    }
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
