import { Metadata } from "next"
import Script from "next/script"

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
  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-PH7NXDN2');
        `}
      </Script>
      {children}
    </>
  )
} 