import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ASCI Compliance Checker | Hawky",
  description: "Check your advertisements for compliance with ASCI (Advertising Standards Council of India) guidelines",
}

export default function AsciLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 