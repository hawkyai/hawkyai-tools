"use client"

import Link from "next/link"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="w-full bg-black py-12 px-4 md:px-0">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-0">
        {/* Left Section */}
        <div className="flex flex-col items-start md:w-1/3">
          <Image
            src="/compliance-checker/hawky-logo.png"
            alt="Hawky Logo"
            width={80}
            height={80}
            className="mb-4"
            priority
          />
          <p className="text-white text-base mb-4">AI powered intelligence for better marketing outcomes</p>
          <p className="text-gray-400 text-sm mb-1">©2025 Hawky.ai. All rights reserved</p>
          <div className="flex flex-col space-y-1">
            <Link href="https://boundless-group-558.notion.site/Hawky-ai-Privacy-Policy-7b225ca0295c40a09a365f2fbee46ef0" target="_blank" className="text-gray-400 text-sm hover:underline">Privacy Policy</Link>
            <Link href="https://boundless-group-558.notion.site/Hawky-ai-Privacy-Policy-7b225ca0295c40a09a365f2fbee46ef0" target="_blank" className="text-gray-400 text-sm hover:underline">Terms and Conditions</Link>
          </div>
        </div>

        {/* Center Section (empty for spacing) */}
        <div className="hidden md:block md:w-1/3"></div>

        {/* Right Section */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-24 md:w-1/3 justify-end">
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://www.linkedin.com/company/hawky-ai/jobs/" target="_blank" className="text-gray-400 hover:underline">Careers</Link>
              </li>
              <li>
                <Link href="https://www.linkedin.com/company/hawky-ai/posts/?feedView=all" target="_blank" className="text-gray-400 hover:underline">LinkedIn</Link>
              </li>
            </ul>
          </div>
          {/* Meet The Founders */}
          <div>
            <h3 className="text-white font-semibold mb-3">Meet The Founders</h3>
            <ul className="space-y-2">
              <li>
                <Link href="https://www.linkedin.com/in/say2surender/" target="_blank" className="text-gray-400 hover:underline">Surender Selvaraj</Link>
              </li>
              <li>
                <Link href="https://www.linkedin.com/in/dj-sri-vigneshwar/" target="_blank" className="text-gray-400 hover:underline">DJ Sri Vigneshwar</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
