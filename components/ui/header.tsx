"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"

export function Header() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null;

  return (
    <header className="w-full bg-black py-4 px-4 md:px-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-0">
        {/* Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link href="/" className="flex items-center">
            <Image
              src="/compliance-checker/hawky-logo.png"
              alt="Hawky Logo"
              width={120}
              height={120}
              className="w-16 h-16 md:w-24 md:h-24 object-contain mr-2"
              sizes="(max-width: 768px) 64px, 96px"
              priority
            />
          </Link>
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded focus:outline-none text-white"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>

        {/* Desktop nav and button */}
        <div className="hidden md:flex flex-1 items-center justify-between w-full">
          <nav className="flex-1 flex justify-center">
            <Link
              href="/resources"
              className="text-gray-300 text-base hover:text-white transition-colors"
            >
              Resources
            </Link>
          </nav>
          <div className="flex items-center min-w-[180px] justify-end">
            <Link
              href="/get-demo"
              className="bg-white text-black font-medium rounded-xl px-8 py-2 text-base shadow-none hover:bg-gray-100 transition"
            >
              Get Demo
            </Link>
          </div>
        </div>

        {/* Mobile nav and button (dropdown) */}
        {mobileMenuOpen && (
          <div className="w-full flex flex-col items-center gap-4 mt-4 md:hidden animate-fade-in">
            <nav className="w-full flex justify-center">
              <Link
                href="/resources"
                className="text-gray-300 text-base hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Resources
              </Link>
            </nav>
            <div className="w-full flex justify-center">
              <Link
                href="/get-demo"
                className="bg-white text-black font-medium rounded-xl px-8 py-2 text-base shadow-none hover:bg-gray-100 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Demo
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
