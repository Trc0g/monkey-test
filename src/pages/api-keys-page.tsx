import {
  BanIcon,
  CheckCheckIcon,
  CopyIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"

const apiKeys = [
  {
    id: "bk_live_prod_a1b2",
    name: "生产环境密钥",
    maskedKey: "bz-live-****-****-a1b2",
    value: "bz-live-prod-7h2k-9qxm-a1b2",
    createdAt: "2026-03-10",
    lastCalledAt: "2026-03-25 18:42",
  },
  {
    id: "bk_staging_e5f6",
    name: "预发环境密钥",
    maskedKey: "bz-stag-****-****-e5f6",
    value: "bz-staging-4mnp-8rts-e5f6",
    createdAt: "2026-03-18",
    lastCalledAt: "2026-03-25 16:08",
  },
  {
    id: "bk_dataops_x9y0",
    name: "数据分析密钥",
    maskedKey: "bz-data-****-****-x9y0",
    value: "bz-dataops-3kfv-6lqw-x9y0",
    createdAt: "2026-03-21",
    lastCalledAt: "2026-03-24 09:15",
  },
]

export default function ApiKeysPage() {
  return (
    <div className="flex flex-1 flex-col p-4 pt-0">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold tracking-tight">密钥管理</h1>
        <Button size="sm">
          <PlusIcon />
          <span>添加密钥</span>
        </Button>
      </div>

      <div className="mt-4">
        <ItemGroup>
          {apiKeys.map((key) => (
            <Item key={key.id} variant="outline">
              <ItemContent>
                <ItemHeader>
                  <ItemTitle>{key.name}</ItemTitle>
                </ItemHeader>
                <ItemDescription>
                  创建时间：{key.createdAt}，最后调用时间：{key.lastCalledAt}
                </ItemDescription>
                <ItemFooter className="mt-1 flex-col items-start gap-3 text-xs text-muted-foreground">
                  <div className="flex w-full items-center gap-3 rounded-md border border-border bg-muted/30 px-3 py-2">
                    <span className="min-w-0 flex-1 truncate font-mono text-sm text-muted-foreground">
                      {key.maskedKey}
                    </span>
                    <Button
                      onClick={() => navigator.clipboard.writeText(key.value)}
                      size="sm"
                      variant="outline"
                    >
                      <CopyIcon />
                      <span>复制</span>
                    </Button>
                  </div>
                </ItemFooter>
              </ItemContent>
              <ItemActions className="ml-auto self-start">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button aria-label="更多操作" size="icon-sm" variant="ghost" />}
                  >
                    <MoreHorizontalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem>
                      <CheckCheckIcon />
                      <span>启用</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BanIcon />
                      <span>禁用</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PencilIcon />
                      <span>修改名称</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RotateCcwIcon />
                      <span>重置</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <Trash2Icon />
                      <span>删除</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </div>
    </div>
  )
}
