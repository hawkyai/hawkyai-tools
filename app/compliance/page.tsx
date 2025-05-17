import type { Metadata } from "next"
import { Header } from "@/components/ui/header"
import HeroSection from "./hero-section"
import ComplianceOptions from "./compliance-options"

export const metadata: Metadata = {
  title: "Ad Compliance Checker | Hawky",
  description: "Check your ads for compliance with various regulatory standards including ASCI, WCAG, IRDAI, and Financial guidelines",
}

export default function CompliancePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <ComplianceOptions />
    </main>
  )
} 