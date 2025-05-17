import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Finance Compliance Checker | Hawky",
  description: "Check your financial advertisements for compliance with financial regulatory guidelines",
}

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 