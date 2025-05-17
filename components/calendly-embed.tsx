"use client"

import { useEffect } from "react"

interface CalendlyEmbedProps {
  userEmail?: string
  userName?: string
}

export function CalendlyEmbed({ userEmail, userName }: CalendlyEmbedProps) {
  useEffect(() => {
    // Load the Calendly script
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Clean up the script when component unmounts
      document.body.removeChild(script)
    }
  }, [])

  // Construct the URL with prefill parameters if available
  let calendlyUrl = "https://calendly.com/surender-hawky/30min?back=1"

  if (userEmail || userName) {
    calendlyUrl += "?"

    if (userName) {
      calendlyUrl += `name=${encodeURIComponent(userName)}`
    }

    if (userEmail) {
      if (userName) calendlyUrl += "&"
      calendlyUrl += `email=${encodeURIComponent(userEmail)}`
    }
  }

  return (
    <div className="calendly-inline-widget" data-url={calendlyUrl} style={{ minWidth: "320px", height: "700px" }} />
  )
}
