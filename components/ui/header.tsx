"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronDown, Menu } from "lucide-react"
import { ScientificButton } from "@/components/scientific-button"
import { Link as ScrollLink } from 'react-scroll'
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false)
  const router = useRouter();
  const pathname = usePathname();

  // Handle mouse enter on dropdown
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsToolsOpen(true)
  }

  // Handle mouse leave on dropdown with a small delay
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsToolsOpen(false)
    }, 300) // Small delay to make the interaction smoother
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleHowHawkyWorksClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname !== "/") {
      router.push("/#how-it-works");
    } else {
      // If already on home, use smooth scroll
      const el = document.getElementById("how-it-works");
      if (el) {
        const headerOffset = 80; // Adjust this value based on your header height
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-[calc(100%-2rem)] border border-gray-3/20 bg-black/80 backdrop-blur-sm rounded-xl mx-auto max-w-[1300px] my-4">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <img src="/hawky-logo.png" alt="Hawky Logo" width={200} height={55} className="h-12 w-auto" />
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {pathname === "/" ? (
            <button
              onClick={handleHowHawkyWorksClick}
              className="text-sm font-medium text-gray-9 hover:text-gray-12 transition-colors cursor-pointer"
            >
              How Hawky works
            </button>
          ) : (
            <a
              href="/#how-it-works"
              onClick={handleHowHawkyWorksClick}
              className="text-sm font-medium text-gray-9 hover:text-gray-12 transition-colors cursor-pointer"
            >
            How Hawky works
            </a>
          )}
          <Link
            href="/creative-ecosystem"
            className="text-sm font-medium text-gray-9 hover:text-gray-12 transition-colors"
          >
            Creative Ecosystem
          </Link>

          {/* Tools Dropdown - hover to open */}
          <div className="relative" ref={dropdownRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-9 hover:text-gray-12 transition-colors"
              aria-expanded={isToolsOpen}
              aria-haspopup="true"
            >
              Tools
              <ChevronDown className={`h-4 w-4 transition-transform ${isToolsOpen ? "rotate-180" : ""}`} />
            </button>

            {isToolsOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-black/90 border border-gray-3/30 backdrop-blur-sm overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-9">
                  <span className="flex-1">Ad Compliance Checker</span>
                  <span className="text-xs px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full">Coming Soon</span>
                </div>
                <div className="py-1">
                  <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-9 hover:bg-gray-800 hover:text-white transition-colors">
                    <span>Ad Analyzer</span>
                    <span className="text-xs px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full">Coming Soon</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
        {/* Desktop Get Demo button */}
        <div className="hidden md:flex items-center gap-4">
          <ScientificButton href="/get-demo">Get Demo</ScientificButton>
        </div>
        {/* Mobile Get Demo button and hamburger for Tools */}
        <div className="md:hidden flex items-center gap-2 h-12">
          <div className="flex items-center h-9">
            <ScientificButton href="/get-demo">
              <span className="text-sm">Get Demo</span>
            </ScientificButton>
          </div>
          <button
            className="p-2 rounded-md text-gray-9 hover:text-white focus:outline-none"
            aria-label="Open tools menu"
            onClick={() => setIsMobileToolsOpen((open) => !open)}
          >
            <Menu className="h-7 w-7" />
          </button>
        </div>
        {/* Mobile menu overlay */}
        {isMobileToolsOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 md:hidden" onClick={() => setIsMobileToolsOpen(false)}>
            <div className="mt-24 w-11/12 max-w-xs rounded-xl shadow-2xl bg-black border border-gray-3/30 backdrop-blur-lg overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex flex-col py-2">
                <div className="flex items-center justify-between px-6 py-4 text-lg text-gray-9">
                  <span className="flex-1 font-medium">Ad Compliance Checker</span>
                  <span className="text-xs px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full">Coming Soon</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4 text-lg text-gray-9 hover:bg-gray-800 hover:text-white transition-colors">
                  <span>Ad Analyzer</span>
                  <span className="text-xs px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
