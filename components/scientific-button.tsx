"use client"

import type React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { useState } from "react"

interface ScientificButtonProps {
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export function ScientificButton({ href, children, icon, rightIcon }: ScientificButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <HoverBorderGradient
      as={Link}
      href={href}
      containerClassName="rounded-full border-[#ee2a7b]"
      className={`bg-black text-white font-bold flex items-center justify-center py-3 px-6 transition-all duration-300 ${
        isHovered ? "bg-gradient-to-r from-black via-[#1a1a1a] to-[#2a2a2a]" : "bg-black"
      }`}
      gradient="linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span className={`transition-transform duration-300 ${isHovered ? "translate-x-0.5" : ""}`}>{children}</span>
      {rightIcon ? (
        <span className={`ml-1 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}>
          {rightIcon}
        </span>
      ) : (
        <ChevronRight
          className={`h-4 w-4 ml-1 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
        />
      )}
    </HoverBorderGradient>
  )
}
