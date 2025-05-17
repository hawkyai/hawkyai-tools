"use client"

import { useEffect } from "react"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Spotlight } from "@/components/ui/spotlight-new"
import { GetStartedSection } from "@/components/get-started-section"
import FeaturesSection from "@/components/ui/features-section"

export default function EcosystemPage() {
  // Add useEffect to scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Spotlight effect */}
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(138, 80, 155, 0.15) 0, rgba(138, 80, 155, 0.05) 50%, rgba(138, 80, 155, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.12) 0, rgba(138, 80, 155, 0.04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.1) 0, rgba(83, 133, 116, 0.05) 80%, transparent 100%)"
      />

      {/* Header */}
      <Header />

      <main className="flex-1">
        {/* Features Section */}
        <section className="py-10 md:py-20 bg-black">
          <FeaturesSection />
        </section>

        {/* Get Started Section - with custom props */}
        <GetStartedSection
          title="Transform your"
          flipWords={["Marketing", "Campaigns", "Strategy", "Results"]}
          description="Experience the power of AI-driven creative intelligence for your marketing campaigns."
          buttonText="Schedule a Demo"
        />
      </main>

      <Footer />
    </div>
  )
}
