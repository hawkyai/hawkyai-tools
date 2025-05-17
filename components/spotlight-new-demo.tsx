"use client"
import { Spotlight } from "@/components/ui/spotlight-new"

export default function SpotlightNewDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(138, 80, 155, 0.08) 0, rgba(138, 80, 155, 0.02) 50%, rgba(138, 80, 155, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.06) 0, rgba(138, 80, 155, 0.02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.04) 0, rgba(83, 133, 116, 0.02) 80%, transparent 100%)"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-purple-500 to-green-500">
          Creative factory <br /> for Performance Marketing
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Automate research, analysis, production and analysis of creatives for your performance marketing
        </p>
      </div>
    </div>
  )
}
