import { Loader } from "lucide-react"

interface LoadingStateProps {
  standard: string
  state: "validating" | "loading"
}

export default function LoadingState({ standard, state }: LoadingStateProps) {
  const standardName = getStandardFullName(standard)
  const isValidating = state === "validating"

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl hawky-card p-16 flex flex-col items-center justify-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full bg-purple-900/20 animate-ping"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="h-12 w-12 text-[#FF5C87] animate-spin" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-white">{isValidating ? "Validating Your Ad" : "Analyzing Your Ad"}</h2>
        <p className="text-gray-400 text-center max-w-md">
          {isValidating
            ? "HawkyAI is identifying your ad type to ensure it matches the selected compliance standard..."
            : `HawkyAI is checking your ad against ${standardName} compliance regulations...`}
        </p>
      </div>
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
