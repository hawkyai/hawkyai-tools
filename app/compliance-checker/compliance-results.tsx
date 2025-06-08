"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Download,
  AlertTriangle,
  CheckCircle,
  Filter,
  Info,
  Award,
  Mail,
  Loader2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { AdTypeResult } from "@/lib/ad-type-detector"
import { ScientificButton } from "@/components/scientific-button"

interface ComplianceResultsProps {
  results: any
  standard: string
  imageUrl: string
  onBack: () => void
  adTypeInfo: AdTypeResult | null
}

export default function ComplianceResults({ results, standard, imageUrl, onBack, adTypeInfo }: ComplianceResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const standardName = getStandardFullName(standard)
  const violations = results.guideline_violations || []

  // Count the number of items by status
  const statusCounts = violations.reduce(
    (acc: Record<string, number>, violation: any) => {
      const status = violation.status.toLowerCase()
      acc[status] = (acc[status] || 0) + 1
      return acc
    },
    { pass: 0, warning: 0, fail: 0 },
  )

  // Filter violations based on active filter
  const filteredViolations = violations.filter((violation: any) => {
    if (activeFilter === "all") return true
    return violation.status.toLowerCase() === activeFilter.toLowerCase()
  })

  // For WCAG, determine the actual compliance level based on all criteria
  let wcagComplianceLevel = "None"
  if (standard === "wcag" && results.wcag_level) {
    // Check if there are any failures in Level A criteria
    const hasLevelAFailures = violations.some(
      (v: any) => v.status.toLowerCase() === "fail" && v.rule && v.rule.includes("(A)"),
    )

    // Check if there are any failures in Level AA criteria
    const hasLevelAAFailures = violations.some(
      (v: any) => v.status.toLowerCase() === "fail" && v.rule && v.rule.includes("(AA)"),
    )

    // Check if there are any failures in Level AAA criteria
    const hasLevelAAAFailures = violations.some(
      (v: any) => v.status.toLowerCase() === "fail" && v.rule && v.rule.includes("(AAA)"),
    )

    // Determine the compliance level
    if (!hasLevelAFailures && !hasLevelAAFailures && !hasLevelAAAFailures) {
      wcagComplianceLevel = "AAA"
    } else if (!hasLevelAFailures && !hasLevelAAFailures) {
      wcagComplianceLevel = "AA"
    } else if (!hasLevelAFailures) {
      wcagComplianceLevel = "A"
    } else {
      wcagComplianceLevel = "None"
    }
  }

  const handleDownload = useCallback(async () => {
    setIsGeneratingPdf(true)
    setShowEmailModal(true)
  }, [])

  const handleSendReport = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please provide an email address to receive the report.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    toast({
      title: "Preparing report",
      description: "Your compliance report is being generated...",
    })

    try {
      // Dynamically import jsPDF
      const jsPDF = (await import("jspdf")).default

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20

      // Add logo
      try {
        const logo = await new Promise((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = "Anonymous"
          img.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")
            if (ctx) {
              ctx.drawImage(img, 0, 0)
              resolve(canvas.toDataURL("image/png"))
            } else {
              reject(new Error("Could not get canvas context"))
            }
          }
          img.onerror = () => reject(new Error("Failed to load logo"))
          img.src = "/hawky-logo.png"
        })

        pdf.addImage(logo as string, "PNG", 20, 15, 25, 25)
      } catch (error) {
        console.error("Error loading logo:", error)
        // Fallback to text if logo fails to load
        pdf.setFontSize(24)
        pdf.setTextColor(255, 255, 255)
        pdf.text("HAWKY", 20, 30)
      }

      // Add title
      pdf.setFontSize(24)
      pdf.setTextColor(255, 255, 255)
      pdf.text("Hawky Compliance Report", 105, 35, { align: "center" })

      // Add subtitle
      pdf.setFontSize(14)
      pdf.setTextColor(200, 200, 200)
      pdf.text(`Standard: ${standardName}`, 105, 45, { align: "center" })

      // Add separator line
      pdf.setDrawColor(100, 100, 100)
      pdf.line(margin, 50, pageWidth - margin, 50)

      // Add image
      if (imageUrl) {
        try {
          const img = await new Promise((resolve, reject) => {
            const image = new Image()
            image.crossOrigin = "Anonymous"
            image.onload = () => {
              const canvas = document.createElement("canvas")
              const maxWidth = pageWidth - (margin * 2)
              const maxHeight = 100
              const ratio = Math.min(maxWidth / image.width, maxHeight / image.height)
              canvas.width = image.width * ratio
              canvas.height = image.height * ratio
              const ctx = canvas.getContext("2d")
              if (ctx) {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                resolve(canvas.toDataURL("image/jpeg", 0.8))
              } else {
                reject(new Error("Could not get canvas context"))
              }
            }
            image.onerror = () => reject(new Error("Failed to load image"))
            image.src = imageUrl
          })

          pdf.addImage(img as string, "JPEG", margin, 60, pageWidth - (margin * 2), 100)
        } catch (error) {
          console.error("Error adding image:", error)
          pdf.setTextColor(255, 0, 0)
          pdf.text("Error: Could not load image", margin, 70)
        }
      }

      // Add compliance summary
      pdf.setFontSize(16)
      pdf.setTextColor(255, 255, 255)
      pdf.text("Compliance Summary", margin, 170)

      if (results.compliance_summary) {
        pdf.setFontSize(12)
        pdf.setTextColor(200, 200, 200)
        const splitSummary = pdf.splitTextToSize(results.compliance_summary, pageWidth - (margin * 2))
        pdf.text(splitSummary, margin, 180)
      }

      // Add overall rating
      if (results.overall_rating) {
        pdf.setFontSize(14)
        pdf.setTextColor(255, 255, 255)
        pdf.text("Overall Rating:", margin, 200)
        pdf.setTextColor(results.overall_rating === "Compliant" ? 0 : 255, results.overall_rating === "Compliant" ? 255 : 0, 0)
        pdf.text(results.overall_rating, margin + 40, 200)
      }

      // Add statistics
      pdf.setFontSize(14)
      pdf.setTextColor(255, 255, 255)
      pdf.text("Statistics:", margin, 220)
      pdf.setFontSize(12)
      pdf.setTextColor(200, 200, 200)
      pdf.text(`Passed: ${statusCounts.pass || 0}`, margin, 230)
      pdf.text(`Warnings: ${statusCounts.warning || 0}`, margin + 50, 230)
      pdf.text(`Failed: ${statusCounts.fail || 0}`, margin + 100, 230)

      // Add WCAG compliance level if applicable
      if (standard === "wcag" && wcagComplianceLevel) {
        pdf.setFontSize(14)
        pdf.setTextColor(255, 255, 255)
        pdf.text("WCAG Compliance Level:", margin, 250)
        pdf.setTextColor(0, 255, 0)
        pdf.text(wcagComplianceLevel, margin + 70, 250)
      }

      // Add violations table
      pdf.setFontSize(16)
      pdf.setTextColor(255, 255, 255)
      pdf.text("Violations", margin, 270)

      // Table headers
      pdf.setFontSize(12)
      pdf.setTextColor(200, 200, 200)
      pdf.text("Status", margin, 280)
      pdf.text("Rule", margin + 30, 280)
      pdf.text("Description", margin + 100, 280)

      // Table content
      let y = 290
      violations.forEach((violation: any) => {
        if (y > pageHeight - margin) {
          pdf.addPage()
          y = margin + 20
        }

        pdf.setTextColor(
          violation.status.toLowerCase() === "pass" ? 0 : violation.status.toLowerCase() === "warning" ? 255 : 255,
          violation.status.toLowerCase() === "pass" ? 255 : violation.status.toLowerCase() === "warning" ? 255 : 0,
          0
        )
        pdf.text(violation.status.toUpperCase(), margin, y)
        pdf.setTextColor(200, 200, 200)
        pdf.text(violation.rule || "", margin + 30, y)
        const splitDesc = pdf.splitTextToSize(violation.description || "", pageWidth - (margin * 2) - 130)
        pdf.text(splitDesc, margin + 100, y)
        y += splitDesc.length * 7 + 5
      })

      // Add footer
      pdf.setFontSize(10)
      pdf.setTextColor(150, 150, 150)
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, pageHeight - 10)

      // Get the PDF as base64
      const pdfBase64 = pdf.output('datauristring')

      // Send the PDF via email
      const response = await fetch("/api/send-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          pdfBase64,
          standard,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send report")
      }

      toast({
        title: "Report sent",
        description: "Your compliance report has been sent to your email.",
      })
      setShowEmailModal(false)
      setEmail("")
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Failed to send report",
        description: "There was an error sending your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPdf(false)
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-8" id="compliance-results-content">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onBack} className="text-gray-400 hover:text-white rounded-full px-6 py-2">
          ← Back to Upload
        </Button>
        <Button variant="outline" onClick={handleDownload} className="flex items-center gap-2 rounded-full px-6 py-2 text-gray-400 hover:text-white">
          <Download className="h-4 w-4" /> {isGeneratingPdf ? "Preparing..." : "Download Report"}
        </Button>
      </div>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="bg-[#111827] border border-gray-800/50 text-white sm:max-w-[425px] rounded-lg shadow-2xl">
          <DialogHeader className="space-y-3 pb-4 border-b border-gray-800/50">
            <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-[#6228d7] via-[#ee2a7b] to-[#6228d7] bg-clip-text text-transparent">
              Get Your Report
            </DialogTitle>
            <p className="text-sm text-gray-400">Enter your email address to receive the compliance report.</p>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-black/50 border-gray-800 text-white placeholder:text-gray-500 h-11 rounded-md focus:ring-2 focus:ring-[#6228d7] focus:border-[#6228d7]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-white border-gray-800 hover:border-gray-700 hover:bg-gray-800/50 h-11 px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendReport}
                disabled={isSending}
                className="bg-gradient-to-r from-[#6228d7] via-[#ee2a7b] to-[#6228d7] text-white hover:opacity-90 h-11 px-6 font-medium"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full py-8 px-0 overflow-x-hidden">
        <div className="flex flex-col gap-6 w-full">
          {/* Image Preview and Summary - Now at the top */}
          <div className="grid md:grid-cols-2 gap-6 w-full">
            <div className="hawky-card p-4 sm:p-6 overflow-hidden w-full">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Image Preview</h2>
              <div className="relative rounded-md overflow-hidden bg-white">
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Ad preview"
                    className="w-full object-contain"
                    style={{ maxHeight: "400px" }}
                  />
                )}
              </div>
              {/* <p className="text-gray-400 mt-4 text-sm">Highlighted areas show compliance issues</p> */}
            </div>

            <div className="hawky-card p-4 sm:p-6 overflow-hidden w-full">
              {adTypeInfo && (
                <div className="mb-6 p-4 bg-black/30 rounded-lg border border-gray-800/50">
                  <h3 className="text-lg font-medium mb-3 flex items-center text-white">
                    <Info className="h-4 w-4 mr-2 text-white"/> Ad Information
                  </h3>
                  <div className="space-y-2">
                    <p className="text-sm text-white">
                      <span className="text-gray-400">Type:</span>{" "}
                      <span className="text-white font-medium capitalize">{adTypeInfo.ad_type}</span>
                    </p>
                    <p className="text-sm text-white">
                      <span className="text-gray-400">Description:</span>{" "}
                      <span className="text-white">{adTypeInfo.description}</span>
                    </p>
                  </div>
                </div>
              )}

              {standard === "wcag" && (
                <div className="mb-6 p-4 bg-black/30 rounded-lg border border-gray-800/50">
                  <h3 className="text-lg font-medium mb-3 flex items-center text-white">
                    <Award className="h-4 w-4 mr-2 text-white" /> WCAG Compliance Level
                  </h3>
                  <div className="flex items-center mb-2">
                    <span className={`hawky-badge hawky-badge-${wcagComplianceLevel.toLowerCase()}` + " text-white"}>
                      {wcagComplianceLevel === "None" ? "Not WCAG Compliant" : `WCAG ${wcagComplianceLevel} Compliant`}
                    </span>
                  </div>
                  <p className="text-sm text-white mt-2">
                    {wcagComplianceLevel === "None"
                      ? "This ad does not meet the minimum Level A compliance requirements."
                      : wcagComplianceLevel === "A"
                        ? "This ad meets all Level A compliance requirements but not all Level AA requirements."
                        : wcagComplianceLevel === "AA"
                          ? "This ad meets all Level A and AA compliance requirements but not all Level AAA requirements."
                          : "This ad meets all Level A, AA, and AAA compliance requirements."}
                  </p>
                </div>
              )}

              <h3 className="text-lg font-medium mb-3 text-white">Compliance Summary</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-3 bg-green-900/10 rounded-lg border border-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-400 mb-1" />
                  <span className="text-xs font-semibold text-green-400">Passed</span>
                  <span className="text-xl font-bold text-green-400">{statusCounts.pass || 0}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-yellow-900/10 rounded-lg border border-yellow-900/20">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mb-1" />
                  <span className="text-xs font-semibold text-yellow-400">Warnings</span>
                  <span className="text-xl font-bold text-yellow-400">{statusCounts.warning || 0}</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-red-900/10 rounded-lg border border-red-900/20">
                  <AlertTriangle className="h-5 w-5 text-red-400 mb-1" />
                  <span className="text-xs font-semibold text-red-400">Failed</span>
                  <span className="text-xl font-bold text-red-400">{statusCounts.fail || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Analysis - Now below as a full-width section */}
          <div className="hawky-card p-4 sm:p-6 overflow-hidden w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Compliance Analysis for {standardName}</h2>

            {results.compliance_summary && (
              <div className="mb-6 p-4 bg-black/30 rounded-lg border border-gray-800/50">
                <p className="text-white break-words">{results.compliance_summary}</p>
                {results.overall_rating && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Overall Rating:</span>
                    <span
                      className={`hawky-badge ${
                        results.overall_rating === "Compliant"
                          ? "hawky-badge-pass text-green-400 border-green-400"
                            : "hawky-badge-fail text-red-400 border-red-400"
                      }`}
                    >
                      {results.overall_rating === "Partially Compliant" ? "Non-compliant" : results.overall_rating}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div>
              <Tabs defaultValue="all" onValueChange={setActiveFilter} value={activeFilter}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h3 className="text-lg font-medium flex items-center text-white">
                    <Filter className="h-4 w-4 mr-2 text-white" /> Filter Results
                  </h3>
                  <TabsList className="bg-black/50 border border-gray-800/50 w-full sm:w-auto">
                    <TabsTrigger value="all" className="data-[state=active]:bg-gray-800 flex-1 sm:flex-auto text-white">
                      All ({violations.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="pass"
                      className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-400 flex-1 sm:flex-auto"
                    >
                      Passed ({statusCounts.pass || 0})
                    </TabsTrigger>
                    <TabsTrigger
                      value="warning"
                      className="data-[state=active]:bg-yellow-900/30 data-[state=active]:text-yellow-400 flex-1 sm:flex-auto"
                    >
                      Warnings ({statusCounts.warning || 0})
                    </TabsTrigger>
                    <TabsTrigger
                      value="fail"
                      className="data-[state=active]:bg-red-900/30 data-[state=active]:text-red-400 flex-1 sm:flex-auto"
                    >
                      Failed ({statusCounts.fail || 0})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="all" className="mt-0">
                  {renderViolations(filteredViolations, expandedSections, toggleSection, standard)}
                </TabsContent>
                <TabsContent value="pass" className="mt-0">
                  {renderViolations(filteredViolations, expandedSections, toggleSection, standard)}
                </TabsContent>
                <TabsContent value="warning" className="mt-0">
                  {renderViolations(filteredViolations, expandedSections, toggleSection, standard)}
                </TabsContent>
                <TabsContent value="fail" className="mt-0">
                  {renderViolations(filteredViolations, expandedSections, toggleSection, standard)}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="hawky-card p-4 sm:p-6 mt-6 text-center w-full">
          <h3 className="text-xl font-bold mb-3 text-white">
            <span className="gradient-text">Want a fully compliant ad with verified by Hawky?</span>
          </h3>
          <p className="text-white mb-4">
            Sign in to the platform to access our advanced compliance tools and get the Hawky verification badge.
          </p>
          <Button className="gradient-button rounded-full px-8 py-6 text-lg">Sign in to Hawky Platform</Button>
        </div>
      </div>
    </div>
  )
}

function renderViolations(
  violations: any[],
  expandedSections: Record<string, boolean>,
  toggleSection: (id: string) => void,
  standard: string
) {
  if (violations.length === 0) {
    return (
      <div className="p-4 bg-black/30 rounded-lg border border-gray-800/50">
        <p className="text-gray-400 text-center">No items match the selected filter</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {violations.map((violation: any, index: number) => {
        const isExpanded = expandedSections[violation.id] || false
        const isWarning = violation.status.toLowerCase() === "warning"
        const isFail = violation.status.toLowerCase() === "fail"
        const isPass = violation.status.toLowerCase() === "pass"

        return (
          <div key={index} className="border border-gray-800/30 rounded-lg overflow-hidden hawky-card" data-violation-id={violation.id}>
            <div
              className="flex items-start justify-between cursor-pointer p-4 hover:bg-black/50 transition-colors"
              onClick={() => toggleSection(violation.id)}
            >
              <div className="flex items-start gap-2 overflow-hidden">
                {isFail && <AlertTriangle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />}
                {isWarning && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />}
                {isPass && <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />}
                <div className="min-w-0">
                  <h3
                    className={`font-medium text-lg truncate ${
                      isFail ? "text-red-500" : isWarning ? "text-yellow-400" : "text-green-400"
                    }`}
                  >
                    {standard === "wcag" ? violation.description : violation.rule}
                  </h3>
                  <span
                    className={`hawky-badge hawky-badge-outline ${
                      isFail ? "hawky-badge-fail text-white" : isWarning ? "hawky-badge-warning text-white" : "hawky-badge-pass text-white"
                    }`}
                  >
                    {violation.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 ml-2">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            <div className={`violation-details p-4 bg-black/30 ${isExpanded ? '' : 'hidden'}`}>
              <p className="text-gray-300 mb-4 break-words">
                {violation.description}
                {isFail && violation.rule?.toLowerCase().includes("text") && " Text embedded in images makes content inaccessible to screen readers and violates accessibility guidelines. Consider using actual text elements instead."}
                {isFail && violation.rule?.toLowerCase().includes("color") && " Insufficient color contrast makes content difficult to read for users with visual impairments. Ensure text has a contrast ratio of at least 4.5:1 against its background."}
                {isFail && violation.rule?.toLowerCase().includes("alt") && " Missing alt text prevents screen reader users from understanding image content. Add descriptive alt text to all images."}
                {isFail && !violation.rule?.toLowerCase().includes("text") && !violation.rule?.toLowerCase().includes("color") && !violation.rule?.toLowerCase().includes("alt") && " This issue needs to be addressed to ensure compliance with accessibility standards."}
                {isWarning && " While not critical, addressing this would improve overall accessibility and user experience."}
                {isPass && " This element meets all accessibility requirements."}
              </p>

              {violation.suggestedFix && !isPass && (
                <div className="bg-black/50 p-4 rounded-md mt-4 border border-gray-800/30">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">AI-Suggested Fix:</h4>
                  <p className="text-sm text-gray-400 break-words">{violation.suggestedFix}</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function getStandardFullName(standard: string): string {
  switch (standard) {
    case "asci":
      return "ASCI"
    case "wcag":
      return "WCAG"
    case "irdai":
      return "IRDAI"
    case "finance":
      return "Finance"
    default:
      return standard.toUpperCase()
  }
}
