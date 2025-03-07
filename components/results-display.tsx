"use client"

import type { NetworkTestResults } from "@/lib/types"
import { Wifi, Signal, SignalMedium, SignalLow, Download, Upload, Clock, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ResultsDisplayProps {
  results: NetworkTestResults | null
  onRestart: () => void
}

export default function ResultsDisplay({ results, onRestart }: ResultsDisplayProps) {
  if (!results) return null

  // Determine network strength category
  const getNetworkCategory = (score: number) => {
    if (score >= 80) return "Strong"
    if (score >= 50) return "Moderate"
    return "Weak"
  }

  const networkCategory = getNetworkCategory(results.overallScore)

  // Get recommendations based on network strength
  const getRecommendations = () => {
    if (networkCategory === "Strong") {
      return [
        "Your network connection is excellent",
        "Perfect for streaming, gaming, and video calls",
        "No changes needed - enjoy your fast connection!",
      ]
    } else if (networkCategory === "Moderate") {
      return [
        "Try moving to a different location for better signal",
        "Close other apps that might be using bandwidth",
        "Consider switching to WiFi if you're on mobile data",
      ]
    } else {
      return [
        "Move closer to your router or to an area with better reception",
        "Restart your device or toggle airplane mode",
        "Check if your data plan has been throttled",
        "Try connecting to a different WiFi network",
      ]
    }
  }

  const recommendations = getRecommendations()

  // Get icon based on network strength
  const getNetworkIcon = () => {
    if (networkCategory === "Strong") return <Signal className="h-12 w-12 text-green-500" />
    if (networkCategory === "Moderate") return <SignalMedium className="h-12 w-12 text-yellow-500" />
    return <SignalLow className="h-12 w-12 text-red-500" />
  }

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">{getNetworkIcon()}</div>
        <h2 className="text-xl font-semibold">{networkCategory} Network</h2>
        <div className="mt-2">
          <Progress
            value={results.overallScore}
            className="h-2"
            indicatorClassName={
              networkCategory === "Strong"
                ? "bg-green-500"
                : networkCategory === "Moderate"
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }
          />
          <p className="mt-1 text-sm font-medium">Score: {results.overallScore}/100</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted p-3 rounded-md">
          <div className="flex items-center mb-1">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">Response Time</span>
          </div>
          <p className="text-lg font-semibold">{results.pingLatency.toFixed(0)} ms</p>
        </div>

        <div className="bg-muted p-3 rounded-md">
          <div className="flex items-center mb-1">
            <Download className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">Download</span>
          </div>
          <p className="text-lg font-semibold">{results.downloadSpeed.toFixed(1)} Mbps</p>
        </div>

        <div className="bg-muted p-3 rounded-md">
          <div className="flex items-center mb-1">
            <Upload className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">Upload</span>
          </div>
          <p className="text-lg font-semibold">{results.uploadSpeed.toFixed(1)} Mbps</p>
        </div>

        <div className="bg-muted p-3 rounded-md">
          <div className="flex items-center mb-1">
            <Wifi className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">Network Type</span>
          </div>
          <p className="text-lg font-semibold">{results.networkType || "Unknown"}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Recommendations</h3>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mr-2 mt-0.5">
                {index + 1}
              </span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Run Test Again
        </button>
      </div>
    </div>
  )
}

