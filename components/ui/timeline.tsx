"use client"
import { useScroll, useTransform, motion } from "motion/react"
import type React from "react"
import { useEffect, useRef, useState } from "react"
// Import the GradientBadge component at the top of the file
import { GradientBadge } from "@/components/gradient-badge"

interface TimelineEntry {
  title: string
  content: React.ReactNode
}

// Reduce space between title and other sections
// Bring title section and story section closer together
// Center the tracing beam between title and illustration

// Update the container padding to reduce space
const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setHeight(rect.height)
    }
  }, [ref])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div className="w-full bg-black font-sans md:px-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 lg:px-10">
        <div className="flex flex-col items-center justify-center space-y-2 text-center mb-8">
          {/* Replace "The Process" section span with GradientBadge */}
          <div className="inline-block mb-2">
            <GradientBadge>The Process</GradientBadge>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl">How Hawky.ai works</h2>
          <p className="max-w-[800px] text-xl text-gray-9">
            Our AI-powered platform transforms your creative process from guesswork to data-driven decisions
          </p>
        </div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        <div className="h-10 absolute left-3 md:left-12 w-10 rounded-full bg-black flex items-center justify-center z-50">
          <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] border border-[#ee2a7b]/20 p-2" />
        </div>
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-6 md:pt-16 md:gap-16">
            <div className="sticky flex flex-col md:flex-row z-40 items-start top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <h3 className="hidden md:block text-3xl md:text-3xl md:pl-32 font-bold text-gray-200 max-w-[250px] tracking-wide uppercase">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-8 w-full">
              <h3 className="md:hidden block text-3xl mb-5 text-left font-bold text-gray-200 tracking-wide uppercase">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-16 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-gray-3/30 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] from-[0%] via-[50%] rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

export { Timeline }
