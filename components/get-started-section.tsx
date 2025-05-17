"use client"

import { ScientificButton } from "@/components/scientific-button"
import { FlipWords } from "@/components/ui/flip-words"
import { GradientBadge } from "@/components/gradient-badge"

interface GetStartedSectionProps {
  title?: string
  flipWords?: string[]
  description?: string
  buttonText?: string
  buttonHref?: string
  className?: string
}

export function GetStartedSection({
  title = "Automate your",
  flipWords = ["Analysis", "Research", "Production", "Optimisation"],
  description = "Join leading B2C marketers who are achieving predictable outcomes with Hawky.ai.",
  buttonText = "Get Demo",
  buttonHref = "/get-demo",
  className = "",
}: GetStartedSectionProps) {
  return (
    <section className={`py-20 md:py-28 bg-black/60 backdrop-blur-sm relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-500/10 opacity-20"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="inline-block mb-2">
            <GradientBadge>Get Started Today</GradientBadge>
          </div>
          <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            {title} <br />
            Creative{" "}
            {flipWords ? (
              <FlipWords words={flipWords} className="text-purple-500 font-bold" duration={2000} />
            ) : (
              <span className="text-purple-500 font-bold">Ecosystem</span>
            )}
          </div>
          <p className="max-w-[700px] text-xl text-gray-9">{description}</p>
          <ScientificButton
            href={buttonHref}
            {...(buttonHref === "/get-started"
              ? {
                  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  },
                }
              : {})}
          >
            {buttonText}
          </ScientificButton>
        </div>
      </div>

      {/* Add subtle particle effect in the background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-3/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 left-1/5 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
      </div>
    </section>
  )
}
