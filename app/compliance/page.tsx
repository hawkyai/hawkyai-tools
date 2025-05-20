import type { Metadata } from "next"
import { Header } from "@/components/ui/header"
import HeroSection from "./hero-section"
import ComplianceOptions from "./compliance-options"
import { Spotlight } from "@/components/ui/spotlight-new"
import { Upload, Sparkles, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Ad Compliance Checker | Hawky",
  description: "Check your ads for compliance with various regulatory standards including ASCI, WCAG, IRDAI, and Financial guidelines",
}



export default function CompliancePage() {
  return (
    <main className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      {/* Spotlight effect */}
      <Spotlight
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(138, 80, 155, 0.15) 0, rgba(138, 80, 155, 0.05) 50%, rgba(138, 80, 155, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.12) 0, rgba(138, 80, 155, 0.04) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, rgba(138, 80, 155, 0.1) 0, rgba(83, 133, 116, 0.05) 80%, transparent 100%)"
      />
      <Header />
      <HeroSection />
      <ComplianceOptions />
    </main>
  )
} 