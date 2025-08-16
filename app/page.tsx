import ApiStatusIndicator from "./ApiStatusIndicator"
import QuantumPerformanceMonitor from "./QuantumPerformanceMonitor"

const Page = () => {
  return (
    <div>
      <h1>Main Page</h1>
      <ApiStatusIndicator />
      <QuantumPerformanceMonitor />
      {/* rest of code here */}
    </div>
  )
}

export default Page
