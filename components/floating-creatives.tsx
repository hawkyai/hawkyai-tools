"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

// Define the types of creative elements we'll display
type CreativeElement = {
  type: "image" | "shape" | "metric"
  content: string
  width: number
  height: number
  initialPosition: { x: string | number; y: string | number }
  organizedPosition: { x: string | number; y: string | number }
  floatAnimation: { x: number; y: number; duration: number; delay: number }
  rotation: number
  finalRotation: number
  className?: string
  zIndex?: number
  opacity?: number
  finalOpacity?: number
}

export function FloatingCreatives() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  // Define scroll progress for animations (0 to 1)
  const scrollProgress = useTransform(scrollY, [0, 600], [0, 1])

  // Create a single transform for the ROAS indicator
  const roasOpacity = useTransform(scrollProgress, [0.3, 0.7], [0, 1])
  const roasY = useTransform(scrollProgress, [0.3, 0.7], [20, 0])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Define our creative elements with both initial scattered and final organized positions
  const creativeElements: CreativeElement[] = [
    // Ad Creatives from provided images - positioned higher and more to the sides initially
    {
      type: "image",
      content: "/floating-elements/creative-1.png",
      width: 120,
      height: 80,
      initialPosition: { x: "2%", y: "5%" },
      organizedPosition: { x: "10%", y: "120%" },
      floatAnimation: { x: 15, y: -10, duration: 8, delay: 0 },
      rotation: -3,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 5,
      opacity: 0.9,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-2.png",
      width: 100,
      height: 70,
      initialPosition: { x: "12%", y: "2%" },
      organizedPosition: { x: "25%", y: "120%" },
      floatAnimation: { x: -10, y: 15, duration: 7.5, delay: 1.2 },
      rotation: 2,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 5,
      opacity: 0.85,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-3.png",
      width: 110,
      height: 75,
      initialPosition: { x: "22%", y: "8%" },
      organizedPosition: { x: "40%", y: "120%" },
      floatAnimation: { x: 12, y: -8, duration: 9, delay: 0.5 },
      rotation: -2,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 5,
      opacity: 0.8,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-4.png",
      width: 115,
      height: 80,
      initialPosition: { x: "35%", y: "3%" },
      organizedPosition: { x: "55%", y: "120%" },
      floatAnimation: { x: -8, y: 12, duration: 8.2, delay: 1.8 },
      rotation: 3,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 5,
      opacity: 0.9,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-5.png",
      width: 105,
      height: 75,
      initialPosition: { x: "65%", y: "2%" },
      organizedPosition: { x: "70%", y: "120%" },
      floatAnimation: { x: 10, y: -12, duration: 7.8, delay: 0.7 },
      rotation: -1,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 5,
      opacity: 0.85,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-6.png",
      width: 100,
      height: 70,
      initialPosition: { x: "75%", y: "6%" },
      organizedPosition: { x: "85%", y: "120%" },
      floatAnimation: { x: -12, y: 10, duration: 8.5, delay: 1.5 },
      rotation: 2,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 5,
      opacity: 0.8,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-7.png",
      width: 110,
      height: 75,
      initialPosition: { x: "85%", y: "4%" },
      organizedPosition: { x: "15%", y: "180%" },
      floatAnimation: { x: 8, y: -10, duration: 9.2, delay: 0.3 },
      rotation: -2,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 5,
      opacity: 0.9,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-8.png",
      width: 115,
      height: 80,
      initialPosition: { x: "95%", y: "7%" },
      organizedPosition: { x: "30%", y: "180%" },
      floatAnimation: { x: -10, y: 8, duration: 7.6, delay: 1.1 },
      rotation: 1,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 5,
      opacity: 0.85,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-9.png",
      width: 105,
      height: 75,
      initialPosition: { x: "-5%", y: "12%" },
      organizedPosition: { x: "45%", y: "180%" },
      floatAnimation: { x: 12, y: -8, duration: 8.8, delay: 0.9 },
      rotation: -3,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 5,
      opacity: 0.8,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-1.png",
      width: 100,
      height: 70,
      initialPosition: { x: "5%", y: "18%" },
      organizedPosition: { x: "60%", y: "180%" },
      floatAnimation: { x: 15, y: -5, duration: 8.3, delay: 1.7 },
      rotation: 2,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 4,
      opacity: 0.9,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-5.png",
      width: 95,
      height: 65,
      initialPosition: { x: "92%", y: "15%" },
      organizedPosition: { x: "75%", y: "180%" },
      floatAnimation: { x: -15, y: 10, duration: 9.5, delay: 0.2 },
      rotation: -2,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 4,
      opacity: 0.85,
      finalOpacity: 1,
    },
    // ADDITIONAL CREATIVES - to make it look more like a factory
    {
      type: "image",
      content: "/floating-elements/creative-2.png",
      width: 90,
      height: 65,
      initialPosition: { x: "15%", y: "-5%" },
      organizedPosition: { x: "20%", y: "150%" },
      floatAnimation: { x: 18, y: 12, duration: 9.1, delay: 0.8 },
      rotation: -5,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 6,
      opacity: 0.9,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-3.png",
      width: 85,
      height: 60,
      initialPosition: { x: "45%", y: "-8%" },
      organizedPosition: { x: "35%", y: "150%" },
      floatAnimation: { x: -14, y: 16, duration: 8.7, delay: 1.3 },
      rotation: 4,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 6,
      opacity: 0.85,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-4.png",
      width: 95,
      height: 70,
      initialPosition: { x: "60%", y: "-10%" },
      organizedPosition: { x: "50%", y: "150%" },
      floatAnimation: { x: 10, y: 14, duration: 9.3, delay: 0.6 },
      rotation: -3,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 6,
      opacity: 0.9,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-6.png",
      width: 80,
      height: 55,
      initialPosition: { x: "80%", y: "-7%" },
      organizedPosition: { x: "65%", y: "150%" },
      floatAnimation: { x: -12, y: 15, duration: 8.9, delay: 1.6 },
      rotation: 3,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 6,
      opacity: 0.85,
      finalOpacity: 1,
    },
    {
      type: "image",
      content: "/floating-elements/creative-8.png",
      width: 90,
      height: 65,
      initialPosition: { x: "25%", y: "-12%" },
      organizedPosition: { x: "80%", y: "150%" },
      floatAnimation: { x: 16, y: 13, duration: 9.4, delay: 0.4 },
      rotation: -4,
      finalRotation: 0,
      className: "shadow-lg rounded-md border border-gray-3/30",
      zIndex: 6,
      opacity: 0.9,
      finalOpacity: 1,
    },
    // HOLLOW SHAPES - more of them
    {
      type: "shape",
      content: "square",
      width: 30,
      height: 30,
      initialPosition: { x: "30%", y: "15%" },
      organizedPosition: { x: "30%", y: "240%" },
      floatAnimation: { x: 20, y: 15, duration: 9.7, delay: 0.4 },
      rotation: 45,
      finalRotation: 0,
      className: "border-2 border-purple-500/40 bg-transparent",
      zIndex: 3,
      opacity: 0.7,
      finalOpacity: 0,
    },
    {
      type: "shape",
      content: "circle",
      width: 25,
      height: 25,
      initialPosition: { x: "70%", y: "16%" },
      organizedPosition: { x: "70%", y: "240%" },
      floatAnimation: { x: -18, y: -12, duration: 8.4, delay: 1.9 },
      rotation: 0,
      finalRotation: 0,
      className: "border-2 border-green-500/40 rounded-full bg-transparent",
      zIndex: 3,
      opacity: 0.7,
      finalOpacity: 0,
    },
    {
      type: "shape",
      content: "triangle",
      width: 35,
      height: 35,
      initialPosition: { x: "20%", y: "20%" },
      organizedPosition: { x: "20%", y: "240%" },
      floatAnimation: { x: 15, y: -18, duration: 9.2, delay: 0.7 },
      rotation: 30,
      finalRotation: 0,
      className: "border-2 border-purple-500/40 bg-transparent triangle",
      zIndex: 3,
      opacity: 0.7,
      finalOpacity: 0,
    },
    {
      type: "shape",
      content: "square",
      width: 40,
      height: 40,
      initialPosition: { x: "50%", y: "18%" },
      organizedPosition: { x: "50%", y: "240%" },
      floatAnimation: { x: -22, y: 14, duration: 8.8, delay: 1.2 },
      rotation: 20,
      finalRotation: 0,
      className: "border-2 border-green-500/40 bg-transparent",
      zIndex: 3,
      opacity: 0.7,
      finalOpacity: 0,
    },
    {
      type: "shape",
      content: "circle",
      width: 20,
      height: 20,
      initialPosition: { x: "85%", y: "22%" },
      organizedPosition: { x: "85%", y: "240%" },
      floatAnimation: { x: 16, y: -20, duration: 9.5, delay: 0.3 },
      rotation: 0,
      finalRotation: 0,
      className: "border-2 border-purple-500/40 rounded-full bg-transparent",
      zIndex: 3,
      opacity: 0.7,
      finalOpacity: 0,
    },
    {
      type: "shape",
      content: "diamond",
      width: 30,
      height: 30,
      initialPosition: { x: "40%", y: "25%" },
      organizedPosition: { x: "40%", y: "240%" },
      floatAnimation: { x: -14, y: -16, duration: 8.6, delay: 1.5 },
      rotation: 45,
      finalRotation: 0,
      className: "border-2 border-green-500/40 bg-transparent transform rotate-45",
      zIndex: 3,
      opacity: 0.7,
      finalOpacity: 0,
    },
    {
      type: "shape",
      content: "hexagon",
      width: 35,
      height: 35,
      initialPosition: { x: "60%", y: "23%" },
      organizedPosition: { x: "60%", y: "240%" },
      floatAnimation: { x: 18, y: 12, duration: 9.3, delay: 0.9 },
      rotation: 0,
      finalRotation: 0,
      className: "border-2 border-purple-500/40 bg-transparent hexagon",
      zIndex: 3,
      opacity: 0.7,
      finalOpacity: 0,
    },
    // ROAS metrics that appear when organized
    {
      type: "metric",
      content: "ROAS +42%",
      width: 100,
      height: 40,
      initialPosition: { x: "50%", y: "50%" },
      organizedPosition: { x: "50%", y: "90%" },
      floatAnimation: { x: 0, y: 0, duration: 0, delay: 0 },
      rotation: 0,
      finalRotation: 0,
      className:
        "bg-gradient-to-r from-purple-500 to-green-500 text-white text-sm font-medium p-2 rounded-lg shadow-lg flex items-center justify-center",
      zIndex: 6,
      opacity: 0,
      finalOpacity: 1,
    },
  ]

  if (!mounted) return null

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none w-full">
      {/* Triangle and hexagon CSS */}
      <style jsx global>{`
        .triangle {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
        .hexagon {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
      `}</style>

      {creativeElements.map((element, index) => {
        return (
          <motion.div
            key={index}
            className="absolute flex items-center justify-center"
            style={{
              width: element.width,
              height: element.height,
              left:
                typeof element.initialPosition.x === "string"
                  ? element.initialPosition.x
                  : `${element.initialPosition.x}px`,
              top: 0,
              zIndex: element.zIndex || 5,
              maxWidth: "100%",
            }}
            animate={
              element.type !== "metric"
                ? {
                    x: [0, element.floatAnimation.x, 0],
                    y: [0, element.floatAnimation.y, 0],
                  }
                : {}
            }
            transition={
              element.type !== "metric"
                ? {
                    duration: element.floatAnimation.duration,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: element.floatAnimation.delay,
                  }
                : {}
            }
          >
            <motion.div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
              animate={{
                y:
                  scrollProgress.get() *
                  (Number.parseFloat(element.organizedPosition.y as string) -
                    Number.parseFloat(element.initialPosition.y as string)),
                opacity:
                  element.opacity + scrollProgress.get() * ((element.finalOpacity || 1) - (element.opacity || 1)),
                rotate: element.rotation + scrollProgress.get() * (element.finalRotation - element.rotation),
              }}
            >
              {element.type === "image" && (
                <div className={element.className}>
                  <Image
                    src={element.content || "/placeholder.svg"}
                    alt="Creative element"
                    width={element.width}
                    height={element.height}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
              )}

              {element.type === "shape" && (
                <div
                  className={element.className}
                  style={{
                    width: element.width,
                    height: element.height,
                  }}
                ></div>
              )}

              {element.type === "metric" && <div className={element.className}>{element.content}</div>}
            </motion.div>
          </motion.div>
        )
      })}

      {/* ROAS improvement indicator that appears when scrolled */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500/10 to-green-500/10 border border-purple-500/30 rounded-lg p-4 text-center"
        style={{
          width: "300px",
          top: "220%",
          opacity: roasOpacity,
          y: roasY,
          zIndex: 10,
        }}
      >
        <div className="text-xl font-bold text-purple-500 mb-1">Organized Creatives</div>
        <div className="text-sm text-gray-12">Performance optimization complete</div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <div className="bg-purple-500/20 rounded p-1">
            <div className="text-xs text-gray-9">CTR</div>
            <div className="text-sm font-bold text-purple-500">+37%</div>
          </div>
          <div className="bg-green-500/20 rounded p-1">
            <div className="text-xs text-gray-9">ROAS</div>
            <div className="text-sm font-bold text-green-500">+42%</div>
          </div>
          <div className="bg-purple-500/20 rounded p-1">
            <div className="text-xs text-gray-9">Conv.</div>
            <div className="text-sm font-bold text-purple-500">+28%</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
