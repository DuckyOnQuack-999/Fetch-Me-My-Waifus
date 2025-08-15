"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Code,
  Lightbulb,
  Shield,
  Zap,
  Eye,
  Heart,
  Link,
  BookOpen,
  Rocket,
  Save,
  RotateCcw,
} from "lucide-react"
import type { DuckyCoderConfig } from "@/types/duckycoder"

interface DuckyCoderConfigProps {
  config: DuckyCoderConfig
  onConfigChange: (config: DuckyCoderConfig) => void
}

export function DuckyCoderConfigPanel({ config, onConfigChange }: DuckyCoderConfigProps) {
  const [localConfig, setLocalConfig] = useState<DuckyCoderConfig>(config)

  const updateConfig = (updates: Partial<DuckyCoderConfig>) => {
    const newConfig = { ...localConfig, ...updates }
    setLocalConfig(newConfig)
    onConfigChange(newConfig)
  }

  const updatePhases = (phase: keyof DuckyCoderConfig["phases"], enabled: boolean) => {
    updateConfig({
      phases: {
        ...localConfig.phases,
        [phase]: enabled,
      },
    })
  }

  const updateEnhancement = (enhancement: keyof DuckyCoderConfig["enhancement"], enabled: boolean) => {
    updateConfig({
      enhancement: {
        ...localConfig.enhancement,
        [enhancement]: enabled,
      },
    })
  }

  const updateThreshold = (threshold: keyof DuckyCoderConfig["thresholds"], value: number) => {
    updateConfig({
      thresholds: {
        ...localConfig.thresholds,
        [threshold]: value,
      },
    })
  }

  const resetToDefaults = () => {
    const defaultConfig: DuckyCoderConfig = {
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
    }
    setLocalConfig(defaultConfig)
    onConfigChange(defaultConfig)
  }

  const phaseConfigs = [
    {
      key: "structural" as const,
      name: "Structural Analysis",
      description: "Syntax, architecture, and complexity analysis",
      icon: Code,
      color: "text-blue-500",
    },
    {
      key: "semantic" as const,
      name: "Semantic Analysis",
      description: "Logic flow and intent recognition",
      icon: Lightbulb,
      color: "text-yellow-500",
    },
    {
      key: "security" as const,
      name: "Security Analysis",
      description: "Vulnerability scanning and threat detection",
      icon: Shield,
      color: "text-red-500",
    },
    {
      key: "performance" as const,
      name: "Performance Analysis",
      description: "Runtime profiling and optimization",
      icon: Zap,
      color: "text-green-500",
    },
    {
      key: "uiux" as const,
      name: "UI/UX Analysis",
      description: "Accessibility and user experience",
      icon: Eye,
      color: "text-purple-500",
    },
    {
      key: "ethical" as const,
      name: "Ethical Analysis",
      description: "Bias detection and fairness validation",
      icon: Heart,
      color: "text-pink-500",
    },
    {
      key: "integration" as const,
      name: "Integration Analysis",
      description: "API contracts and compatibility",
      icon: Link,
      color: "text-indigo-500",
    },
    {
      key: "documentation" as const,
      name: "Documentation Analysis",
      description: "Auto-documentation and knowledge graphs",
      icon: BookOpen,
      color: "text-teal-500",
    },
    {
      key: "deployment" as const,
      name: "Deployment Analysis",
      description: "CI/CD optimization and monitoring",
      icon: Rocket,
      color: "text-orange-500",
    },
  ]

  const enhancementConfigs = [
    {
      key: "coreFixes" as const,
      name: "Core Fixes",
      description: "Syntax correction and basic bug fixes",
    },
    {
      key: "structuralImprovements" as const,
      name: "Structural Improvements",
      description: "Design patterns and architectural refactoring",
    },
    {
      key: "semanticEnhancements" as const,
      name: "Semantic Enhancements",
      description: "Algorithm optimization and advanced improvements",
    },
  ]

  const enabledPhases = Object.values(localConfig.phases).filter(Boolean).length
  const enabledEnhancements = Object.values(localConfig.enhancement).filter(Boolean).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-primary" />
          <div>
            <h2 className="text-2xl font-bold">Analysis Configuration</h2>
            <p className="text-muted-foreground">Customize your DuckyCoder v7 analysis</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Config
          </Button>
        </div>
      </div>

      {/* Analysis Phases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Analysis Phases
            <Badge variant="secondary">{enabledPhases}/9 enabled</Badge>
          </CardTitle>
          <CardDescription>Select which analysis phases to run during code examination</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {phaseConfigs.map((phase) => {
              const Icon = phase.icon
              const isEnabled = localConfig.phases[phase.key]

              return (
                <div
                  key={phase.key}
                  className={`p-4 rounded-lg border transition-all ${
                    isEnabled ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className={`w-5 h-5 ${phase.color}`} />
                    <Switch checked={isEnabled} onCheckedChange={(checked) => updatePhases(phase.key, checked)} />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{phase.name}</h4>
                  <p className="text-xs text-muted-foreground">{phase.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enhancement Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Code Enhancement
            <Badge variant="secondary">{enabledEnhancements}/3 enabled</Badge>
          </CardTitle>
          <CardDescription>Configure automatic code improvements and fixes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enhancementConfigs.map((enhancement) => (
              <div key={enhancement.key} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <Label className="text-sm font-medium">{enhancement.name}</Label>
                  <p className="text-xs text-muted-foreground mt-1">{enhancement.description}</p>
                </div>
                <Switch
                  checked={localConfig.enhancement[enhancement.key]}
                  onCheckedChange={(checked) => updateEnhancement(enhancement.key, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Thresholds</CardTitle>
          <CardDescription>Configure sensitivity levels for different analysis types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Complexity Threshold</Label>
                <Badge variant="outline">{localConfig.thresholds.complexity}</Badge>
              </div>
              <Slider
                value={[localConfig.thresholds.complexity]}
                onValueChange={([value]) => updateThreshold("complexity", value)}
                min={5}
                max={25}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Maximum cyclomatic complexity before flagging as issue
              </p>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Security Threshold</Label>
                <Badge variant="outline">{localConfig.thresholds.security}</Badge>
              </div>
              <Slider
                value={[localConfig.thresholds.security]}
                onValueChange={([value]) => updateThreshold("security", value)}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum CVSS score to report security vulnerabilities
              </p>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Performance Threshold</Label>
                <Badge variant="outline">{localConfig.thresholds.performance}%</Badge>
              </div>
              <Slider
                value={[localConfig.thresholds.performance]}
                onValueChange={([value]) => updateThreshold("performance", value)}
                min={50}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum performance score before flagging optimization opportunities
              </p>
            </div>

            <Separator />

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Accessibility Threshold</Label>
                <Badge variant="outline">{localConfig.thresholds.accessibility}%</Badge>
              </div>
              <Slider
                value={[localConfig.thresholds.accessibility]}
                onValueChange={([value]) => updateThreshold("accessibility", value)}
                min={70}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum accessibility compliance score (WCAG 2.1)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Output & Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Output & Integration</CardTitle>
          <CardDescription>Configure report formats and external integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Output Formats</Label>
              <div className="flex flex-wrap gap-2">
                {localConfig.outputFormats.map((format) => (
                  <Badge key={format} variant="secondary" className="text-xs">
                    {format.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-sm font-medium mb-2 block">Integrations</Label>
              <div className="flex flex-wrap gap-2">
                {localConfig.integrations.map((integration) => (
                  <Badge key={integration} variant="outline" className="text-xs">
                    {integration}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
