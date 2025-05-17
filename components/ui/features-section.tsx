"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { BarChart3, LineChart, Lightbulb, Zap, Bell } from "lucide-react"
import Image from "next/image"

export default function FeaturesSection() {
  const features = [
    {
      title: "Creative Analysis",
      description:
        "Analyze your video creative assets to identify performance patterns, hook effectiveness, narrative structure, and key extracted entities that drive engagement across platforms.",
      skeleton: <SkeletonOne />,
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      className: "col-span-1 lg:col-span-6 border-b dark:border-neutral-800 border-gray-3/30",
    },
    {
      title: "Competitive Analysis",
      description: "Gain insights into your competitors' creative strategies and performance metrics.",
      skeleton: <SkeletonTwo />,
      icon: <LineChart className="h-8 w-8 text-purple-500" />,
      className: "border-b col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800 border-gray-3/30",
    },
    {
      title: "Proactive Performance Alerts",
      description: "Receive real-time notifications about campaign performance changes and optimization opportunities.",
      skeleton: <SkeletonFive />,
      icon: <Bell className="h-8 w-8 text-purple-500" />,
      className: "col-span-1 lg:col-span-3 border-b dark:border-neutral-800 border-gray-3/30",
    },
    {
      title: "Creative Production",
      description:
        "Generate high-performing creatives with AI-powered scoring of individual elements. Optimize logos, features, messaging, and CTAs to achieve higher ROAS and better campaign performance.",
      skeleton: <SkeletonThree />,
      icon: <Lightbulb className="h-8 w-8 text-purple-500" />,
      className: "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800 border-gray-3/30",
    },
    {
      title: "Creative Optimisation",
      description:
        "Continuously improve your creative assets with AI-powered recommendations, A/B testing, and real-time performance metrics like ROAS, CTR, and CPC.",
      skeleton: <SkeletonFour />,
      icon: <Zap className="h-8 w-8 text-purple-500" />,
      className: "col-span-1 lg:col-span-3 border-gray-3/30",
    },
  ]
  return (
    <div className="relative z-20 py-10 lg:py-24 max-w-7xl mx-auto">
      <div className="px-8">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
          Our Complete Creative Ecosystem
        </h4>

        <p className="text-base lg:text-lg max-w-2xl my-6 mx-auto text-gray-9 text-center font-normal">
          Hawky.ai provides a comprehensive suite of tools to transform your creative marketing from guesswork to
          data-driven decisions.
        </p>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800 border-gray-3/30 bg-black/50 backdrop-blur-sm gap-y-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">{feature.icon}</div>
                <FeatureTitle>{feature.title}</FeatureTitle>
              </div>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full mt-6">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  )
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  return <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>{children}</div>
}

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return <p className="tracking-tight text-white text-xl md:text-2xl font-semibold">{children}</p>
}

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className={cn("text-sm md:text-base", "text-gray-9 font-normal", "text-left max-w-sm mx-0 md:text-sm my-2")}>
      {children}
    </p>
  )
}

export const SkeletonOne = () => {
  return (
    <div className="relative h-80 md:h-96 w-full">
      <div className="w-full h-full mx-auto bg-black/50 shadow-lg group rounded-lg border border-gray-3/30 overflow-hidden">
        <Image
          src="/creative-analysis-dashboard.png"
          alt="Creative Analysis Dashboard"
          fill
          className="object-contain p-2 rounded-md"
        />
      </div>
    </div>
  )
}

export const SkeletonThree = () => {
  return (
    <div className="relative h-72 md:h-80 w-full">
      <div className="w-full h-full mx-auto bg-black/50 shadow-lg group rounded-lg border border-gray-3/30 overflow-hidden">
        <Image
          src="/creative-production-dashboard.png"
          alt="Creative Production Dashboard"
          fill
          className="object-contain p-1 rounded-md"
        />
      </div>
    </div>
  )
}

export const SkeletonTwo = () => {
  // Use the competitor ad images
  const images = [
    "/competitor-1.png",
    "/competitor-2.png",
    "/competitor-3.png",
    "/competitor-4.png",
    "/competitor-5.png",
    "/competitor-6.png",
    "/competitor-7.png",
    "/competitor-8.png",
  ]

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  }
  return (
    <div className="relative flex flex-col items-start p-4 gap-6 h-full overflow-hidden">
      <div className="flex flex-row -ml-10">
        {images.slice(0, 4).map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{
              rotate: Math.random() * 10 - 5,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-black dark:bg-neutral-800 dark:border-neutral-700 border border-gray-3/30 shrink-0 overflow-hidden"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt="competitor creative"
              width={180}
              height={180}
              className="rounded-lg h-20 w-20 md:h-32 md:w-32 object-cover shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {images.slice(4).map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: Math.random() * 10 - 5,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-black dark:bg-neutral-800 dark:border-neutral-700 border border-gray-3/30 shrink-0 overflow-hidden"
          >
            <Image
              src={image || "/placeholder.svg"}
              alt="competitor creative"
              width={180}
              height={180}
              className="rounded-lg h-20 w-20 md:h-32 md:w-32 object-cover shrink-0"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 z-[100] inset-y-0 w-10 bg-gradient-to-r from-black to-transparent h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-10 bg-gradient-to-l from-black to-transparent h-full pointer-events-none" />
    </div>
  )
}

export const SkeletonFour = () => {
  return (
    <div className="relative h-72 md:h-80 w-full">
      <div className="w-full h-full mx-auto bg-black/50 shadow-lg group rounded-lg border border-gray-3/30 overflow-hidden">
        <Image
          src="/creative-optimization-dashboard.png"
          alt="Creative Optimization Dashboard"
          fill
          className="object-contain p-1 rounded-md"
        />
      </div>
    </div>
  )
}

export const SkeletonFive = () => {
  return (
    <div className="relative h-72 md:h-80 w-full">
      <div className="w-full h-full mx-auto bg-black/50 shadow-lg group rounded-lg border border-gray-3/30 overflow-hidden">
        <Image
          src="/performance-alerts-dashboard.png"
          alt="Performance Alerts Dashboard"
          fill
          className="object-contain p-1 rounded-md"
        />
      </div>
    </div>
  )
}
