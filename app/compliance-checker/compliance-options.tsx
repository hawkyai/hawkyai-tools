import type React from "react"
import Link from "next/link"
import { ScientificButton } from "@/components/scientific-button"
import { Shield, Accessibility, FileText, DollarSign, Upload, Sparkles, ArrowRight, ArrowDown } from "lucide-react"
import ComplianceChecker from "./compliance-checker"
import HawkyTimeline from "@/components/hawky-timeline"

const complianceOptions = [
  {
    title: "ASCI",
    description: "Advertising Standards Council of India",
    details: "Check ads against ASCI ethical advertising guidelines.",
    href: "/compliance-checker/asci",
    imgSrc: "/Asci-logo.png",
    imgAlt: "ASCI Logo",
    iconBg: "bg-pink-900/20",
    buttonColor: "bg-pink-500 hover:bg-pink-600 focus:ring-pink-500 text-black",
    buttonText: "Check ASCI Compliance",
  },
  {
    title: "WCAG",
    description: "Web Content Accessibility Guidelines",
    details: "Ensure ads meet accessibility standards for all users.",
    href: "/compliance-checker/wcag",
    imgSrc: "/Wcag.png",
    imgAlt: "WCAG Logo",
    iconBg: "bg-purple-900/20",
    buttonColor: "bg-purple-500 hover:bg-purple-600 focus:ring-purple-500 text-black",
    buttonText: "Check WCAG Compliance",
  },
  {
    title: "IRDAI",
    description: "Insurance Regulatory and Development Authority of India",
    details: "Verify insurance ads comply with IRDAI regulations.",
    href: "/compliance-checker/irdai",
    imgSrc: "/IRDAI.jpg",
    imgAlt: "IRDAI Logo",
    iconBg: "bg-yellow-900/20",
    buttonColor: "bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-400 text-black",
    buttonText: "Check IRDAI Compliance",
  },
  {
    title: "Finance",
    description: "Financial Advertisement Guidelines",
    details: "Check financial ads for regulatory compliance.",
    href: "/compliance-checker/finance",
    imgSrc: "/sebi-logo.png",
    imgAlt: "SEBI Logo",
    iconBg: "bg-green-900/20",
    buttonColor: "bg-green-500 hover:bg-green-600 focus:ring-green-500 text-black",
    buttonText: "Check Finance Compliance",
  },
]

function HowHawkyWorks() {
  return (
    <div className="w-full max-w-full px-4 sm:px-8 lg:px-28 mx-auto mb-10 pt-10 pb-10">
      <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-2">How Compliance Checker Works</h2>
      <p className="text-base text-gray-400 text-center mb-8 max-w-2xl mx-auto">Get your ad compliance results in three simple steps</p>
      <div className="flex flex-col gap-0 md:flex-row md:gap-0 w-full justify-center items-stretch">
        {/* Step 1 */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="relative flex-1 bg-[#111112] rounded-2xl border border-[#232329] p-4 flex flex-col items-center text-center min-w-0 max-w-[350px] mx-auto shadow-md">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4 mt-4 md:mt-0">
              <Upload className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Upload Your Ad</h3>
            <p className="text-gray-400 text-sm">Upload your advertisement image in any common format (JPG, PNG, etc.)</p>
          </div>
          {/* Arrow for mobile */}
          <ArrowDown className="flex md:hidden w-8 h-8 text-gray-500 my-2" />
        </div>
        {/* Arrow for desktop */}
        <ArrowRight className="hidden md:flex w-8 h-8 text-gray-500 self-center mx-4" />
        {/* Step 2 */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="relative flex-1 bg-[#111112] rounded-2xl border border-[#232329] p-4 flex flex-col items-center text-center min-w-0 max-w-[350px] mx-auto shadow-md">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4 mt-4 md:mt-0">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">AI Analysis</h3>
            <p className="text-gray-400 text-sm">HawkyAI analyzes your ad against the selected compliance standard</p>
          </div>
          {/* Arrow for mobile */}
          <ArrowDown className="flex md:hidden w-8 h-8 text-gray-500 my-2" />
        </div>
        {/* Arrow for desktop */}
        <ArrowRight className="hidden md:flex w-8 h-8 text-gray-500 self-center mx-4" />
        {/* Step 3 */}
        <div className="flex flex-col items-center w-full md:w-auto">
          <div className="relative flex-1 bg-[#111112] rounded-2xl border border-[#232329] p-4 flex flex-col items-center text-center min-w-0 max-w-[350px] mx-auto shadow-md">
            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4 mt-4 md:mt-0">
              <FileText className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Get Results</h3>
            <p className="text-gray-400 text-sm">Review detailed compliance report with actionable suggestions</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComplianceOptions() {
  return (
    <>
      <div className="container mx-auto px-4 py-1 flex-1">
        <div className="max-w-4xl mx-auto">
          <ComplianceChecker defaultStandard="asci" fixedStandard={false} hideTitleDescription />
        </div>
      </div>
      <HowHawkyWorks />
      <div className="w-full max-w-full px-4 sm:px-8 lg:px-28 mx-auto py-0 mb-16 mt-32">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Choose Your Compliance Standard</h1>
          <h2 className="text-base md:text-lg text-gray-400 font-normal max-w-2xl mx-auto">Select the regulatory framework that applies to your advertisement for targeted compliance analysis.</h2>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {complianceOptions.map((option) => (
            <ComplianceCard key={option.title} {...option} />
          ))}
        </div>
      </div>
      <div className="w-full max-w-full px-4 sm:px-8 lg:px-28 mx-auto py-16">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Understanding Compliance Standards</h1>
          <h2 className="text-base md:text-lg text-gray-400 font-normal max-w-2xl mx-auto">Learn about the importance of compliance and how Hawky helps you maintain regulatory standards</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#111112] rounded-2xl p-6 border border-[#232329] hover:border-gray-600/40 transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="rounded-full w-12 h-12 flex items-center justify-center mr-4 bg-blue-900/20">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Why Compliance Matters</h3>
            </div>
            <p className="text-gray-400">
              Ensuring your advertisements comply with regulatory standards is crucial for maintaining brand integrity, avoiding legal issues, and building trust with your audience. Non-compliance can lead to penalties, reputational damage, and loss of customer confidence.
            </p>
          </div>

          <div className="bg-[#111112] rounded-2xl p-6 border border-[#232329] hover:border-gray-600/40 transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="rounded-full w-12 h-12 flex items-center justify-center mr-4 bg-purple-900/20">
                <Accessibility className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">WCAG Standards</h3>
            </div>
            <p className="text-gray-400">
              Web Content Accessibility Guidelines (WCAG) ensure your content is accessible to people with disabilities. Following these standards makes your advertisements inclusive and reaches a wider audience while meeting legal requirements in many jurisdictions.
            </p>
          </div>

          <div className="bg-[#111112] rounded-2xl p-6 border border-[#232329] hover:border-gray-600/40 transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="rounded-full w-12 h-12 flex items-center justify-center mr-4 bg-green-900/20">
                <Sparkles className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Hawky's Role</h3>
            </div>
            <p className="text-gray-400">
              Hawky provides automated compliance checking tools that help you verify your advertisements against multiple regulatory frameworks. Our AI-powered system ensures accuracy and saves time while helping you maintain compliance with industry standards.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-full px-4 sm:px-8 lg:px-28 mx-auto py-16">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2">How Hawky Works</h1>
          <h2 className="text-base md:text-lg text-gray-400 font-normal max-w-2xl mx-auto">Discover how Hawky transforms your advertising compliance process</h2>
        </div>
        <HawkyTimeline />
      </div>
    </>
  )
}

interface ComplianceCardProps {
  title: string
  description: string
  details: string
  href: string
  imgSrc: string
  imgAlt: string
  iconBg: string
  buttonColor: string
  buttonText: string
}

function ComplianceCard({ title, description, details, href, imgSrc, imgAlt, iconBg, buttonColor, buttonText }: ComplianceCardProps) {
  return (
    <div className="bg-[#111112] rounded-2xl shadow-lg flex flex-col p-6 min-h-[260px] border border-[#232329] w-full max-w-full transition hover:shadow-xl hover:border-gray-600/40">
      <div className="flex items-center mb-4">
        <div className={`rounded-full w-12 h-12 flex items-center justify-center mr-4 bg-white/90 border border-gray-200`}>
          <img src={imgSrc} alt={imgAlt} className="w-8 h-8 object-contain rounded-full" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-white leading-tight">{title}</h3>
          <p className="text-gray-400 text-sm font-medium leading-tight">{description}</p>
        </div>
      </div>
      <p className="text-white text-base font-normal mb-6 flex-grow leading-snug">{details}</p>
      <Link href={href} className="mt-auto">
        <button
          className={`w-full rounded-lg px-4 py-2.5 font-semibold text-base flex items-center justify-center gap-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-black`}
        >
          {buttonText} <span className="ml-2">→</span>
        </button>
      </Link>
    </div>
  )
}
