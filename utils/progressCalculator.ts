export interface ProgressData {
  current: number
  total: number
  percentage: number
  speed?: number
  eta?: number
}

export class ProgressCalculator {
  private startTime: number
  private lastUpdate: number
  private downloadedBytes: number[]
  private timeStamps: number[]

  constructor() {
    this.startTime = Date.now()
    this.lastUpdate = this.startTime
    this.downloadedBytes = []
    this.timeStamps = []
  }

  update(current: number, total: number): ProgressData {
    const now = Date.now()
    const percentage = Math.round((current / total) * 100)

    // Store data for speed calculation
    this.downloadedBytes.push(current)
    this.timeStamps.push(now)

    // Keep only last 10 data points for accurate speed calculation
    if (this.downloadedBytes.length > 10) {
      this.downloadedBytes.shift()
      this.timeStamps.shift()
    }

    const speed = this.calculateSpeed()
    const eta = this.calculateETA(current, total, speed)

    this.lastUpdate = now

    return {
      current,
      total,
      percentage,
      speed,
      eta,
    }
  }

  private calculateSpeed(): number {
    if (this.downloadedBytes.length < 2) return 0

    const firstIndex = 0
    const lastIndex = this.downloadedBytes.length - 1

    const bytesDownloaded = this.downloadedBytes[lastIndex] - this.downloadedBytes[firstIndex]
    const timeElapsed = (this.timeStamps[lastIndex] - this.timeStamps[firstIndex]) / 1000

    return timeElapsed > 0 ? bytesDownloaded / timeElapsed : 0
  }

  private calculateETA(current: number, total: number, speed: number): number {
    if (speed <= 0) return 0

    const remaining = total - current
    return Math.round(remaining / speed)
  }

  reset(): void {
    this.startTime = Date.now()
    this.lastUpdate = this.startTime
    this.downloadedBytes = []
    this.timeStamps = []
  }

  formatSpeed(bytesPerSecond: number): string {
    if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(0)} B/s`
    if (bytesPerSecond < 1024 * 1024) return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`
    return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`
  }

  formatETA(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }
}
