export function SimpleIntegrationGrid() {
  const platforms = ["FB", "In", "G", "TT", "Li", "Tw", "Pi", "Sn"]

  return (
    <div>
      <div className="flex justify-around mb-4">
        {platforms.slice(0, 4).map((platform, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-12 h-12 ${getColor(index)} rounded-lg flex items-center justify-center text-white mb-2`}>
              {platform}
            </div>
            <p className="text-sm">{getPlatformName(platform)}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {platforms.slice(4).map((platform, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 ${getColor(index + 4)} rounded-lg flex items-center justify-center text-white mb-2`}
            >
              {platform}
            </div>
            <p className="text-sm">{getPlatformName(platform)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function getColor(index: number): string {
  const colors = [
    "bg-blue-600",
    "bg-gradient-to-br from-purple-600 to-pink-500",
    "bg-red-600",
    "bg-black",
    "bg-blue-500",
    "bg-blue-400",
    "bg-red-500",
    "bg-yellow-500",
  ]
  return colors[index % colors.length]
}

function getPlatformName(shortName: string): string {
  const names: Record<string, string> = {
    FB: "Facebook",
    In: "Instagram",
    G: "Google",
    TT: "TikTok",
    Li: "LinkedIn",
    Tw: "Twitter",
    Pi: "Pinterest",
    Sn: "Snapchat",
  }
  return names[shortName] || shortName
}
