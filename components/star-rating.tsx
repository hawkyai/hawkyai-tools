"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface StarRatingProps {
  rating?: number
  totalStars?: number
  size?: "sm" | "md" | "lg"
  showAverage?: boolean
  showCount?: boolean
  count?: number
  animated?: boolean
}

export function StarRating({
  rating = 4.8,
  totalStars = 5,
  size = "md",
  showAverage = true,
  showCount = true,
  count = 128,
  animated = true,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  // Size mapping
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  // Text size mapping
  const textSizeMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  const starVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.2 },
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(totalStars)].map((_, i) => {
            const starValue = i + 1
            const isFilled = starValue <= Math.floor(rating)
            const isHalfFilled = !isFilled && starValue === Math.ceil(rating) && rating % 1 !== 0

            return (
              <motion.div
                key={i}
                className="relative"
                variants={animated ? starVariants : undefined}
                initial="initial"
                animate={hovered === i ? "hover" : "initial"}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <svg
                  className={`${sizeMap[size]} ${
                    isFilled ? "text-yellow-400" : isHalfFilled ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill={isFilled ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                {isHalfFilled && (
                  <div className="absolute inset-0 overflow-hidden w-1/2">
                    <svg
                      className={`${sizeMap[size]} text-yellow-400`}
                      fill="currentColor"
                      stroke="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
        {showAverage && <span className={`font-medium text-white ${textSizeMap[size]}`}>{rating.toFixed(1)}</span>}
        {showCount && <span className={`text-gray-9 ${textSizeMap[size]}`}>({count})</span>}
      </div>
    </div>
  )
}
