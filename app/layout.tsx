import type React from "react"
import "@/app/globals.css"
import { Source_Sans_3, Raleway } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

// Load Source Sans Pro (now called Source Sans 3)
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-sans",
})

// Load Raleway for the "Creative factory" text
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-raleway",
})

export const metadata = {
  title: "Hawky.ai - Transform Creative Guesswork into Predictable Outcomes",
  description:
    "Hawky.ai combines deep creative analysis with AI-powered development tools to deliver a complete intelligence-driven creative ecosystem for B2C marketers.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sourceSans.className} ${sourceSans.variable} ${raleway.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
