import { Timeline } from "@/components/ui/timeline"
import Image from "next/image"
import CardDemo from "@/components/cards-demo-3"

export default function HawkyTimeline() {
  const data = [
    {
      title: "INTEGRATES INTO YOUR AD ACCOUNTS",
      content: (
        <div className="bg-black border border-gray-700/40 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1),0_0_3px_rgba(0,0,0,0.05)] p-5 md:p-8 hover:shadow-[0_0_20px_rgba(238,42,123,0.15)] hover:border-gray-600/40 transition-all max-w-3xl mx-auto">
          <p className="mb-8 text-gray-9 text-2xl md:text-2xl font-medium leading-relaxed">
            Connect all your ad platforms in one place. Hawky analyzes creatives from Facebook, Instagram, Google,
            TikTok and more.
          </p>
          <div className="flex items-center justify-center">
            <CardDemo />
          </div>
        </div>
      ),
    },
    {
      title: "IDENTIFIES WINNING ELEMENTS",
      content: (
        <div className="bg-black border border-gray-700/40 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1),0_0_3px_rgba(0,0,0,0.05)] p-5 md:p-8 hover:shadow-[0_0_20px_rgba(238,42,123,0.15)] hover:border-gray-600/40 transition-all max-w-3xl mx-auto">
          <p className="mb-8 text-gray-9 text-2xl md:text-2xl font-medium leading-relaxed">
            Hawky analyzes your creatives to identify what's working at a whole new level - from messaging angles to
            hooks, color schemes, and audience segments.
          </p>
          <div className="bg-black p-3 rounded-lg w-full border border-gray-700/40 shadow-inner">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <Image src="/winning-elements.png" alt="Visual Performance Analysis" fill className="object-contain" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "ANALYSES COMPETITION STRATEGY",
      content: (
        <div className="bg-black border border-gray-700/40 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1),0_0_3px_rgba(0,0,0,0.05)] p-5 md:p-8 hover:shadow-[0_0_20px_rgba(238,42,123,0.15)] hover:border-gray-600/40 transition-all max-w-3xl mx-auto">
          <p className="mb-8 text-gray-9 text-2xl md:text-2xl font-medium leading-relaxed">
            Know every move of your competitors. Compare performance across brands and identify opportunities to stand
            out.
          </p>
          <div className="bg-black p-3 rounded-lg w-full border border-gray-700/40 shadow-inner">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <Image
                src="/competitive-analysis-dashboard.png"
                alt="Competitive Analysis Dashboard"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "PRODUCE WINNING CREATIVES",
      content: (
        <div className="bg-black border border-gray-700/40 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1),0_0_3px_rgba(0,0,0,0.05)] p-5 md:p-8 hover:shadow-[0_0_20px_rgba(238,42,123,0.15)] hover:border-gray-600/40 transition-all max-w-3xl mx-auto">
          <p className="mb-8 text-gray-9 text-2xl md:text-2xl font-medium leading-relaxed">
            Generate high-performing creatives at scale based on data-backed insights. Create variations for different
            audience segments and offers.
          </p>
          <div className="bg-black p-3 rounded-lg w-full border border-gray-700/40 shadow-inner">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <Image src="/winning-creatives.png" alt="Campaign Creative Generation" fill className="object-contain" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "OPTIMISE PERFORMANCE",
      content: (
        <div className="bg-black border border-gray-700/40 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1),0_0_3px_rgba(0,0,0,0.05)] p-5 md:p-8 hover:shadow-[0_0_20px_rgba(238,42,123,0.15)] hover:border-gray-600/40 transition-all max-w-3xl mx-auto">
          <p className="mb-8 text-gray-9 text-2xl md:text-2xl font-medium leading-relaxed">
            Continuously monitor campaign performance and automatically optimize your creatives for maximum ROI across
            all platforms.
          </p>
          <div className="bg-black p-3 rounded-lg w-full border border-gray-700/40 shadow-inner">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <Image
                src="/optimize-performance.png"
                alt="Performance Optimization Analysis"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  )
}
