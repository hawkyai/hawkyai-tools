"use client"

import { useEffect } from "react"
import Image from "next/image"
import FeaturesSection from "@/components/ui/features-section"
import { Spotlight } from "@/components/ui/spotlight-new"
import { Footer } from "@/components/ui/footer"
import { AnimatedIntegrationGrid } from "@/components/animated-integration-grid"
import { ScientificButton } from "@/components/scientific-button"
import { GradientBadge } from "@/components/gradient-badge"
import { Header } from "@/components/ui/header"
import { GetStartedSection } from "@/components/get-started-section"

export default function CreativeEcosystemPage() {
  // Add useEffect to scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black">
      {/* Spotlight effect - moved outside of section to start from the top of the page */}
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(138, 80, 155, 0.15) 0, rgba(138, 80, 155, 0.05) 50%, rgba(138, 80, 155, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.12) 0, rgba(138, 80, 155, 0.04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.1) 0, rgba(83, 133, 116, 0.05) 80%, transparent 100%)"
      />

      {/* Use the new Header component */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              {/* Replace "Hawky.ai Ecosystem" section span with GradientBadge */}
              <div className="inline-block mb-4">
                <GradientBadge>Hawky.ai Ecosystem</GradientBadge>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl">
                Complete Creative Ecosystem
              </h2>
              <p className="max-w-[800px] text-xl text-gray-9">
                Four interconnected products working together to transform your marketing performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 min-w-[240px] mt-6">
                <ScientificButton href="/get-demo">Get a Demo</ScientificButton>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the page content remains unchanged */}
        {/* Hero Image Section */}
        <section className="pb-20 md:pb-28 -mt-10 relative z-10">
          <div className="container px-4 md:px-6">
            <div className="w-full max-w-6xl mx-auto relative">
              <Image
                src="/hero-illustration.png"
                alt="Hawky.ai Platform Ecosystem"
                width={1200}
                height={400}
                className="rounded-lg w-full relative z-10 bg-black"
                priority
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10 md:py-20 bg-black">
          <FeaturesSection />
        </section>

        {/* Integration Section */}
        <section className="py-20 md:py-28 bg-black">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              {/* Replace "Seamless Integration" section span with GradientBadge */}
              <div className="inline-block mb-4">
                <GradientBadge>Seamless Integration</GradientBadge>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">
                Works With Your Existing Stack
              </h2>
              <p className="max-w-[800px] text-xl text-gray-9">
                Hawky.ai integrates with all major advertising platforms, analytics tools, and CRM systems.
              </p>
            </div>

            <div className="max-w-6xl mx-auto bg-black/30 rounded-xl border border-gray-3/30 p-6">
              <AnimatedIntegrationGrid />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <GetStartedSection
          title="Automate your"
          flipWords={undefined}
          description="Join leading B2C marketers who are achieving predictable outcomes with Hawky.ai."
        />
      </main>

      <Footer />
    </div>
  )
}
