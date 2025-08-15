"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DuckyCoderDashboard } from "@/components/duckycoder-dashboard"
import { DuckyCoderConfigPanel } from "@/components/duckycoder-config"
import type { DuckyCoderConfig } from "@/types/duckycoder"

export default function DuckyCoderPage() {
  const [config, setConfig] = useState<DuckyCoderConfig>({
    phases: {
      structural: true,
      semantic: true,
      security: true,
      performance: true,
      uiux: true,
      ethical: true,
      integration: false,
      documentation: false,
      deployment: false,
    },
    enhancement: {
      coreFixes: true,
      structuralImprovements: true,
      semanticEnhancements: false,
    },
    thresholds: {
      complexity: 10,
      security: 7,
      performance: 80,
      accessibility: 90,
    },
    outputFormats: ["json", "html", "pdf"],
    integrations: ["github", "slack", "jira"],
  })

  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="border-b">
          <div className="container mx-auto">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="config">Configuration</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="dashboard" className="mt-0">
          <DuckyCoderDashboard />
        </TabsContent>

        <TabsContent value="config" className="mt-0">
          <div className="container mx-auto p-6">
            <DuckyCoderConfigPanel config={config} onConfigChange={setConfig} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
