import Image from "next/image"

export function PlatformIntegrationGrid() {
  const platforms = [
    // Social & Ad Platforms
    {
      name: "Facebook",
      logo: "/integrations/facebook-logo.png",
      category: "social",
    },
    {
      name: "Instagram",
      logo: "/integrations/instagram-logo.png",
      category: "social",
    },
    {
      name: "Google Ads",
      logo: "/integrations/google-ads-logo.png",
      category: "ads",
    },
    {
      name: "TikTok",
      logo: "/integrations/tiktok-logo.png",
      category: "social",
    },
    {
      name: "LinkedIn",
      logo: "/integrations/linkedin-logo.png",
      category: "social",
    },
    {
      name: "Twitter",
      logo: "/integrations/twitter-logo.png",
      category: "social",
    },
    {
      name: "Pinterest",
      logo: "/integrations/pinterest-logo.png",
      category: "social",
    },
    {
      name: "Snapchat",
      logo: "/integrations/snapchat-logo.png",
      category: "social",
    },
    {
      name: "YouTube",
      logo: "/integrations/youtube-logo.png",
      category: "social",
    },
    {
      name: "Amazon Ads",
      logo: "/integrations/amazon-logo.png",
      category: "ads",
    },
    {
      name: "Taboola",
      logo: "/integrations/taboola-logo.png",
      category: "ads",
    },
    // Analytics & CRM
    {
      name: "Google Analytics",
      logo: "/integrations/google-analytics-logo.svg",
      category: "analytics",
    },
    {
      name: "Salesforce",
      logo: "/integrations/salesforce-logo.svg",
      category: "crm",
    },
    {
      name: "Leadsquared",
      logo: "/integrations/leadsquared-logo.svg",
      category: "crm",
    },
    {
      name: "Zoho CRM",
      logo: "/integrations/zoho-crm-logo.svg",
      category: "crm",
    },
    {
      name: "AppsFlyer",
      logo: "/integrations/appsflyer-logo.svg",
      category: "analytics",
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-6xl mx-auto">
      {platforms.map((platform) => (
        <div
          key={platform.name}
          className="flex flex-col items-center justify-center p-4 bg-black/30 rounded-lg border border-gray-3/30 hover:border-purple-500/30 transition-all duration-300 group"
        >
          <div className="w-16 h-16 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
            <Image
              src={platform.logo || "/placeholder.svg"}
              alt={`${platform.name} logo`}
              width={64}
              height={64}
              className="object-contain max-h-12"
            />
          </div>
          <p className="text-gray-12 text-sm font-medium text-center">{platform.name}</p>
          <span className="text-xs text-gray-9 mt-1">{getCategoryLabel(platform.category)}</span>
        </div>
      ))}
    </div>
  )
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case "social":
      return "Social Media"
    case "ads":
      return "Ad Platform"
    case "analytics":
      return "Analytics"
    case "crm":
      return "CRM"
    default:
      return ""
  }
}
