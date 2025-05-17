"use client"
import { motion } from "framer-motion"

type SpotlightProps = {
  gradientFirst?: string
  gradientSecond?: string
  gradientThird?: string
  translateY?: number
  width?: number
  height?: number
  smallWidth?: number
  duration?: number
  xOffset?: number
  className?: string
}

export const Spotlight = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(249, 206, 52, 0.15) 0, rgba(238, 42, 123, 0.05) 50%, rgba(98, 40, 215, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, rgba(249, 206, 52, 0.06) 0, rgba(238, 42, 123, 0.02) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, rgba(98, 40, 215, 0.04) 0, rgba(238, 42, 123, 0.02) 80%, transparent 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
  className = "",
}: SpotlightProps = {}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
      }}
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-hidden ${className}`}
    >
      <motion.div
        animate={{
          x: [0, xOffset, 0],
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-full h-screen z-40 pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0`}
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0 origin-top-left`}
        />

        <div
          style={{
            transform: "rotate(-45deg) translate(-180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 left-0 origin-top-left`}
        />
      </motion.div>

      <motion.div
        animate={{
          x: [0, -xOffset, 0],
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-full h-screen z-40 pointer-events-none"
      >
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(45deg)`,
            background: gradientFirst,
            width: `${width}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0`}
        />

        <div
          style={{
            transform: "rotate(45deg) translate(-5%, -50%)",
            background: gradientSecond,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0 origin-top-right`}
        />

        <div
          style={{
            transform: "rotate(45deg) translate(180%, -70%)",
            background: gradientThird,
            width: `${smallWidth}px`,
            height: `${height}px`,
          }}
          className={`absolute top-0 right-0 origin-top-right`}
        />
      </motion.div>
    </motion.div>
  )
}
