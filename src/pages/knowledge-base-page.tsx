import { Navigate, useParams } from "react-router-dom"

import { defaultKnowledgeBasePage, consolePages } from "@/lib/console-pages"
import { ConsolePageShell } from "@/pages/console-page-shell"

export default function KnowledgeBasePage() {
  const { id } = useParams()
  const knowledgeBasePage = consolePages
    .find((page) => page.path === "/knowledge-base")
    ?.children?.find((child) => child.path === `/knowledge-base/${id}`)

  if (!knowledgeBasePage) {
    return <Navigate replace to={defaultKnowledgeBasePage} />
  }

  return (
    <ConsolePageShell
      title={knowledgeBasePage.title}
      description={`这里用于放 ${knowledgeBasePage.title} 的内容占位。`}
    />
  )
}
