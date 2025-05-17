import { LockIcon } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface EngagementData {
  labels: string[]
  values: number[]
}

interface EngagementChartProps {
  data?: EngagementData
}

export function EngagementChart({ data }: EngagementChartProps) {
  // Format data for the chart
  const chartData = data
    ? data.labels.map((label, index) => ({
        name: label,
        value: data.values[index],
      }))
    : [
        { name: "0s", value: 20 },
        { name: "10s", value: 45 },
        { name: "20s", value: 65 },
        { name: "30s", value: 50 },
        { name: "40s", value: 80 },
        { name: "50s", value: 75 },
        { name: "60s", value: 90 },
      ]

  return (
    <div className="relative h-full w-full">
      {/* Blur overlay with lock icon */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30 z-10 flex flex-col items-center justify-center rounded-md">
        <LockIcon className="h-10 w-10 text-white/80 mb-2" />
        <p className="text-white/90 font-medium">Hawky analysis</p>
        <p className="text-white/70 text-sm">Tap to unlock detailed engagement analytics</p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              borderColor: "#555",
              color: "#fff",
            }}
          />
          <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
