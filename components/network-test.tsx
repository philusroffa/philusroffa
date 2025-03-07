"use client"

import { useEffect, useState } from "react"
import type { NetworkTestResults } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { Wifi, Server, Download, Upload, Loader2 } from "lucide-react"

interface NetworkTestProps {
  onTestComplete: (results: NetworkTestResults) => void
  initialLoadTime: number
}

export default function NetworkTest({ onTestComplete, initialLoadTime }: NetworkTestProps) {
  const [currentTest, setCurrentTest] = useState<string>("ping")
  const [progress, setProgress] = useState<number>(0)
  const [testStatus, setTestStatus] = useState<string>("Testing connection...")

  useEffect(() => {
    const runTests = async () => {
      // Initialize results with page load time
      const results: NetworkTestResults = {
        pageLoadTime: initialLoadTime,
        pingLatency: 0,
        downloadSpeed: 0,
        uploadSpeed: 0,
        networkType: "",
        connectionType: "",
        overallScore: 0,
      }

      // Get connection information if available
      if (navigator.connection) {
        const conn = navigator.connection as any
        results.networkType = conn.effectiveType || "unknown"
        results.connectionType = conn.type || "unknown"
      }

      // Test 1: Ping Test
      setCurrentTest("ping")
      setTestStatus("Measuring response time...")
      setProgress(10)

      const pingStart = performance.now()
      try {
        // Make a small request to measure latency
        await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
          cache: "no-store",
          mode: "no-cors",
        })
        const pingEnd = performance.now()
        results.pingLatency = pingEnd - pingStart
      } catch (error) {
        results.pingLatency = 999 // High value indicates error
      }

      setProgress(30)

      // Test 2: Download Speed Test
      setCurrentTest("download")
      setTestStatus("Testing download speed...")

      // Simple download test - download a small file and measure time
      const downloadStart = performance.now()
      try {
        // Using a public test file (1MB)
        const response = await fetch("https://speed.cloudflare.com/__down?bytes=1000000", {
          cache: "no-store",
        })
        await response.blob()
        const downloadEnd = performance.now()
        const durationSeconds = (downloadEnd - downloadStart) / 1000
        // Calculate speed in Mbps (1MB = 8Mb)
        results.downloadSpeed = 8 / durationSeconds
      } catch (error) {
        results.downloadSpeed = 0.1 // Low value indicates error
      }

      setProgress(60)

      // Test 3: Upload Speed Test (simulated)
      setCurrentTest("upload")
      setTestStatus("Testing upload speed...")

      // Create a 500KB test payload
      const testData = new Blob([new ArrayBuffer(500000)])

      const uploadStart = performance.now()
      try {
        // Send the data to a test endpoint
        await fetch("https://httpbin.org/post", {
          method: "POST",
          body: testData,
          cache: "no-store",
        })
        const uploadEnd = performance.now()
        const durationSeconds = (uploadEnd - uploadStart) / 1000
        // Calculate speed in Mbps (500KB = 4Mb)
        results.uploadSpeed = 4 / durationSeconds
      } catch (error) {
        results.uploadSpeed = 0.1 // Low value indicates error
      }

      setProgress(90)
      setTestStatus("Analyzing results...")

      // Calculate overall score (0-100)
      // This is a simplified scoring algorithm
      const pingScore = Math.max(0, 100 - results.pingLatency / 10)
      const downloadScore = Math.min(100, results.downloadSpeed * 10)
      const uploadScore = Math.min(100, results.uploadSpeed * 20)

      results.overallScore = Math.round((pingScore + downloadScore + uploadScore) / 3)

      // Finalize test
      setProgress(100)
      setTestStatus("Test completed!")

      // Wait a moment before showing results
      setTimeout(() => {
        onTestComplete(results)
      }, 1000)
    }

    runTests()
  }, [onTestComplete, initialLoadTime])

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Running Network Tests</h2>
        <p className="text-muted-foreground">{testStatus}</p>
      </div>

      <Progress value={progress} className="h-2 mb-6" />

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-md flex items-center ${currentTest === "ping" ? "bg-primary/10" : "bg-muted"}`}>
          <Server className={`mr-2 h-5 w-5 ${currentTest === "ping" ? "text-primary animate-pulse" : ""}`} />
          <span>Ping Test</span>
        </div>

        <div
          className={`p-4 rounded-md flex items-center ${currentTest === "download" ? "bg-primary/10" : "bg-muted"}`}
        >
          <Download className={`mr-2 h-5 w-5 ${currentTest === "download" ? "text-primary animate-pulse" : ""}`} />
          <span>Download Test</span>
        </div>

        <div className={`p-4 rounded-md flex items-center ${currentTest === "upload" ? "bg-primary/10" : "bg-muted"}`}>
          <Upload className={`mr-2 h-5 w-5 ${currentTest === "upload" ? "text-primary animate-pulse" : ""}`} />
          <span>Upload Test</span>
        </div>

        <div
          className={`p-4 rounded-md flex items-center ${currentTest === "analyzing" ? "bg-primary/10" : "bg-muted"}`}
        >
          <Wifi className={`mr-2 h-5 w-5 ${currentTest === "analyzing" ? "text-primary animate-pulse" : ""}`} />
          <span>Network Analysis</span>
        </div>
      </div>

      {progress < 100 && (
        <div className="flex justify-center mt-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}
    </div>
  )
}

