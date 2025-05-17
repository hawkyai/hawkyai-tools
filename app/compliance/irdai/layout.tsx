import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IRDAI Compliance Checker | Hawky",
  description: "Check your insurance advertisements for compliance with IRDAI guidelines",
}

export default function IrdaiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 