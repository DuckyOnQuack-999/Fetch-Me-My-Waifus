export interface AnalysisPhase {
  id: string
  name: string
  description: string
  status: "pending" | "running" | "completed" | "failed"
  progress: number
  startTime?: Date
  endTime?: Date
  results?: any
  errors?: string[]
  warnings?: string[]
}

export interface CodeFile {
  path: string
  content: string
  language: string
  size: number
  encoding: string
  lastModified: Date
}

export interface AnalysisResult {
  fileId: string
  phase: string
  severity: "info" | "warning" | "error" | "critical"
  category: string
  title: string
  description: string
  suggestion?: string
  line?: number
  column?: number
  confidence: number
  impact: "low" | "medium" | "high" | "critical"
  effort: "trivial" | "easy" | "moderate" | "hard" | "extreme"
}

export interface SecurityVulnerability {
  id: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  location: {
    file: string
    line: number
    column: number
  }
  cwe?: string
  cvss?: number
  remediation: string
  references: string[]
}

export interface PerformanceMetric {
  metric: string
  value: number
  unit: string
  threshold: number
  status: "good" | "warning" | "critical"
  suggestion?: string
}

export interface EthicalAssessment {
  category: string
  score: number
  maxScore: number
  issues: string[]
  recommendations: string[]
  biasDetected: boolean
  fairnessScore: number
}

export interface DuckyCoderConfig {
  phases: {
    structural: boolean
    semantic: boolean
    security: boolean
    performance: boolean
    uiux: boolean
    ethical: boolean
    integration: boolean
    documentation: boolean
    deployment: boolean
  }
  enhancement: {
    coreFixes: boolean
    structuralImprovements: boolean
    semanticEnhancements: boolean
  }
  thresholds: {
    complexity: number
    security: number
    performance: number
    accessibility: number
  }
  outputFormats: string[]
  integrations: string[]
}

export interface AnalysisSession {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  status: "initializing" | "analyzing" | "enhancing" | "completed" | "failed"
  config: DuckyCoderConfig
  files: CodeFile[]
  phases: AnalysisPhase[]
  results: AnalysisResult[]
  vulnerabilities: SecurityVulnerability[]
  metrics: PerformanceMetric[]
  ethicalAssessment: EthicalAssessment[]
  progress: number
  estimatedTimeRemaining: number
}
