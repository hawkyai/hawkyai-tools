"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null;

  return (
    <header className="w-full bg-black py-4 px-4 md:px-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-0">
        {/* Top: Logo (centered on mobile, left on desktop) */}
        <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
          <Link href="/" className="flex items-center">
            <Image
              src="/compliance-checker/hawky-logo.png"
              alt="Hawky Logo"
              width={36}
              height={36}
              className="mr-2"
              priority
            />
            <span className="text-white text-2xl font-bold ml-1">hawky</span>
          </Link>
        </div>

        {/* Center: Nav link(s) (centered on all screens) */}
        <nav className="w-full md:w-auto flex justify-center order-2 md:order-none">
          <Link
            href="/resources"
            className="text-gray-300 text-base hover:text-white transition-colors"
          >
            Resources
          </Link>
        </nav>

        {/* Right: Get Demo button (centered on mobile, right on desktop) */}
        <div className="w-full md:w-auto flex justify-center md:justify-end mt-2 md:mt-0">
          <Link
            href="/get-demo"
            className="bg-white text-black font-medium rounded-xl px-8 py-2 text-base shadow-none hover:bg-gray-100 transition"
          >
            Get Demo
          </Link>
        </div>
      </div>
    </header>
  )
}
