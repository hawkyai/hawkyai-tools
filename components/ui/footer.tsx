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
                  href="https://boundless-group-558.notion.site/Hawky-ai-Privacy-Policy-7b225ca0295c40a09a365f2fbee46ef0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-9 hover:text-gray-12 transition-colors"
                >
                  Privacy & Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-3/20 pt-8 text-center text-sm text-gray-9">
          <p>© {new Date().getFullYear()} Hawky.ai. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
