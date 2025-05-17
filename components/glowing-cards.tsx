"use client"

import type React from "react"

import { Eye, Lock, BarChart3 } from "lucide-react"
import { GlowingEffect } from "@/components/ui/glowing-effect"

export default function GlowingCards() {
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
      <GridItem
        icon={<Eye className="h-6 w-6 text-[#ee2a7b]" />}
        title="Creative Guesswork"
        description="Marketing teams struggle to understand what makes creative assets perform, relying on intuition instead of data."
      />

      <GridItem
        icon={<Lock className="h-6 w-6 text-[#ee2a7b]" />}
        title="Platform Black Boxes"
        description="Ad platforms provide limited insights into why some creatives work while others fail, leaving marketers in the dark."
      />

      <GridItem
        icon={<BarChart3 className="h-6 w-6 text-[#ee2a7b]" />}
        title="Unpredictable Outcomes"
        description="Without data-driven creative decisions, marketing performance becomes inconsistent and difficult to scale."
      />
    </ul>
  )
}

interface GridItemProps {
  icon: React.ReactNode
  title: string
  description: React.ReactNode
}

const GridItem = ({ icon, title, description }: GridItemProps) => {
  return (
    <li className="min-h-[16rem] list-none">
      <div className="relative h-full rounded-2xl border border-gray-3/20 p-2 md:rounded-3xl md:p-3 bg-gradient-to-br from-black to-gray-1">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg bg-gradient-to-r from-[#f9ce34]/10 via-[#ee2a7b]/10 to-[#6228d7]/10 p-3 border border-[#ee2a7b]/20">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="font-sans text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] md:text-2xl">
                {title}
              </h3>
              <p className="font-sans text-sm text-gray-9 md:text-base">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
}
