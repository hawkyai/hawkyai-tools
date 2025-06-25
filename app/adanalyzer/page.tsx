"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Eye,
  Lightbulb,
  MessageCircle,
  Shield,
  Star,
  Upload,
  User,
  Video,
  X,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { EngagementChart } from "@/components/engagement-chart"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { analyzeAd, type AdAnalysisResult } from "@/lib/gemini"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, CheckCircleIcon, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

export default function AdAnalyzerPage() {
  const mediaType = "video" // Default to video only
  const [isUploading, setIsUploading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AdAnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEmailVerified, setIsEmailVerified] = useState(false)

  // Email verification modal state
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [userOtp, setUserOtp] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSent, setIsSent] = useState(false)

  // Use useEffect to set isClient to true after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please select a file to analyze")
      return
    }

    if (!isEmailVerified) {
      // Show verification modal instead of proceeding
      setShowVerificationModal(true)
      return
    }

    // If already verified, proceed with analysis
    await runAnalysis()
  }

  const runAnalysis = async () => {
    setIsUploading(true)

    try {
      // Analyze the ad using Gemini
      const result = await analyzeAd(file!)
      setAnalysisResult(result)

      setIsUploading(false)
      setShowResults(true)

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } catch (error) {
      console.error("Error analyzing ad:", error)
      toast.error("Failed to analyze ad. Please try again.")
      setIsUploading(false)
    }
  }

  // Email verification functions
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setIsVerifying(true)
    try {
      const response = await fetch("/compliance-checker/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data && data.error ? data.error : "Failed to send OTP"
        throw new Error(errorMessage)
      }

      // In development, we're getting the OTP from the response
      setOtp(data.otp)
      setIsSent(true)
      toast.success("Verification code sent to your email")
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send verification code")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!userOtp) {
      toast.error("Please enter the verification code")
      return
    }

    setIsVerifying(true)
    try {
      const response = await fetch("/compliance-checker/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, userOtp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP")
      }

      setIsEmailVerified(true)
      toast.success("Email verified successfully")

      // Close the modal
      setShowVerificationModal(false)

      // Reset verification state for next time
      setIsSent(false)
      setUserOtp("")

      // Run the analysis now that we're verified
      await runAnalysis()
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error(error instanceof Error ? error.message : "Invalid verification code")
    } finally {
      setIsVerifying(false)
    }
  }

  // Only render the full content after client-side hydration
  if (!isClient) {
    return (
      <main className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      {/* Email Verification Modal */}
      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Email Verification</DialogTitle>
          </DialogHeader>

          {!isSent ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="email-modal" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <Input
                  id="email-modal"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <Button onClick={handleSendOtp} disabled={isVerifying} className="w-full">
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="otp-modal" className="block text-sm font-medium mb-1">
                  Verification Code
                </label>
                <Input
                  id="otp-modal"
                  type="text"
                  value={userOtp}
                  onChange={(e) => setUserOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="bg-gray-800 border-gray-700"
                  maxLength={6}
                />
                <p className="text-sm text-gray-400 mt-1">A verification code has been sent to {email}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsSent(false)} disabled={isVerifying} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleVerifyOtp} disabled={isVerifying} className="flex-1">
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {!showResults ? (
        <>
          <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                AI-Powered Ad Analysis
                <span className="block text-blue-400 mt-2">In Seconds</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
                Drop your ad copy or image. Get instant feedback on compliance, hooks, design & CTA.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-8">
                <div className="bg-green-950/50 text-green-400 px-6 py-2 rounded-full flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Free to Use
                </div>
                <div className="bg-blue-950/50 text-blue-400 px-6 py-2 rounded-full flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Instant Results
                </div>
                <div className="bg-purple-950/50 text-purple-400 px-6 py-2 rounded-full flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Ad Compliance Checker
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1 flex flex-col items-center justify-center px-4 py-16 border-t border-gray-800">
            <div className="max-w-3xl w-full mx-auto space-y-10">
              <h1 className="text-3xl md:text-4xl font-bold text-center">Analyze Your Ad</h1>

              <div className="border border-dashed border-gray-600 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
                {file ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-64 h-64 bg-gray-800 rounded-lg overflow-hidden">
                      <video src={URL.createObjectURL(file)} controls className="w-full h-full object-contain" />
                    </div>
                    <p className="text-gray-400">{file.name}</p>
                    <Button variant="outline" onClick={() => setFile(null)}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 mb-4 text-gray-400" />
                    <h3 className="text-xl font-medium mb-2">Drag & drop your ad video here</h3>
                    <p className="text-gray-400 mb-6">or click to browse</p>
                    <Button
                      className="bg-gradient-to-r from-[#6228d7] via-[#ee2a7b] to-[#6228d7] text-white hover:opacity-90 flex items-center gap-2"
                      onClick={handleBrowseClick}
                    >
                      <Video className="h-4 w-4" />
                      Select Video
                    </Button>
                  </>
                )}
              </div>

              {isEmailVerified && (
                <div className="p-4 bg-green-900/30 border border-green-800 rounded-lg flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" />
                  <p>Email verified successfully. You can now analyze your ad.</p>
                </div>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={isUploading}
                className="w-full py-6 text-lg font-medium bg-gradient-to-r from-[#6228d7] via-[#ee2a7b] to-[#6228d7] text-white hover:opacity-90"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  "Analyze My Ad"
                )}
              </Button>
            </div>
          </section>
        </>
      ) : (
        <div id="results" className="max-w-7xl mx-auto w-full px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Overall Performance Score */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-blue-400">
                    Overall
                    <br />
                    Performance
                    <br />
                    Score
                  </h2>
                  <div className="flex items-center gap-2">
                    <Star className="h-8 w-8 text-purple-400 fill-purple-400" />
                    <span className="text-4xl font-bold text-purple-400">{analysisResult?.overallScore || 0}/100</span>
                  </div>
                  <p className="text-sm text-gray-400">Based on multiple factors and AI analysis</p>

                  <Progress value={analysisResult?.overallScore || 0} className="h-2 bg-gray-800" />

                  <div className="space-y-4 pt-4">
                    <div>
                      <h3 className="text-gray-400 mb-1">Psychological Impact</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Tone</p>
                          <p className="font-medium text-blue-400">
                            {analysisResult?.psychologicalImpact.tone || "Analyzing..."}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Emotion</p>
                          <p className="font-medium text-blue-400">
                            {analysisResult?.psychologicalImpact.emotion || "Analyzing..."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-gray-400 mb-1">Key Triggers</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult?.keyTriggers.map((trigger, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-purple-950/50 text-purple-400 hover:bg-purple-900/50"
                          >
                            {trigger}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Badge className="bg-green-900/50 text-green-400 border-green-500 px-4 py-1">
                      {analysisResult?.overallScore && analysisResult.overallScore >= 80
                        ? "Top 10% Performance"
                        : analysisResult?.overallScore && analysisResult.overallScore >= 60
                          ? "Above Average"
                          : analysisResult?.overallScore && analysisResult.overallScore >= 40
                            ? "Average"
                            : "Needs Improvement"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Video Analysis Overview */}
            <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-blue-400">Ad Analysis Overview</h2>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-blue-950/30 text-blue-400 border-blue-800">
                      {analysisResult?.contentType || "Content"}
                    </Badge>
                    <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                      {analysisResult?.primaryGoal || "Goal"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <h3 className="text-lg font-medium">Quality Score</h3>
                      </div>
                      <p className="text-4xl font-bold text-purple-400">{analysisResult?.qualityScore || 0}/100</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-blue-400" />
                        <h3 className="text-lg font-medium">Avg. Engagement</h3>
                      </div>
                      <p className="text-4xl font-bold text-purple-400">{analysisResult?.avgEngagement || 0}%</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-purple-400" />
                        <h3 className="text-lg font-medium">Target Match</h3>
                      </div>
                      <p className="text-4xl font-bold text-purple-400">{analysisResult?.targetMatch || 0}%</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="text-gray-400 mb-2">Content Type:</h3>
                    <p className="text-xl font-medium text-blue-400">{analysisResult?.contentType || "Analyzing..."}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 mb-2">Primary Goal:</h3>
                    <p className="text-xl font-medium text-blue-400">{analysisResult?.primaryGoal || "Analyzing..."}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 mb-2">Key Strengths:</h3>
                    <p className="text-lg text-blue-400">{analysisResult?.keyStrengths || "Analyzing..."}</p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 mb-2">Target Audience:</h3>
                    <p className="text-lg text-blue-400">{analysisResult?.targetAudience || "Analyzing..."}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Timeline */}
            <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-blue-400">Engagement Timeline</h2>
                <div className="h-[300px]">
                  <EngagementChart data={analysisResult?.engagementData} />
                </div>
              </CardContent>
            </Card>

            {/* Narrative Analysis */}
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-blue-400">Narrative Analysis</h2>

                <div className="space-y-6">
                  {analysisResult?.narrativeAnalysis.map((segment, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <p className="font-medium text-purple-300">{segment.timeRange}</p>
                        <Badge className="bg-green-900/50 text-green-400">{segment.label}</Badge>
                      </div>
                      <p className="mb-2">{segment.description}</p>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Audience Engagement: {segment.engagement}%</p>
                        <Progress value={segment.engagement} className="h-2 bg-gray-800" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis */}
            <Card className="bg-gray-900 border-gray-800 lg:col-span-3">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-blue-400">Detailed Analysis</h2>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-gray-800">
                    <AccordionTrigger className="py-4 text-lg">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-purple-400" />
                        <span>Psychological Analysis</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 space-y-4 pb-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-1">Tone</h3>
                          <p className="text-blue-300">{analysisResult?.psychologicalImpact.tone || "Analyzing..."}</p>
                        </div>

                        <div>
                          <h3 className="font-medium mb-1">Emotional Response</h3>
                          <p className="text-blue-300">
                            {analysisResult?.psychologicalImpact.emotion || "Analyzing..."}
                          </p>
                        </div>

                        <div>
                          <h3 className="font-medium mb-1">Buyer Triggers</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {analysisResult?.keyTriggers.map((trigger, index) => (
                              <Badge key={index} className="bg-purple-900/70 text-white px-4 py-2 rounded-full">
                                {trigger}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-gray-800">
                    <AccordionTrigger className="py-4 text-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-400" />
                        <span>Hook Effectiveness</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 space-y-4 pb-6">
                      <p className="text-blue-300">{analysisResult?.hookEffectiveness || "Analyzing..."}</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-gray-800">
                    <AccordionTrigger className="py-4 text-lg">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-purple-400" />
                        <span>Design Feedback</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 space-y-4 pb-6">
                      <p className="text-blue-300">{analysisResult?.designFeedback || "Analyzing..."}</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border-gray-800">
                    <AccordionTrigger className="py-4 text-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-400" />
                        <span>Compliance Checker</span>
                        <span className="text-gray-400 text-sm font-normal ml-2">Platform guidelines review</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 space-y-4 pb-6">
                      <div className="space-y-4">
                        <div className="border border-gray-800 rounded-lg overflow-hidden">
                          <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                            <Select defaultValue={analysisResult?.complianceCheck.platform || "meta"}>
                              <SelectTrigger className="w-32 bg-transparent border-gray-700">
                                <SelectValue placeholder="Platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="meta">Meta</SelectItem>
                                <SelectItem value="google">Google</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                              </SelectContent>
                            </Select>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          </div>

                          <div className="divide-y divide-gray-800">
                            {analysisResult?.complianceCheck.checks.map((check, index) => (
                              <div key={index} className="p-3 flex justify-between items-center">
                                <span className="text-blue-300">{check.name}</span>
                                {check.passed ? (
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                  <X className="h-5 w-5 text-red-500" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <h3 className="font-medium mb-2">Compliance Summary</h3>
                          <p className="text-blue-300">
                            {analysisResult?.complianceCheck.checks.filter((check) => !check.passed).length === 0
                              ? "Your ad meets all compliance requirements for the selected platform."
                              : `Your ad has ${analysisResult?.complianceCheck.checks.filter((check) => !check.passed).length} compliance issues that need attention.`}
                          </p>

                          {(analysisResult?.complianceCheck?.checks ?? []).filter((check) => !check.passed).length >
                            0 && (
                            <div className="mt-2 p-3 bg-red-950/30 border border-red-900/50 rounded-md">
                              <h4 className="font-medium text-red-400 mb-1">Issues to Address:</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {analysisResult?.complianceCheck.checks
                                  .filter((check) => !check.passed)
                                  .map((check, index) => (
                                    <li key={index} className="text-blue-300">
                                      {check.name}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Success Patterns */}
            <Card className="bg-gray-900 border-gray-800 lg:col-span-3">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-blue-400">Success Patterns</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {analysisResult?.successPatterns.map((pattern, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <h3 className="text-xl font-medium text-purple-300">{pattern.category}</h3>
                      </div>

                      <ul className="space-y-3">
                        {pattern.patterns.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex gap-2">
                            <span className="text-blue-400">•</span>
                            <span className="text-blue-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Features CTA */}
          <div className="mt-12 text-center py-12 border-t border-gray-800">
            <h2 className="text-3xl font-bold mb-4 text-blue-400">
              Want full reports, A/B test ideas, or export to Google/Facebook ads?
            </h2>
            <p className="text-gray-400 max-w-3xl mx-auto mb-8">
              Get access to premium features, including detailed analytics, A/B testing suggestions, and direct platform
              exports.
            </p>
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href="#">
                <User className="mr-2 h-5 w-5" />
                Sign in to Access Pro Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
