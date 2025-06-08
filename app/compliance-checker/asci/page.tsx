"use client"

import { Header } from "@/components/ui/header"
import ComplianceChecker from "../compliance-checker"

export default function ASCIPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <ComplianceChecker defaultStandard="asci" fixedStandard={true} />
        </div>
      </div>
    </main>
  )
} 