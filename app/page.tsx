"use client"

import { useEffect, useState } from "react"
import NetworkTest from "@/components/network-test"
import ResultsDisplay from "@/components/results-display"
import type { NetworkTestResults } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [results, setResults] = useState<NetworkTestResults | null>(null)
  const [pageLoadTime, setPageLoadTime] = useState<number | null>(null)

  // Measure page load time
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Wait for the page to fully load
      window.addEventListener("load", () => {
        // Use performance API to get navigation timing
        if (window.performance) {
          const perfData = window.performance.timing
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
          setPageLoadTime(pageLoadTime)
          setIsLoading(false)
        } else {
          // Fallback if Performance API is not available
          setIsLoading(false)
        }
      })

      // If the page is already loaded
      if (document.readyState === "complete") {
        if (window.performance) {
          const perfData = window.performance.timing
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
          setPageLoadTime(pageLoadTime)
        }
        setIsLoading(false)
      }
    }
  }, [])

  const handleTestComplete = (results: NetworkTestResults) => {
    setResults(results)
    setTestCompleted(true)
  }

  const startTest = () => {
    setTestStarted(true)
  }

  const restartTest = () => {
    setTestStarted(false)
    setTestCompleted(false)
    setResults(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Network Strength Test</h1>
          <p className="text-muted-foreground">Test your mobile network strength and performance</p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Initializing test environment...</p>
          </div>
        ) : !testStarted ? (
          <div className="flex flex-col items-center justify-center p-8 bg-card rounded-lg shadow-sm">
            <p className="mb-6 text-center">
              This test will measure your network connection quality including load time, latency, and estimated speeds.
            </p>
            <button
              onClick={startTest}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Start Network Test
            </button>
            {pageLoadTime && (
              <p className="mt-4 text-sm text-muted-foreground">
                Initial page load time: {(pageLoadTime / 1000).toFixed(2)}s
              </p>
            )}
          </div>
        ) : !testCompleted ? (
          <NetworkTest onTestComplete={handleTestComplete} initialLoadTime={pageLoadTime || 0} />
        ) : (
          <ResultsDisplay results={results} onRestart={restartTest} />
        )}
      </div>
    </main>
  )
}

