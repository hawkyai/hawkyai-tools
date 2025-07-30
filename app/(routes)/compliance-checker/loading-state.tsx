"use client"

import { Sparkles, Shield, Accessibility, FileText, DollarSign } from "lucide-react"

interface LoadingStateProps {
  standard: string
  state: "validating" | "loading"
}

export default function LoadingState({ standard, state }: LoadingStateProps) {
  const getStandardIcon = () => {
    switch (standard) {
      case "asci":
        return <Shield className="h-8 w-8 text-pink-400" />
      case "wcag":
        return <Accessibility className="h-8 w-8 text-purple-400" />
      case "irdai":
        return <FileText className="h-8 w-8 text-yellow-400" />
      case "finance":
        return <DollarSign className="h-8 w-8 text-green-400" />
      default:
        return <Sparkles className="h-8 w-8 text-blue-400" />
    }
  }

  const getStandardName = () => {
    switch (standard) {
      case "asci":
        return "ASCI"
      case "wcag":
        return "WCAG"
      case "irdai":
        return "IRDAI"
      case "finance":
        return "Finance"
      default:
        return standard.toUpperCase()
    }
  }

  const getLoadingText = () => {
    if (state === "validating") {
      return "Validating advertisement type..."
    }
    return `Analyzing ${getStandardName()} compliance...`
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="bg-black/50 p-6 rounded-full mb-6 inline-block">
            {getStandardIcon()}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {state === "validating" ? "Validating" : "Analyzing"} {getStandardName()} Compliance
          </h2>
          <p className="text-gray-400">{getLoadingText()}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="bg-gray-800/50 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>This may take a few moments...</p>
        </div>
      </div>
    </div>
  )
} 