import type React from "react"
import Link from "next/link"
import { ScientificButton } from "@/components/scientific-button"

export default function ComplianceOptions() {
  return (
    <div className="w-full max-w-full px-4 sm:px-8 lg:px-28 mx-auto py-0 mb-16">
      {/* <h2 className="text-3xl text-white font-extrabold mb-12 text-center">Choose a Compliance Standard</h2> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <ComplianceCard
          title="ASCI Checker"
          description="Advertising Standards Council of India"
          imgSrc="/Asci-logo.png"
          imgAlt="ASCI Logo"
          href="/compliance/asci"
          details="Check ads against ASCI ethical advertising guidelines."
        />

        <ComplianceCard
          title="WCAG Checker"
          description="Web Content Accessibility Guidelines"
          imgSrc="/Wcag.png"
          imgAlt="WCAG Logo"
          href="/compliance/wcag"
          details="Ensure ads meet accessibility standards for all users."
        />

        <ComplianceCard
          title="IRDAI Checker"
          description="Insurance Regulatory and Development Authority of India"
          imgSrc="/Irdai-logo.webp"
          imgAlt="IRDAI Logo"
          href="/compliance/irdai"
          details="Verify insurance ads comply with IRDAI regulations."
        />

        <ComplianceCard
          title="SEBI Checker"
          description="Financial Advertisement Guidelines"
          imgSrc="/sebi-logo.png"
          imgAlt="SEBI Logo"
          href="/compliance/finance"
          details="Check financial ads for regulatory compliance."
        />
      </div>
    </div>
  )
}

interface ComplianceCardProps {
  title: string
  description: string
  imgSrc: string
  imgAlt: string
  href: string
  details: string
}

function ComplianceCard({ title, description, imgSrc, imgAlt, href, details }: ComplianceCardProps) {
  return (
    <div className="bg-[#18181b] rounded-xl shadow-lg flex flex-col p-4 sm:p-6 min-h-[240px] sm:min-h-[280px] border border-[#232329] w-full max-w-full">
      <div className="flex items-center mb-3">
        <div className="bg-white/90 p-0 rounded-full mr-3 flex items-center justify-center w-12 h-12 overflow-hidden border border-gray-200">
          <img src={imgSrc} alt={imgAlt} className="w-8 h-8 object-contain rounded" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-gray-400 text-xs font-medium">{description}</p>
        </div>
      </div>

      <p className="text-gray-300 mb-6 flex-grow text-sm font-normal">{details}</p>

      <ScientificButton href={href}>
        Check Compliance
      </ScientificButton>
    </div>
  )
}
