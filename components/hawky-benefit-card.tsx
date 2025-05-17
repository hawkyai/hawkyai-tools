"use client"
import type React from "react"
import { useState } from "react"
import { EvervaultCard, Icon } from "@/components/ui/evervault-card"

interface HawkyBenefitCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

export function HawkyBenefitCard({ title, description, icon }: HawkyBenefitCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="border border-gray-3/30 dark:border-white/[0.1] bg-black flex flex-col items-center p-6 relative h-[400px] rounded-xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 text-purple-500" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-purple-500" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 text-purple-500" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-purple-500" />

      <div className="h-48 w-full mb-6">
        <EvervaultCard text={isHovered ? title : ""} className="h-full" />
      </div>

      <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-full flex items-center justify-center mb-6 border border-purple-500/20 relative z-10">
        {icon}
      </div>

      <h4 className="text-lg font-bold mb-3 text-purple-500 relative z-10">{title}</h4>
      <p className="text-gray-9 text-center relative z-10">{description}</p>
    </div>
  )
}
