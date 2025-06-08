import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "WCAG Compliance Checker | Hawky",
  description: "Check your digital advertisements for compliance with WCAG 2.1 accessibility guidelines",
}

export default function WcagLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 