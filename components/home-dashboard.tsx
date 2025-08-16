import type React from "react"
import QuantumPerformanceMonitor from "./QuantumPerformanceMonitor"
import OtherComponent from "./OtherComponent"

const HomeDashboard: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Welcome to the Home Dashboard</h1>
      <QuantumPerformanceMonitor />
      <OtherComponent />
      {/* Additional components can be added here */}
    </div>
  )
}

export default HomeDashboard
