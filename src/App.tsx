import { Navigate, Route, Routes } from "react-router-dom"

import Console from "@/console"
import { defaultConsolePage } from "@/lib/console-pages"
import AnalyticsPage from "@/pages/analytics-page"
import LogsPage from "@/pages/logs-page"
import McpServiceDetailPage from "@/pages/mcp-service-detail-page"
import McpServicesPage from "@/pages/mcp-services-page"

export function App() {
  return (
    <Routes>
      <Route element={<Console />} path="/">
        <Route element={<Navigate replace to={defaultConsolePage} />} index />
        <Route element={<AnalyticsPage />} path="analytics" />
        <Route element={<McpServicesPage />} path="mcp-services" />
        <Route element={<McpServiceDetailPage />} path="mcp-services/:id" />
        <Route element={<LogsPage />} path="logs" />
      </Route>
      <Route element={<Navigate replace to={defaultConsolePage} />} path="*" />
    </Routes>
  )
}

export default App
