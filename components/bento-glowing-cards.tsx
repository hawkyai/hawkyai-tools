"use client"

import type React from "react"
import { Eye, Lock, BarChart3, TrendingUp, ShieldAlert } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

export default function BentoGlowingCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-6xl mx-auto">
      {/* Creative Guesswork - Larger card spanning 3 columns */}
      <div className="md:col-span-3 min-h-[16rem]">
        <GridItem
          icon={<Eye className="h-6 w-6 text-white" />}
          title="Creative Guesswork"
          description="Marketing teams struggle to understand what makes creative assets perform, relying on intuition instead of data."
          className="h-full"
        />
      </div>

      {/* Platform Black Boxes - 2 columns */}
      <div className="md:col-span-3 min-h-[16rem]">
        <GridItem
          icon={<Lock className="h-6 w-6 text-white" />}
          title="Platform Black Boxes"
          description="Ad platforms provide limited insights into why some creatives work while others fail, leaving marketers in the dark."
          className="h-full"
        />
      </div>

      {/* Rising Ad Costs - 2 columns */}
      <div className="md:col-span-2 min-h-[16rem]">
        <GridItem
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          title="Rising Ad Costs"
          description="Increasing competition drives up acquisition costs, making efficient creative performance more critical than ever."
          className="h-full"
        />
      </div>

      {/* Unpredictable Outcomes - 2 columns */}
      <div className="md:col-span-2 min-h-[16rem]">
        <GridItem
          icon={<BarChart3 className="h-6 w-6 text-white" />}
          title="Unpredictable Outcomes"
          description="Without data-driven creative decisions, marketing performance becomes inconsistent and difficult to scale."
          className="h-full"
        />
      </div>

      {/* Compliance Risks - 2 columns */}
      <div className="md:col-span-2 min-h-[16rem]">
        <GridItem
          icon={<ShieldAlert className="h-6 w-6 text-white" />}
          title="Compliance Risks"
          description="Channel, brand, and legal compliance issues create additional hurdles for creative teams without proper oversight."
          className="h-full"
        />
      </div>
    </div>
  )
}

interface GridItemProps {
  icon: React.ReactNode
  title: string
  description: React.ReactNode
  className?: string
}

const GridItem = ({ icon, title, description, className }: GridItemProps) => {
  return (
    <div className={`min-h-[16rem] ${className}`}>
      <div className="relative h-full rounded-2xl border border-gray-3/20 p-2 md:rounded-3xl md:p-3 bg-gradient-to-br from-black to-gray-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg bg-gradient-to-b from-gray-8/20 to-black p-3 border border-gray-6 shadow-sm">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-sans text-xl font-bold text-white md:text-2xl">{title}</h3>
              <p className="font-sans text-sm text-white md:text-base">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
