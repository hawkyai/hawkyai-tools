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
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    toast({
      title: "Preparing report",
      description: "Your compliance report is being generated...",
    })

    try {
      // Dynamically import the jsPDF library
      const jsPDF = (await import("jspdf")).default
      const autoTable = (await import("jspdf-autotable")).default

      // Create a new PDF document
      const doc = new jsPDF()

      // Add title
      doc.setFontSize(20)
      doc.text("Hawky Compliance Report", 105, 15, { align: "center" })

      // Add subtitle
      doc.setFontSize(16)
      doc.text(standardName, 105, 25, { align: "center" })

      // Add the uploaded image
      if (imageUrl) {
        try {
          // Convert base64 or URL to image data
          const imgData = await new Promise((resolve, reject) => {
            const img = new Image()
            img.crossOrigin = "Anonymous"
            img.onload = () => {
              const canvas = document.createElement("canvas")
              canvas.width = img.width
              canvas.height = img.height
              const ctx = canvas.getContext("2d")
              ctx?.drawImage(img, 0, 0)
              resolve(canvas.toDataURL("image/jpeg", 0.8))
            }
            img.onerror = reject
            img.src = imageUrl
          })

          // Calculate image dimensions to fit page width while maintaining aspect ratio
          const pageWidth = doc.internal.pageSize.getWidth()
          const margin = 20
          const maxWidth = pageWidth - (margin * 2)
          const imgWidth = Math.min(maxWidth, 400) // Limit maximum width
          const imgHeight = (imgWidth * 0.75) // Assuming 4:3 aspect ratio

          // Add image to PDF
          doc.addImage(imgData as string, "JPEG", margin, 35, imgWidth, imgHeight)
          
          // Adjust the starting position for the next content
          const contentStartY = 35 + imgHeight + 10
          
          // Add compliance summary
          doc.setFontSize(14)
          doc.text("Compliance Summary", 14, contentStartY)

          doc.setFontSize(12)
          const summaryText = results.compliance_summary || "No summary available"
          const splitSummary = doc.splitTextToSize(summaryText, 180)
          doc.text(splitSummary, 14, contentStartY + 10)

          // Add overall rating
          if (results.overall_rating) {
            doc.text(`Overall Rating: ${results.overall_rating}`, 14, contentStartY + 20)
          }

          // Add statistics
          doc.text(`Passed: ${statusCounts.pass || 0}`, 14, contentStartY + 30)
          doc.text(`Failed: ${statusCounts.fail || 0}`, 50, contentStartY + 30)

          // Add WCAG compliance level if applicable
          if (standard === "wcag") {
            doc.text(`WCAG Compliance Level: ${wcagComplianceLevel}`, 14, contentStartY + 40)
          }

          // Add violations table
          doc.setFontSize(14)
          doc.text("Compliance Details", 14, contentStartY + 50)

          // Prepare table data
          const tableData = violations.map((v: any) => [
            v.rule || "N/A",
            v.status.toUpperCase(),
            v.description || "No description",
            v.suggestedFix || "N/A",
          ])

          // Add table
          autoTable(doc, {
            startY: contentStartY + 55,
            head: [["Rule", "Status", "Description", "Suggested Fix"]],
            body: tableData,
            headStyles: { fillColor: [51, 51, 51] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            styles: { overflow: "linebreak", cellWidth: "auto" },
            columnStyles: {
              0: { cellWidth: 40 },
              1: { cellWidth: 20 },
              2: { cellWidth: 70 },
              3: { cellWidth: 60 },
            },
          })
        } catch (error) {
          console.error("Error adding image to PDF:", error)
          // Continue with PDF generation without the image
        }
      }

      // Add footer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(10)
        doc.text(
          `Generated by Hawky Compliance Checker • ${new Date().toLocaleDateString()}`,
          105,
          doc.internal.pageSize.height - 10,
          { align: "center" },
        )
      }

      // Save the PDF
      doc.save(`hawky-${standard}-compliance-report.pdf`)

      toast({
        title: "Report downloaded",
        description: "Your compliance report has been downloaded successfully",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "Download failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPdf(false)
    }
  }, [results, standard, standardName, statusCounts, violations, wcagComplianceLevel, imageUrl])

  return (
    <div className="w-full py-8 px-0 overflow-x-hidden">
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 outline-button rounded-full text-white">
          <ArrowLeft className="h-4 w-4 text-white" /> Back
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 outline-button rounded-full"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 text-white" /> {isGeneratingPdf ? "Preparing..." : "Download Report"}
          </Button>
        </div>
      </div>

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
                {renderViolations(filteredViolations, expandedSections, toggleSection)}
              </TabsContent>
              <TabsContent value="pass" className="mt-0">
                {renderViolations(filteredViolations, expandedSections, toggleSection)}
              </TabsContent>
              <TabsContent value="warning" className="mt-0">
                {renderViolations(filteredViolations, expandedSections, toggleSection)}
              </TabsContent>
              <TabsContent value="fail" className="mt-0">
                {renderViolations(filteredViolations, expandedSections, toggleSection)}
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
  )
}

function renderViolations(
  violations: any[],
  expandedSections: Record<string, boolean>,
  toggleSection: (id: string) => void,
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
          <div key={index} className="border border-gray-800/30 rounded-lg overflow-hidden hawky-card">
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
                    {violation.rule}
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

            {isExpanded && (
              <div className="p-4 bg-black/30">
                <p className="text-gray-300 mb-4 break-words">
                  {violation.description}
                  {isFail && violation.rule?.toLowerCase().includes("text") && " Text embedded in images makes content inaccessible to screen readers and violates accessibility guidelines. Consider using actual text elements instead."}
                  {isFail && violation.rule?.toLowerCase().includes("color") && " Insufficient color contrast makes content difficult to read for users with visual impairments. Ensure text has a contrast ratio of at least 4.5:1 against its background."}
                  {isFail && violation.rule?.toLowerCase().includes("alt") && " Missing alt text prevents screen reader users from understanding image content. Add descriptive alt text to all images."}
                  {isFail && !violation.rule?.toLowerCase().includes("text") && !violation.rule?.toLowerCase().includes("color") && !violation.rule?.toLowerCase().includes("alt") && " This issue needs to be addressed to ensure compliance with accessibility standards."}
                  {isWarning && " While not critical, addressing this would improve overall accessibility and user experience."}
                  {isPass && " This element meets all accessibility requirements."}
                </p>

                {violation.rule && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 break-words">{violation.rule}</p>
                  </div>
                )}

                {violation.suggestedFix && !isPass && (
                  <div className="bg-black/50 p-4 rounded-md mt-4 border border-gray-800/30">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">AI-Suggested Fix:</h4>
                    <p className="text-sm text-gray-400 break-words">{violation.suggestedFix}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function getStandardFullName(standard: string): string {
  switch (standard) {
    case "asci":
      return "ASCI (Advertising Standards Council of India)"
    case "wcag":
      return "WCAG (Web Content Accessibility Guidelines)"
    case "irdai":
      return "IRDAI (Insurance Regulatory and Development Authority of India)"
    case "finance":
      return "Financial Advertisement Guidelines"
    default:
      return standard.toUpperCase()
  }
}
