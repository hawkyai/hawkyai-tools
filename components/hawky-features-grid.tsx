import { useId } from "react"

export default function HawkyFeaturesGrid() {
  return (
    <div className="py-12 lg:py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {grid.map((feature) => (
          <div
            key={feature.title}
            className="relative bg-gradient-to-b from-black to-gray-1/80 p-6 rounded-xl overflow-hidden border border-gray-3/30 hover:border-gray-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/10"
          >
            <Grid size={20} />
            <p className="text-base font-bold text-white relative z-20">{feature.title}</p>
            <p className="text-gray-9 mt-4 text-sm relative z-20">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const grid = [
  {
    title: "Cut Down Wasted Ad Spend",
    description: "Spend your budget where it matters by identifying and eliminating underperforming creatives.",
  },
  {
    title: "Scale High-Performing Creatives",
    description: "Focus on the creative elements that drive results and scale your best-performing campaigns.",
  },
  {
    title: "Automate Compliance",
    description: "Ensure all your creatives meet brand, legal, and channel requirements automatically.",
  },
  {
    title: "Decode Algorithms",
    description: "Understand how ad platforms work and optimize your creatives to align with their algorithms.",
  },
  {
    title: "Real-time Performance Tracking",
    description: "Monitor campaign performance in real-time with AI-powered alerts and recommendations.",
  },
  {
    title: "Cross-Platform Analysis",
    description: "Compare performance across multiple platforms to identify the best channels for your audience.",
  },
]

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][]
  size?: number
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ]
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-gray-800/5 via-gray-600/5 to-gray-900/10 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay fill-gray-500/10 stroke-gray-400/20"
        />
      </div>
    </div>
  )
}

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId()

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  )
}
