"use client"
import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function AnimatedIntegrationGrid() {
  // Simple state to handle hover effects
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Define platforms with actual logo images
  const platforms = [
    // Social & Ad Platforms
    {
      name: "Meta",
      logo: "/integrations/meta-logo.png",
      category: "social",
    },
    {
      name: "LinkedIn",
      logo: "/integrations/linkedin-logo.png",
      category: "social",
    },
    {
      name: "Google Ads",
      logo: "/integrations/google-ads-logo.png",
      category: "ads",
    },
    // Analytics & CRM
    {
      name: "Google Analytics",
      logo: "/integrations/google-analytics-logo.png",
      category: "analytics",
    },
    {
      name: "AppsFlyer",
      logo: "/integrations/appsflyer-logo.png",
      category: "analytics",
    },
    {
      name: "Salesforce",
      logo: "/integrations/salesforce-logo.png",
      category: "crm",
    },
    {
      name: "Leadsquared",
      logo: "/integrations/leadsquared-logo.png",
      category: "crm",
    },
    {
      name: "Zoho CRM",
      logo: "/integrations/zoho-crm-logo.png",
      category: "crm",
    },
    // Productivity & Collaboration
    {
      name: "Google Sheets",
      logo: "/integrations/google-sheets-logo.png",
      category: "Data",
    },
    {
      name: "Slack",
      logo: "/integrations/slack-logo.png",
      category: "collaboration",
    },
  ]

  return (
    <div className="p-8 overflow-hidden relative flex flex-col items-center justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
        {platforms.map((platform, index) => (
          <div
            key={platform.name}
            className={cn(
              "rounded-xl flex flex-col items-center justify-center bg-black/50 shadow-md border border-gray-3/30 hover:border-purple-500/30 transition-all duration-300 p-6",
              hoveredIndex === index ? "scale-105 shadow-lg shadow-purple-500/10" : "",
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative h-16 w-full flex items-center justify-center mb-4">
              <div className="bg-white p-2 rounded-md w-[100px] h-[60px] flex items-center justify-center">
                <Image
                  src={platform.logo || "/placeholder.svg"}
                  alt={`${platform.name} logo`}
                  width={80}
                  height={48}
                  className="object-contain max-h-12"
                />
              </div>
            </div>
            <span className="text-sm text-gray-12 text-center font-medium">{platform.name}</span>
            <span className="text-xs text-gray-9 mt-1">{getCategoryLabel(platform.category)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case "social":
      return "Social Media"
    case "ads":
      return "Ad Platform"
    case "analytics":
      return "Analytics"
    case "crm":
      return "CRM"
    case "Data":
      return "Data"
    case "collaboration":
      return "Collaboration"
    default:
      return ""
  }
}
