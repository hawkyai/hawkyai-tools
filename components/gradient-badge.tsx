import type React from "react"
import { cn } from "@/lib/utils"

interface GradientBadgeProps {
  children: React.ReactNode
  className?: string
  isTopSection?: boolean
}

// Update the component to have a visible gradient border with proper rounded corners
export function GradientBadge({ children, className, isTopSection = false }: GradientBadgeProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      {/* Gradient background layer */}
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background: "linear-gradient(to right, #f9ce34, #ee2a7b, #6228d7)",
        }}
      />

      {/* Content layer with conditional background */}
      <span
        className={`relative inline-block px-3 py-1 ${isTopSection ? "bg-transparent" : "bg-black"} rounded-full text-white text-sm font-medium`}
        style={{
          margin: "1px", // Reduced border weight by decreasing the margin
        }}
      >
        {children}
      </span>
    </span>
  )
}
