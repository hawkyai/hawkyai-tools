"use client"
import { useMotionValue } from "motion/react"
import { useState, useEffect } from "react"
import { useMotionTemplate, motion } from "motion/react"
import { cn } from "@/lib/utils"

export const EvervaultCard = ({
  text,
  className,
}: {
  text?: string
  className?: string
}) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const [randomString, setRandomString] = useState("")

  useEffect(() => {
    const str = generateRandomString(1500)
    setRandomString(str)
  }, [])

  function onMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)

    const str = generateRandomString(1500)
    setRandomString(str)
  }

  return (
    <div
      className={cn(
        "p-0.5  bg-transparent aspect-square  flex items-center justify-center w-full h-full relative",
        className,
      )}
    >
      <div
        onMouseMove={onMouseMove}
        className="group/card rounded-3xl w-full relative overflow-hidden bg-transparent flex items-center justify-center h-full"
      >
        <CardPattern mouseX={mouseX} mouseY={mouseY} randomString={randomString} />
        <div className="relative z-10 flex items-center justify-center">
          <div className="relative h-44 w-44  rounded-full flex items-center justify-center text-white font-bold text-4xl">
            <div className="absolute w-full h-full bg-white/[0.8] dark:bg-black/[0.8] blur-sm rounded-full" />
            <span className="dark:text-white text-black z-20">{text}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CardPattern({ mouseX, mouseY, randomString }: any) {
  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`
  const style = { maskImage, WebkitMaskImage: maskImage }

  return (
    <div className="pointer-events-none">
      <div className="absolute inset-0 rounded-2xl  [mask-image:linear-gradient(white,transparent)] group-hover/card:opacity-50"></div>
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-400 opacity-0 group-hover/card:opacity-100 backdrop-blur-xl transition duration-500"
        style={style}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay group-hover/card:opacity-100"
        style={style}
      >
        <p className="absolute inset-x-0 text-xs h-full break-words whitespace-pre-wrap text-white font-mono font-bold transition duration-500">
          {randomString}
        </p>
      </motion.div>
    </div>
  )
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
export const generateRandomString = (length: number) => {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  )
}
