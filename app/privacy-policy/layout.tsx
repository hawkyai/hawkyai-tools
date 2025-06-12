import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Hawky.ai",
  description: "Privacy policy for Hawky.ai's services. Learn about how we collect, use, and protect your information.",
  openGraph: {
    title: "Privacy Policy | Hawky.ai",
    description: "Privacy policy for Hawky.ai's services. Learn about how we collect, use, and protect your information.",
    url: "https://hawky.ai/privacy-policy",
    siteName: "Hawky.ai",
    images: [
      {
        url: "/hawky-logo.png",
        width: 1200,
        height: 630,
        alt: "Hawky.ai Privacy Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 