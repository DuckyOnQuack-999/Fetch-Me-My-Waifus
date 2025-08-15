"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Play,
  FileText,
  Shield,
  Zap,
  Eye,
  Heart,
  Link,
  BookOpen,
  Rocket,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Code,
  Lightbulb,
  Activity,
} from "lucide-react"
import { motion } from "framer-motion"
import type { AnalysisSession, DuckyCoderConfig, CodeFile } from "@/types/duckycoder"
import { duckyCoderEngine } from "@/services/duckycoder-engine"
import { toast } from "sonner"

export function DuckyCoderDashboard() {
  const [sessions, setSessions] = useState<AnalysisSession[]>([])
  const [currentSession, setCurrentSession] = useState<AnalysisSession | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedTab, setSelectedTab] = useState("overview")
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

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = () => {
    const allSessions = duckyCoderEngine.getAllSessions()
    setSessions(allSessions)
    if (allSessions.length > 0 && !currentSession) {
      setCurrentSession(allSessions[0])
    }
  }

  const startAnalysis = async () => {
    setIsAnalyzing(true)
    toast.info("Starting DuckyCoder v7 analysis...")

    try {
      // Mock files for demonstration - in real implementation, these would come from file upload
      const mockFiles: CodeFile[] = [
        {
          path: "components/waifu-downloader.tsx",
          content: `import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

function WaifuDownloader() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  
  const downloadImages = async () => {
    console.log('Starting download...')
    setLoading(true)
    
    try {
      const response = await fetch('/api/images')
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div>
      <Button onClick={downloadImages} disabled={loading}>
        {loading ? 'Downloading...' : 'Download Images'}
      </Button>
      <div>
        {images.map(image => (
          <img src={image.url || "/placeholder.svg"} key={image.id} />
        ))}
      </div>
    </div>
  )
}

export default WaifuDownloader`,
          language: "typescript",
          size: 1024,
          encoding: "utf-8",
          lastModified: new Date(),
        },
        {
          path: "utils/api.ts",
          content: `export const API_KEY = "sk-1234567890abcdef"
export const SECRET_TOKEN = "secret123"

export function fetchData(query: string) {
  const sql = "SELECT * FROM users WHERE name = '" + query + "'"
  return database.query(sql)
}

export function generateId() {
  return Math.random().toString(36)
}

export function processUserInput(input: string) {
  document.getElementById('output').innerHTML = input
  return input
}`,
          language: "typescript",
          size: 512,
          encoding: "utf-8",
          lastModified: new Date(),
        },
      ]

      const session = await duckyCoderEngine.analyzeProject(mockFiles, config)
      setSessions((prev) => [session, ...prev])
      setCurrentSession(session)
      toast.success("Analysis completed successfully!")
    } catch (error) {
      toast.error("Analysis failed: " + (error instanceof Error ? error.message : "Unknown error"))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const enhanceCode = async () => {
    if (!currentSession) return

    toast.info("Applying enhancements...")
    try {
      const enhancements = await duckyCoderEngine.enhanceCode(currentSession)
      toast.success(`Applied ${enhancements.size} enhancements`)
    } catch (error) {
      toast.error("Enhancement failed: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const getPhaseIcon = (phaseId: string) => {
    const icons = {
      structural: Code,
      semantic: Lightbulb,
      security: Shield,
      performance: Zap,
      uiux: Eye,
      ethical: Heart,
      integration: Link,
      documentation: BookOpen,
      deployment: Rocket,
    }
    return icons[phaseId as keyof typeof icons] || Activity
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "error":
        return "text-red-600 bg-red-50 border-red-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "info":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "running":
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const criticalIssues =
    currentSession?.results.filter((r) => r.severity === "critical" || r.severity === "error").length || 0
  const warnings = currentSession?.results.filter((r) => r.severity === "warning").length || 0
  const suggestions = currentSession?.results.filter((r) => r.severity === "info").length || 0
  const vulnerabilities = currentSession?.vulnerabilities.length || 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            DuckyCoder v7
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Ultimate AI-Powered Code Analysis & Enhancement Framework
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={startAnalysis}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Analysis
              </>
            )}
          </Button>
          {currentSession && (
            <Button onClick={enhanceCode} variant="outline">
              <Lightbulb className="w-4 h-4 mr-2" />
              Enhance Code
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats Overview */}
      {currentSession && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Critical Issues</p>
                  <p className="text-3xl font-bold text-red-700">{criticalIssues}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Warnings</p>
                  <p className="text-3xl font-bold text-yellow-700">{warnings}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Suggestions</p>
                  <p className="text-3xl font-bold text-blue-700">{suggestions}</p>
                </div>
                <Lightbulb className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Vulnerabilities</p>
                  <p className="text-3xl font-bold text-purple-700">{vulnerabilities}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Analysis Progress */}
      {currentSession && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Analysis Progress
              </CardTitle>
              <CardDescription>
                {currentSession.status === "completed"
                  ? "Analysis completed"
                  : currentSession.status === "analyzing"
                    ? "Analysis in progress"
                    : "Analysis ready to start"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(currentSession.progress)}%</span>
                </div>
                <Progress value={currentSession.progress} className="h-2" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {currentSession.phases.map((phase, index) => {
                    const Icon = getPhaseIcon(phase.id)
                    return (
                      <motion.div
                        key={phase.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                      >
                        <Icon className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{phase.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(phase.status)}
                            <span className="text-xs text-muted-foreground capitalize">{phase.status}</span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Detailed Results */}
      {currentSession && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>Detailed findings and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="issues">Issues</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="ethics">Ethics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Files Analyzed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {currentSession.files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded border">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium">{file.path}</span>
                              </div>
                              <Badge variant="secondary">{file.language}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Analysis Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Total Issues Found:</span>
                            <Badge variant="outline">{currentSession.results.length}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Security Vulnerabilities:</span>
                            <Badge variant="destructive">{currentSession.vulnerabilities.length}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Performance Metrics:</span>
                            <Badge variant="secondary">{currentSession.metrics.length}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Ethical Assessments:</span>
                            <Badge variant="outline">{currentSession.ethicalAssessment.length}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="issues" className="space-y-4">
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {currentSession.results.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 rounded-lg border ${getSeverityColor(result.severity)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {result.phase}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {result.category}
                                </Badge>
                                <Badge
                                  variant={
                                    result.severity === "critical" || result.severity === "error"
                                      ? "destructive"
                                      : result.severity === "warning"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {result.severity}
                                </Badge>
                              </div>
                              <h4 className="font-semibold text-sm mb-1">{result.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                              {result.suggestion && (
                                <div className="bg-background/50 p-2 rounded text-xs">
                                  <strong>Suggestion:</strong> {result.suggestion}
                                </div>
                              )}
                              {result.line && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Line {result.line} in {result.fileId}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1 ml-4">
                              <Badge variant="outline" className="text-xs">
                                Impact: {result.impact}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Effort: {result.effort}
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {Math.round(result.confidence * 100)}% confidence
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {currentSession.results.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No issues found! Your code looks great.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {currentSession.vulnerabilities.map((vuln, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-lg border border-red-200 bg-red-50/50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-red-500" />
                                <Badge variant="destructive" className="text-xs">
                                  {vuln.severity}
                                </Badge>
                                {vuln.cwe && (
                                  <Badge variant="outline" className="text-xs">
                                    {vuln.cwe}
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-semibold text-sm mb-1 text-red-700">{vuln.type}</h4>
                              <p className="text-sm text-red-600 mb-2">{vuln.description}</p>
                              <div className="bg-red-100 p-2 rounded text-xs text-red-700">
                                <strong>Remediation:</strong> {vuln.remediation}
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Line {vuln.location.line} in {vuln.location.file}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1 ml-4">
                              {vuln.cvss && (
                                <Badge variant="destructive" className="text-xs">
                                  CVSS: {vuln.cvss}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      {currentSession.vulnerabilities.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Shield className="w-12 h-12 mx-auto mb-4 opacity-50 text-green-500" />
                          <p>No security vulnerabilities detected!</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentSession.metrics.map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card
                          className={`${
                            metric.status === "critical"
                              ? "border-red-200 bg-red-50/50"
                              : metric.status === "warning"
                                ? "border-yellow-200 bg-yellow-50/50"
                                : "border-green-200 bg-green-50/50"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-sm">{metric.metric}</h4>
                              <Badge
                                variant={
                                  metric.status === "critical"
                                    ? "destructive"
                                    : metric.status === "warning"
                                      ? "default"
                                      : "secondary"
                                }
                                className="text-xs"
                              >
                                {metric.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl font-bold">{metric.value.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground">{metric.unit}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mb-2">
                              Threshold: {metric.threshold.toLocaleString()} {metric.unit}
                            </div>
                            {metric.suggestion && (
                              <div className="bg-background/50 p-2 rounded text-xs">
                                <strong>Suggestion:</strong> {metric.suggestion}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="ethics" className="space-y-4">
                  <div className="space-y-4">
                    {currentSession.ethicalAssessment.map((assessment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <Heart className="w-5 h-5 text-pink-500" />
                              {assessment.category}
                            </CardTitle>
                            <CardDescription>
                              Ethical assessment score: {assessment.score}/{assessment.maxScore}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">Fairness Score</span>
                                  <span className="text-sm text-muted-foreground">
                                    {Math.round(assessment.fairnessScore * 100)}%
                                  </span>
                                </div>
                                <Progress value={assessment.fairnessScore * 100} className="h-2" />
                              </div>

                              {assessment.biasDetected && (
                                <Alert>
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertDescription>
                                    Potential bias detected in the code. Please review the issues below.
                                  </AlertDescription>
                                </Alert>
                              )}

                              {assessment.issues.length > 0 && (
                                <div>
                                  <h5 className="font-semibold text-sm mb-2">Issues Found:</h5>
                                  <ul className="space-y-1">
                                    {assessment.issues.map((issue, issueIndex) => (
                                      <li key={issueIndex} className="text-sm text-red-600 flex items-center gap-2">
                                        <AlertTriangle className="w-3 h-3" />
                                        {issue}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {assessment.recommendations.length > 0 && (
                                <div>
                                  <h5 className="font-semibold text-sm mb-2">Recommendations:</h5>
                                  <ul className="space-y-1">
                                    {assessment.recommendations.map((rec, recIndex) => (
                                      <li key={recIndex} className="text-sm text-green-600 flex items-center gap-2">
                                        <Lightbulb className="w-3 h-3" />
                                        {rec}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                    {currentSession.ethicalAssessment.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Heart className="w-12 h-12 mx-auto mb-4 opacity-50 text-green-500" />
                        <p>No ethical concerns detected!</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Session History */}
      {sessions.length > 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>Previous analysis sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sessions.slice(1).map((session, index) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => setCurrentSession(session)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          session.status === "completed"
                            ? "bg-green-500"
                            : session.status === "failed"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium">{session.name}</p>
                        <p className="text-xs text-muted-foreground">{session.createdAt.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {session.files.length} files
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {session.results.length} issues
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* No Session State */}
      {!currentSession && !isAnalyzing && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Code className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-muted-foreground mb-6">
              Start your first DuckyCoder v7 analysis to discover insights, vulnerabilities, and optimization
              opportunities in your code.
            </p>
            <Button
              onClick={startAnalysis}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Analysis
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
