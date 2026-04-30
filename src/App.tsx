import { Navigate, Route, Routes } from "react-router-dom"

import Console from "@/console"
import {
  defaultConsolePage,
  defaultKnowledgeBasePage,
} from "@/lib/console-pages"
import AccessGuidePage from "@/pages/access-guide-page"
import ApiKeysPage from "@/pages/api-keys-page"
import DeveloperAccessPage from "@/pages/developer-access-page"
import KnowledgeBasePage from "@/pages/knowledge-base-page"
import UsageMonitoringPage from "@/pages/usage-monitoring-page"

export function App() {
  return (
    <Routes>
      <Route element={<Console />} path="/">
        <Route element={<Navigate replace to={defaultConsolePage} />} index />
        <Route element={<AccessGuidePage />} path="access-guide" />
        <Route
          element={<Navigate replace to={defaultKnowledgeBasePage} />}
          path="knowledge-base"
        />
        <Route element={<KnowledgeBasePage />} path="knowledge-base/:id" />
        <Route element={<ApiKeysPage />} path="api-keys" />
        <Route
          element={<DeveloperAccessPage />}
          path="developer-access"
        />
        <Route element={<Navigate replace to="/developer-access" />} path="developer-access/:section" />
        <Route element={<UsageMonitoringPage />} path="usage-monitoring" />
      </Route>
      <Route element={<Navigate replace to={defaultConsolePage} />} path="*" />
    </Routes>
  )
}

export default App
