"use client"
import { animate, motion } from "framer-motion"
import type React from "react"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { Facebook, Instagram, Linkedin } from "lucide-react"

export default function CardDemo() {
  return (
    <Card>
      <CardSkeletonContainer>
        <Skeleton />
      </CardSkeletonContainer>
    </Card>
  )
}

const Skeleton = () => {
  const scale = [1, 1.1, 1]
  const transform = ["translateY(0px)", "translateY(-4px)", "translateY(0px)"]
  const sequence = [
    [
      ".circle-1",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-2",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-3",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-4",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
    [
      ".circle-5",
      {
        scale,
        transform,
      },
      { duration: 0.8 },
    ],
  ]

  useEffect(() => {
    animate(sequence, {
      // @ts-ignore
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 1,
    })
  }, [])
  return (
    <div className="p-8 overflow-hidden h-full w-full max-w-3xl mx-auto relative flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-xl border border-gray-200/10 shadow-sm">
      <div className="flex flex-row shrink-0 justify-center items-center gap-2">
        <Container className="h-8 w-8 circle-1">
          <Facebook className="h-4 w-4 text-[#1877F2]" />
        </Container>
        <Container className="h-12 w-12 circle-2">
          <Instagram className="h-6 w-6 text-[#E4405F]" />
        </Container>
        <Container className="circle-3">
          <GoogleAdsLogo className="h-8 w-8" />
        </Container>
        <Container className="h-12 w-12 circle-4">
          <TikTokLogo className="h-6 w-6" />
        </Container>
        <Container className="h-8 w-8 circle-5">
          <Linkedin className="h-4 w-4 text-[#0A66C2]" />
        </Container>
      </div>

      <div className="h-40 w-px absolute top-20 m-auto z-40 bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-move">
        <div className="w-10 h-32 top-1/2 -translate-y-1/2 absolute -left-10">
          <Sparkles />
        </div>
      </div>
    </div>
  )
}
const Sparkles = () => {
  const randomMove = () => Math.random() * 2 - 1
  const randomOpacity = () => Math.random()
  const random = () => Math.random()
  return (
    <div className="absolute inset-0">
      {[...Array(12)].map((_, i) => (
        <motion.span
          key={`star-${i}`}
          animate={{
            top: `calc(${random() * 100}% + ${randomMove()}px)`,
            left: `calc(${random() * 100}% + ${randomMove()}px)`,
            opacity: randomOpacity(),
            scale: [1, 1.2, 0],
          }}
          transition={{
            duration: random() * 2 + 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${random() * 100}%`,
            left: `${random() * 100}%`,
            width: `2px`,
            height: `2px`,
            borderRadius: "50%",
            zIndex: 1,
          }}
          className="inline-block bg-black dark:bg-white"
        ></motion.span>
      ))}
    </div>
  )
}

export const Card = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "max-w-sm w-full mx-auto p-8 rounded-xl border border-gray-3/20 bg-black shadow-[2px_4px_16px_0px_rgba(0,0,0,0.06)_inset] group",
        className,
      )}
    >
      {children}
    </div>
  )
}

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return children
}

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <p className={cn("text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm", className)}>{children}</p>
  )
}

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string
  children: React.ReactNode
  showGradient?: boolean
}) => {
  return (
    <div
      className={cn(
        "h-[15rem] md:h-[20rem] rounded-xl z-40",
        className,
        showGradient &&
          "bg-neutral-300 dark:bg-[rgba(40,40,40,0.70)] [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]",
      )}
    >
      {children}
    </div>
  )
}

const Container = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        `h-16 w-16 rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
    shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)]
    `,
        className,
      )}
    >
      {children}
    </div>
  )
}

// Custom logo components for ad platforms
export const GoogleAdsLogo = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M22.54 11.23c0-.59-.05-1.15-.14-1.69H12v3.19h5.92c-.26 1.33-1.04 2.45-2.21 3.2v2.66h3.56c2.08-1.92 3.27-4.74 3.27-8.36z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export const TikTokLogo = ({ className }: { className?: string }) => {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

// Add animation keyframes to globals.css
