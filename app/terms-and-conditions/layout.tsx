import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions | Hawky.ai",
  description: "Terms and conditions for using Hawky.ai's services. Learn about our rules, regulations, and user agreements.",
  openGraph: {
    title: "Terms and Conditions | Hawky.ai",
    description: "Terms and conditions for using Hawky.ai's services. Learn about our rules, regulations, and user agreements.",
    url: "https://hawky.ai/terms-and-conditions",
    siteName: "Hawky.ai",
    images: [
      {
        url: "/hawky-logo.png",
        width: 1200,
        height: 630,
        alt: "Hawky.ai Terms and Conditions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function TermsAndConditionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 