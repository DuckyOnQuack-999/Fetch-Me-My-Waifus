"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { makeStyles, tokens, shorthands, Text } from "@fluentui/react-components"
import { FluentSidebar, FluentSidebarInset, FluentSidebarProvider } from "@/components/fluent/fluent-sidebar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/fluent/fluent-tabs"
import { HomeDashboard } from "@/components/home-dashboard"
import { ActivityFeed } from "@/components/activity-feed"
import { SimpleDownloadTab } from "@/components/simple-download-tab"
import { authService } from "@/lib/auth"
import { ChevronRight } from "lucide-react"

const useStyles = makeStyles({
  header: {
    display: "flex",
    alignItems: "center",
    height: "64px",
    ...shorthands.gap(tokens.spacingHorizontalM),
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: tokens.colorNeutralStroke2,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding("0", tokens.spacingHorizontalL),
    position: "sticky",
    top: 0,
    zIndex: 30,
    backdropFilter: "blur(16px)",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    ...shorthands.gap(tokens.spacingHorizontalS),
    color: tokens.colorNeutralForeground3,
  },
  content: {
    ...shorthands.padding(tokens.spacingVerticalL),
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    ...shorthands.gap(tokens.spacingHorizontalL),
    "@media (min-width: 1280px)": {
      gridTemplateColumns: "2fr 1fr",
    },
  },
})

function PageContent() {
  const styles = useStyles()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const activeTab = searchParams.get("tab") || "dashboard"

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <FluentSidebar />
      <FluentSidebarInset>
        {/* Header */}
        <header className={styles.header}>
          <nav className={styles.breadcrumb}>
            <Text size={300}>Waifu Hub</Text>
            <ChevronRight className="w-4 h-4" />
            <Text size={300} weight="semibold" style={{ color: tokens.colorNeutralForeground1 }}>
              {activeTab === "dashboard" ? "Dashboard" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Text>
          </nav>
        </header>

        {/* Main Content */}
        <div className={styles.content}>
          <Tabs value={activeTab} onValueChange={(value) => router.push(`/?tab=${value}`)}>
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="download">Download</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className={styles.grid}>
                <HomeDashboard />
                <ActivityFeed />
              </div>
            </TabsContent>

            <TabsContent value="download">
              <SimpleDownloadTab />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityFeed />
            </TabsContent>
          </Tabs>
        </div>
      </FluentSidebarInset>
    </>
  )
}

export default function Home() {
  return (
    <FluentSidebarProvider>
      <PageContent />
    </FluentSidebarProvider>
  )
}
