import type { Metadata } from "next"
import { Header } from "@/components/ui/header"
import HeroSection from "./hero-section"
import ComplianceOptions from "./compliance-options"
import { Upload, Sparkles, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Ad Compliance Checker | Hawky",
  description: "Check your ads for compliance with various regulatory standards including ASCI, WCAG, IRDAI, and Financial guidelines",
}



export default function CompliancePage() {
  return (
    <main className="min-h-screen flex flex-col bg-black relative overflow-hidden">
      <Header />
      <HeroSection />
      <ComplianceOptions />
    </main>
  )
} 