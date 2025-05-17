"use client"

import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Linkedin, ChevronDown } from "lucide-react"
import { useState } from "react"

interface FooterProps {
  showCreativesToggle?: boolean
  creativesVisible?: boolean
  onToggleCreatives?: (visible: boolean) => void
}

export function Footer({ showCreativesToggle = false, creativesVisible = true, onToggleCreatives }: FooterProps) {
  const [isToolsOpen, setIsToolsOpen] = useState(false)

  return (
    <footer className="border-t border-gray-3/20 bg-black">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center">
              <Image src="/hawky-logo.png" alt="Hawky Logo" width={150} height={40} className="h-8 w-auto" />
            </div>
            <p className="mt-4 text-sm text-gray-9">
              AI-powered creative intelligence for predictable marketing outcomes.
            </p>

            {/* Subtle toggle button for creatives - only shown on homepage */}
            {showCreativesToggle && onToggleCreatives && (
              <button
                onClick={() => onToggleCreatives(!creativesVisible)}
                className="mt-4 flex items-center text-xs text-gray-9 hover:text-gray-12 transition-colors"
              >
                {creativesVisible ? (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Hide floating elements
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Show floating elements
                  </>
                )}
              </button>
            )}

            <div className="mt-6">
              <Link href="#how-it-works" className="text-sm text-gray-9 hover:text-gray-12 transition-colors">
                How Hawky works
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-12">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-9 hover:text-gray-12 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a
                  href="mailto:surender@hawky.ai"
                  className="flex items-center text-gray-9 hover:text-gray-12 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/hawky-ai/jobs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-9 hover:text-gray-12 transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/hawky-ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-9 hover:text-gray-12 transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5 mr-1.5" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-12">Legal</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="https://www.hawky.ai/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-9 hover:text-gray-12 transition-colors"
                >
                  Privacy & Terms
                </a>
              </li>
            </ul>

            {/* Tools section for mobile - only visible on mobile */}
            <div className="md:hidden mt-6">
              <h3 className="text-sm font-medium text-gray-12">Tools</h3>
              <div className="mt-4">
                <button
                  onClick={() => setIsToolsOpen(!isToolsOpen)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-9 hover:text-gray-12 transition-colors"
                >
                  <span>View Tools</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isToolsOpen ? "rotate-180" : ""}`} />
                </button>

                {isToolsOpen && (
                  <ul className="mt-2 space-y-2 text-sm pl-2">
                    <li>
                      <Link href="/adanalyzer" className="text-gray-9 hover:text-gray-12 transition-colors">
                        Ad Analyzer
                      </Link>
                    </li>
                    <li>
                      <Link href="/compliance" className="text-gray-9 hover:text-gray-12 transition-colors">
                        Ad Compliance Checker
                      </Link>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-gray-9">Competitive Intel</span>
                      <span className="text-xs px-2 py-0.5 bg-purple-900/50 text-purple-300 rounded-full">
                        Coming Soon
                      </span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-3/20 pt-8 text-center text-sm text-gray-9">
          <p>© {new Date().getFullYear()} Hawky.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
