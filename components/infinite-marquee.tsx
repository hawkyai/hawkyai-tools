"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface MarqueeProps {
  direction?: "left" | "right"
  speed?: number
  pauseOnHover?: boolean
  className?: string
  children: React.ReactNode
}

export const InfiniteMarquee = ({
  direction = "left",
  speed = 40,
  pauseOnHover = true,
  className = "",
  children,
}: MarqueeProps) => {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!marqueeRef.current || !containerRef.current) return

    const marqueeContent = marqueeRef.current
    const container = containerRef.current
    const marqueeWidth = marqueeContent.offsetWidth

    // Clone the content for seamless looping
    const clone = marqueeContent.cloneNode(true) as HTMLDivElement
    container.appendChild(clone)

    let animationId: number
    let startTime: number | null = null
    let progress = 0

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime

      // Calculate how much to move based on elapsed time and speed
      progress = (elapsed * speed) / 1000

      // Reset when we've moved the full width
      if (progress >= marqueeWidth) {
        startTime = timestamp
        progress = 0
      }

      // Apply the transform
      const translateX = direction === "left" ? -progress : progress
      marqueeContent.style.transform = `translateX(${translateX}px)`
      clone.style.transform = `translateX(${translateX}px)`

      animationId = requestAnimationFrame(step)
    }

    animationId = requestAnimationFrame(step)

    // Pause animation on hover if enabled
    if (pauseOnHover) {
      const handleMouseEnter = () => {
        cancelAnimationFrame(animationId)
      }

      const handleMouseLeave = () => {
        animationId = requestAnimationFrame(step)
      }

      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        cancelAnimationFrame(animationId)
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [direction, speed, pauseOnHover])

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={marqueeRef} className="inline-block">
        {children}
      </div>
    </div>
  )
}
