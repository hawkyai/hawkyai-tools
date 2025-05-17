"use client"

import { useState } from "react"
import { FloatingCreatives } from "@/components/floating-creatives"
import { ScientificButton } from "@/components/scientific-button"
import { Spotlight } from "@/components/ui/spotlight-new"
import HawkyTimeline from "@/components/hawky-timeline"
import BentoGlowingCards from "@/components/bento-glowing-cards"
import { SocialProof } from "@/components/social-proof"
import HawkyFeaturesGrid from "@/components/hawky-features-grid"
import { Footer } from "@/components/ui/footer"
import { GradientBadge } from "@/components/gradient-badge"
import { Activity } from "lucide-react"
import { Header } from "@/components/ui/header"
import { GetStartedSection } from "@/components/get-started-section"

export default function Home() {
  // Set showCreatives to false by default to hide floating elements
  const [showCreatives, setShowCreatives] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-black relative overflow-hidden w-full">
      {/* Spotlight effect positioned at the very top of the page */}
      <Spotlight
        className="fixed top-0 left-0 w-full h-screen pointer-events-none z-0"
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(138, 80, 155, 0.15) 0, rgba(138, 80, 155, 0.05) 50%, rgba(138, 80, 155, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.12) 0, rgba(138, 80, 155, 0.04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.1) 0, rgba(83, 133, 116, 0.05) 80%, transparent 100%)"
        translateY={0}
      />

      {/* Purple-green tint at the top of the page - more gradual */}
      <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[rgba(138,80,155,0.15)] via-[rgba(82,61,90,0.08)] to-transparent z-10"></div>

      {/* Decorative elements */}
      <div className="absolute top-40 right-10 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl z-10"></div>
      <div className="absolute top-[30%] left-10 w-72 h-72 bg-green-500/5 rounded-full blur-3xl z-10"></div>
      <div className="absolute bottom-40 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl z-10"></div>

      {/* Conditionally render floating creatives */}
      {showCreatives && <FloatingCreatives />}

      {/* Use the new Header component */}
      <Header />

      <main className="flex-1 relative z-20">
        {/* Hero Section */}
        <section
          id="hero"
          className="py-32 md:py-40 lg:py-44 relative flex items-center justify-center overflow-hidden"
        >
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-10 max-w-4xl mx-auto">
              <div className="space-y-8 text-center">
                {/* Removed the AI-Powered Marketing Intelligence badge */}
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="font-raleway bg-clip-text text-transparent bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]">
                    Creative factory
                  </span>{" "}
                  <span className="text-gray-12">for Performance Marketing</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-9 max-w-3xl mx-auto">
                  Automate research, analysis, production and analysis of creatives for your performance marketing
                </p>
                <div className="flex justify-center pt-6">
                  {/* Scientific "How it works" button - smaller and with updated text */}
                  <ScientificButton href="#how-it-works" icon={<Activity className="h-4 w-4" />}>
                    How It Works
                  </ScientificButton>
                </div>
              </div>

              {/* Social Proof Section */}
              <div className="w-full">
                <SocialProof />
              </div>

              {/* Enhanced KPI section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 w-full max-w-3xl mx-auto">
                <div className="p-6 rounded-lg bg-black/70 backdrop-blur-sm border border-gray-3/30 shadow-lg shadow-purple-500/5 transform transition-all hover:scale-105">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-full bg-purple-500/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white h-5 w-5"
                      >
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className="text-xs text-white font-medium">CAMPAIGN COSTS</div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">-45%</p>
                  <div className="w-full h-1 bg-gray-3/30 rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full"></div>
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-black/70 backdrop-blur-sm border border-gray-3/30 shadow-lg shadow-purple-500/5 transform transition-all hover:scale-105">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-full bg-purple-500/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white h-5 w-5"
                      >
                        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
                        <path d="m5 16 3 4" />
                        <path d="m19 16-3 4" />
                      </svg>
                    </div>
                    <div className="text-xs text-white font-medium">ROAS IMPROVEMENT</div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">3.2x</p>
                  <div className="w-full h-1 bg-gray-3/30 rounded-full overflow-hidden">
                    <div className="h-full w-[80%] bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full"></div>
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-black/70 backdrop-blur-sm border border-gray-3/30 shadow-lg shadow-purple-500/5 transform transition-all hover:scale-105">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-full bg-purple-500/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white h-5 w-5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className="text-xs text-white font-medium">TIME SAVED</div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-1">82%</p>
                  <div className="w-full h-1 bg-gray-3/30 rounded-full overflow-hidden">
                    <div className="h-full w-[82%] bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the page content remains unchanged */}
        {/* Problem Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-black/50 to-black/80 backdrop-blur-sm">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block mb-4">
                <GradientBadge>The Challenge</GradientBadge>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Are these sounding familiar?
              </h2>
              <p className="max-w-[800px] text-xl text-gray-9">
                B2C marketers are stuck in a cycle of creative guesswork, platform black boxes, and unpredictable
                outcomes.
              </p>
            </div>

            <div className="w-full">
              <BentoGlowingCards />
            </div>
          </div>
        </section>

        {/* How Hawky Works Section - Now with Timeline */}
        <section id="how-it-works" className="relative overflow-hidden bg-black/70 backdrop-blur-sm py-20 md:py-28">
          <div className="relative z-10">
            <HawkyTimeline />
          </div>

          {/* Benefits Section - Now more visible */}
          <div id="why-choose" className="container px-4 md:px-6 mt-20">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block mb-4">
                <GradientBadge>The Benefits</GradientBadge>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Why choose Hawky.ai
              </h2>
              <p className="max-w-[800px] text-xl text-gray-9">
                Our platform delivers measurable results that transform your marketing performance
              </p>
            </div>

            <HawkyFeaturesGrid />
          </div>
        </section>

        {/* Get Started Section */}
        <GetStartedSection />
      </main>
      <Footer showCreativesToggle={true} creativesVisible={showCreatives} onToggleCreatives={setShowCreatives} />
    </div>
  )
}
