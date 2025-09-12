import { HomeDashboard } from "@/components/home-dashboard"
import CyberpunkShowcase from "@/components/cyberpunk-showcase"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Show cyberpunk showcase first, then the main dashboard */}
      <div className="container mx-auto">
        <CyberpunkShowcase />
        <div className="mt-12">
          <HomeDashboard />
        </div>
      </div>
    </main>
  )
}
