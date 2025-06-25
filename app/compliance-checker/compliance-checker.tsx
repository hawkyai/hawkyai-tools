"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Sparkles, AlertCircle, InfoIcon } from "lucide-react"
import ComplianceResults from "./compliance-results"
import LoadingState from "./loading-state"
import { checkAsciCompliance } from "@/lib/asci-checker"
import { checkWcagCompliance } from "@/lib/wcag-checker"
import { toast } from "@/components/ui/use-toast"
import { checkIrdaiCompliance } from "@/lib/irdai-checker"
import { checkFinanceCompliance } from "@/lib/finance-checker"
import { detectAdType, type AdTypeResult } from "@/lib/ad-type-detector"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { SimpleEmailPopup } from "@/components/simple-email-popup"

// Add TypeScript declaration for window.dataLayer
declare global {
  interface Window {
    dataLayer?: any[];
  }
}

// Analytics tracking function
const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData
    });
  }
}

type ComplianceStandard = "asci" | "wcag" | "irdai" | "finance"
type AnalysisState = "idle" | "validating" | "loading" | "complete"

interface ComplianceCheckerProps {
  defaultStandard?: ComplianceStandard
  fixedStandard?: boolean
  hideTitleDescription?: boolean
}

export default function ComplianceChecker({ defaultStandard = "asci", fixedStandard = false, hideTitleDescription = false }: ComplianceCheckerProps) {
  const router = useRouter()
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard>(defaultStandard)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle")
  const [results, setResults] = useState<any>(null)
  const [adTypeError, setAdTypeError] = useState<string | null>(null)
  const [adTypeInfo, setAdTypeInfo] = useState<AdTypeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showEmailPopup, setShowEmailPopup] = useState(false)
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  // Remove routing from useEffect
  useEffect(() => {
    // No routing here anymore
    trackEvent('compliance_standard_changed', {
      standard: selectedStandard
    });
  }, [selectedStandard, defaultStandard, router])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file')
        trackEvent('compliance_file_error', {
          error_type: 'invalid_file_type',
          file_type: selectedFile.type
        });
        return
      }
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB')
        trackEvent('compliance_file_error', {
          error_type: 'file_too_large',
          file_size: selectedFile.size
        });
        return
      }
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      setAdTypeError(null)
      setError(null)
      trackEvent('compliance_file_uploaded', {
        file_type: selectedFile.type,
        file_size: selectedFile.size
      });
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      // Validate file type
      if (!droppedFile.type.startsWith('image/')) {
        setError('Please upload an image file')
        trackEvent('compliance_file_error', {
          error_type: 'invalid_file_type',
          file_type: droppedFile.type,
          upload_method: 'drag_and_drop'
        });
        return
      }
      // Validate file size (max 10MB)
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB')
        trackEvent('compliance_file_error', {
          error_type: 'file_too_large',
          file_size: droppedFile.size,
          upload_method: 'drag_and_drop'
        });
        return
      }
      setFile(droppedFile)
      const url = URL.createObjectURL(droppedFile)
      setPreviewUrl(url)
      setAdTypeError(null)
      setError(null)
      trackEvent('compliance_file_uploaded', {
        file_type: droppedFile.type,
        file_size: droppedFile.size,
        upload_method: 'drag_and_drop'
      });
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const validateAdTypeForStandard = async () => {
    if (!file) return false

    setAnalysisState("validating")

    try {
      // Convert File to Buffer before passing to detectAdType
      const buffer = await file.arrayBuffer()
      const adType = await detectAdType(Buffer.from(buffer))
      setAdTypeInfo(adType)

      // Validate ad type against selected standard
      if (selectedStandard === "irdai" && adType.ad_type !== "insurance") {
        setAdTypeError(
          `This appears to be a ${adType.ad_type} advertisement, not an insurance ad. IRDAI compliance checking is specifically for insurance ads. Please select a different compliance standard or upload an insurance advertisement.`,
        )
        setAnalysisState("idle")
        return false
      }

      if (selectedStandard === "finance") {
        const financialTypes = [
          "finance",
          "banking",
          "investment",
          "fintech",
          "wealth_management",
          "real_estate_finance",
          "business_finance",
          "payment_services",
          "financial_consulting"
        ]
        
        if (!financialTypes.includes(adType.ad_type)) {
          setAdTypeError(
            `This appears to be a ${adType.ad_type} advertisement, not a financial ad. Finance compliance checking is specifically for financial advertisements, including banking, investment, fintech, wealth management, and other financial services. Please select a different compliance standard or upload a financial advertisement.`,
          )
          setAnalysisState("idle")
          return false
        }
      }

      return true
    } catch (error) {
      console.error("Error validating ad type:", error)
      setError("Failed to validate advertisement type. Please try again.")
      setAnalysisState("idle")
      return false
    }
  }

  const handleAnalyze = async () => {
    console.log("Analyze button clicked")
    console.log("File:", file)
    console.log("Email submitted:", emailSubmitted)
    console.log("Analysis state:", analysisState)
    
    if (!file) {
      console.log("No file selected")
      toast({
        title: "No image selected",
        description: "Please upload an image to analyze",
        variant: "destructive",
      })
      trackEvent('compliance_analysis_error', {
        error_type: 'no_file_selected'
      });
      return
    }

    // Show email popup first if not submitted
    if (!emailSubmitted) {
      console.log("Showing email popup")
      setShowEmailPopup(true)
      return
    }

    console.log("Starting analysis...")
    // Clear any previous errors
    setAdTypeError(null)
    setError(null)

    // Validate ad type for selected standard
    const isValid = await validateAdTypeForStandard()
    console.log("Ad type validation result:", isValid)
    if (!isValid) {
      trackEvent('compliance_analysis_error', {
        error_type: 'invalid_ad_type',
        standard: selectedStandard,
        detected_ad_type: adTypeInfo?.ad_type
      });
      return
    }

    // Do NOT route to another page; just perform analysis inline
    // router.push(`/compliance/${selectedStandard}`)

    setAnalysisState("loading")
    trackEvent('compliance_analysis_started', {
      standard: selectedStandard,
      file_type: file.type,
      file_size: file.size
    });

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("standard", selectedStandard)

      console.log("Sending request to /api/compliance")
      const response = await fetch("/api/compliance", {
        method: "POST",
        body: formData,
      })

      console.log("Response status:", response.status)
      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      const result = await response.json()
      console.log("Analysis result:", result)
      setResults(result)
      setAnalysisState("complete")
      trackEvent('compliance_analysis_complete', {
        standard: selectedStandard,
        success: true,
        has_violations: result.violations?.length > 0,
        violation_count: result.violations?.length || 0
      });
    } catch (error) {
      console.error("Analysis error:", error)
      setError("Failed to analyze the image. Please try again.")
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your image. Please try again.",
        variant: "destructive",
      })
      setAnalysisState("idle")
      trackEvent('compliance_analysis_error', {
        error_type: 'analysis_failed',
        standard: selectedStandard
      });
    }
  }

  const handleEmailSuccess = () => {
    setEmailSubmitted(true)
    setShowEmailPopup(false)
    // Continue with analysis immediately
    handleAnalyze()
  }

  const resetAnalysis = () => {
    setAnalysisState("idle")
    setResults(null)
    setAdTypeError(null)
    setError(null)
    setEmailSubmitted(false)
    trackEvent('compliance_analysis_reset', {
      standard: selectedStandard
    });
  }

  const isAnalyzing = (state: AnalysisState): state is "validating" | "loading" => {
    return state === "validating" || state === "loading"
  }

  const renderContent = () => {
    if (analysisState === "validating" || analysisState === "loading") {
      return <LoadingState standard={selectedStandard} state={analysisState} />
    }

    if (analysisState === "complete" && results) {
      return (
        <ComplianceResults
          results={results}
          standard={selectedStandard}
          imageUrl={previewUrl!}
          onBack={resetAnalysis}
          adTypeInfo={adTypeInfo}
        />
      )
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        {!hideTitleDescription && (
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-white">
              <span className="gradient-text ">{getStandardFullName(selectedStandard)}</span> Compliance Checker
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">{getStandardDescription(selectedStandard)}</p>
          </div>
        )}
        <div className="w-full max-w-4xl hawky-card p-8">
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-500/30">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {adTypeError && (
            <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-500/30">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Compliance Standard Mismatch</AlertTitle>
              <AlertDescription>{adTypeError}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div
              className="border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center p-12 h-64 cursor-pointer hover:border-gray-500 transition-colors relative"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileChange} />

              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Ad preview" className="h-full w-full object-contain" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-center">Click to change image</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-black/50 p-4 rounded-full mb-4">
                    <Upload className="h-6 w-6 text-[#FF5C87]" />
                  </div>
                  <p className="text-center text-gray-300 mb-2">Drag and drop your ad image here</p>
                  <p className="text-center text-gray-500 text-sm">or click to browse files</p>
                  <p className="text-center text-gray-500 text-xs mt-2">Supported formats: JPG, PNG, GIF (max 10MB)</p>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-2">Select Compliance Standard</label>
                <Select
                  value={selectedStandard}
                  onValueChange={(value) => {
                    if (fixedStandard) return;
                    setSelectedStandard(value as ComplianceStandard)
                    setAdTypeError(null)
                    setError(null)
                  }}
                  disabled={fixedStandard}
                >
                  <SelectTrigger className="w-full hawky-input text-sm sm:text-base py-2 sm:py-3">
                    <SelectValue placeholder="Select a compliance standard" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border border-gray-800">
                    <SelectItem value="asci" className="text-sm sm:text-base py-2">ASCI (Advertising Standards Council of India)</SelectItem>
                    <SelectItem value="wcag" className="text-sm sm:text-base py-2">WCAG (Web Content Accessibility Guidelines)</SelectItem>
                    <SelectItem value="irdai" className="text-sm sm:text-base py-2">IRDAI (Insurance Regulatory and Development Authority of India)</SelectItem>
                    <SelectItem value="finance" className="text-sm sm:text-base py-2">Financial Advertisement Guidelines</SelectItem>
                  </SelectContent>
                </Select>

                {selectedStandard === "irdai" && (
                  <p className="text-xs sm:text-sm text-amber-400 mt-1">Note: IRDAI is specifically for insurance advertisements</p>
                )}

                {selectedStandard === "finance" && (
                  <p className="text-xs sm:text-sm text-green-400 mt-1">
                    Note: Finance checker is specifically for financial advertisements, IPOs, and securities offerings
                  </p>
                )}

                {selectedStandard === "wcag" && (
                  <div className="flex items-start gap-2 mt-2 p-2 bg-blue-900/10 rounded-md border border-blue-800/20">
                    <InfoIcon className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-300">
                      WCAG checks accessibility for all ad types. This helps ensure your ad is accessible to people with
                      disabilities.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full gradient-button flex items-center justify-center gap-2"
                  onClick={handleAnalyze}
                  disabled={!file || analysisState !== "idle"}
                >
                  <Sparkles className="h-4 w-4" />
                  {isAnalyzing(analysisState) ? "Analyzing..." : "Analyze Compliance"}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>Supported file types: JPG, PNG, GIF</p>
                  <p>Maximum file size: 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {renderContent()}
      <SimpleEmailPopup
        isOpen={showEmailPopup}
        onClose={() => setShowEmailPopup(false)}
        onSuccess={handleEmailSuccess}
      />
    </>
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

function getStandardDescription(standard: string): string {
  switch (standard) {
    case "asci":
      return "Check your ads for compliance with Advertising Standards Council of India guidelines for ethical advertising practices."
    case "wcag":
      return "Ensure your ads meet Web Content Accessibility Guidelines for users with disabilities and improve overall user experience."
    case "irdai":
      return "Verify your insurance ads comply with Insurance Regulatory and Development Authority of India regulations."
    case "finance":
      return "Check your financial advertisements for compliance with issue advertisement guidelines, disclosure requirements, and regulatory standards."
    default:
      return "Automate compliance analysis of your ad creatives across different regulations."
  }
}
