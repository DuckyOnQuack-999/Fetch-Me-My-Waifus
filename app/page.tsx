import PerformanceMonitor from "./PerformanceMonitor"

// Main page component
const Page = () => {
  return (
    <div>
      {/* Header section */}
      <header>
        <h1>Application Dashboard</h1>
      </header>

      {/* Main content section */}
      <main>
        {/* Performance Monitor Component */}
        <PerformanceMonitor />

        {/* Other components */}
        <div>
          <h2>Other Metrics</h2>
          {/* Additional metrics components */}
        </div>
      </main>

      {/* Footer section */}
      <footer>
        <p>© 2023 My Application</p>
      </footer>
    </div>
  )
}

export default Page
