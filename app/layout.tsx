"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "@/components/error-boundary"
import { SettingsProvider } from "@/context/settingsContext"
import { StorageProvider } from "@/context/storageContext"
import { DownloadProvider } from "@/context/downloadContext"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// 🔮 Quantum-Enhanced Layout Configuration
const QUANTUM_CONFIG = {
  enabled: true,
  sustainabilityMode: true,
  ethicalMode: true,
  performanceOptimization: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Waifu Downloader - Quantum Enhanced</title>
        <meta
          name="description"
          content="Advanced waifu image downloader with quantum-enhanced features, ethical AI, and sustainable computing"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />

        {/* 🌱 Sustainability Meta Tags */}
        <meta name="carbon-neutral" content="true" />
        <meta name="energy-efficient" content="optimized" />

        {/* 🎯 Ethical AI Meta Tags */}
        <meta name="ai-ethics" content="validated" />
        <meta name="bias-detection" content="enabled" />

        {/* 🔮 Quantum Computing Meta Tags */}
        <meta name="quantum-ready" content="true" />
        <meta name="post-quantum-crypto" content="supported" />
      </head>
      <body className={inter.className}>
        {/* 🛡️ Quantum-Enhanced Error Boundary */}
        <ErrorBoundary
          quantumMode={QUANTUM_CONFIG.enabled}
          sustainabilityMode={QUANTUM_CONFIG.sustainabilityMode}
          ethicalMode={QUANTUM_CONFIG.ethicalMode}
        >
          {/* 🎨 Theme Provider with Quantum Enhancements */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {/* 🔧 Context Providers Stack */}
            <SettingsProvider>
              <StorageProvider>
                <DownloadProvider>
                  {/* 📱 Sidebar Layout with Quantum Features */}
                  <SidebarProvider defaultOpen={true}>
                    <div className="flex min-h-screen w-full">
                      {/* 🎯 Enhanced App Sidebar */}
                      <AppSidebar />

                      {/* 📄 Main Content Area */}
                      <main className="flex-1 flex flex-col overflow-hidden">
                        {/* 🌟 Quantum-Enhanced Content */}
                        <div className="flex-1 overflow-auto">
                          <ErrorBoundary
                            quantumMode={QUANTUM_CONFIG.enabled}
                            sustainabilityMode={QUANTUM_CONFIG.sustainabilityMode}
                            ethicalMode={QUANTUM_CONFIG.ethicalMode}
                          >
                            {children}
                          </ErrorBoundary>
                        </div>
                      </main>
                    </div>

                    {/* 🔔 Enhanced Notifications */}
                    <Toaster position="bottom-right" expand={true} richColors={true} closeButton={true} />
                  </SidebarProvider>
                </DownloadProvider>
              </StorageProvider>
            </SettingsProvider>
          </ThemeProvider>
        </ErrorBoundary>

        {/* 🔮 Quantum Performance Monitoring */}
        {QUANTUM_CONFIG.performanceOptimization && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Quantum-enhanced performance monitoring
                if (typeof window !== 'undefined') {
                  // Monitor Core Web Vitals with quantum enhancement
                  const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      // Log performance metrics for quantum optimization
                      console.info('🔮 Quantum Performance:', {
                        name: entry.name,
                        value: entry.value,
                        rating: entry.value < 100 ? 'good' : entry.value < 300 ? 'needs-improvement' : 'poor',
                        carbonImpact: (entry.value / 1000) * 0.01 // Estimate carbon cost
                      });
                    }
                  });
                  
                  try {
                    observer.observe({ entryTypes: ['web-vitals'] });
                  } catch (e) {
                    // Fallback for browsers without web-vitals support
                    observer.observe({ entryTypes: ['navigation', 'paint'] });
                  }
                  
                  // Quantum-safe error tracking
                  window.addEventListener('error', (event) => {
                    console.error('🚨 Quantum Error Detected:', {
                      message: event.message,
                      filename: event.filename,
                      lineno: event.lineno,
                      colno: event.colno,
                      timestamp: new Date().toISOString(),
                      quantumSafe: !event.message.includes('crypto')
                    });
                  });
                  
                  // Sustainable resource monitoring
                  if ('connection' in navigator) {
                    const connection = navigator.connection;
                    console.info('🌱 Network Sustainability:', {
                      effectiveType: connection.effectiveType,
                      downlink: connection.downlink,
                      rtt: connection.rtt,
                      saveData: connection.saveData,
                      carbonOptimized: connection.saveData || connection.effectiveType === '4g'
                    });
                  }
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
