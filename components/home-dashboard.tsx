import type React from "react"
import ApiStatusIndicator from "./ApiStatusIndicator"
import QuantumPerformanceMonitor from "./QuantumPerformanceMonitor"
import DashboardGrid from "./DashboardGrid"

const HomeDashboard: React.FC = () => {
  return (
    <DashboardGrid>
      {/* Monitoring Panel */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
        <ApiStatusIndicator />
        <QuantumPerformanceMonitor />
      </div>
      {/* Other Dashboard Components */}\
      {/* /** rest of code here **/ */}
 {4}</DashboardGrid>
  );
};

export default HomeDashboard;\
