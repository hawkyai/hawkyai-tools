"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, Mail, Sparkles, CheckCircle } from "lucide-react"

interface SimpleEmailPopupProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (emailData?: { email: string; name?: string; message?: string }) => void
}

// Blocked domains for personal email providers
const blockedDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "protonmail.com",
  "zoho.com",
  "gmx.com",
  "gmx.de",
  "mail.com",
  "yandex.com",
  "yandex.ru",
  "fastmail.com",
  "inbox.com",
]

// Business email regex that excludes blocked domains
const businessEmailRegex = new RegExp(
  `^[a-zA-Z0-9._%+-]+@(?!(${blockedDomains.join("|").replace(/\./g, "\\.")})$)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`
)

// Cloudflare MX lookup for domain existence
async function checkDomainExists(email: string): Promise<boolean> {
  const domain = email.split("@")[1]
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`,
      {
        headers: { accept: "application/dns-json" },
      }
    )
    const data = await res.json()
    return (
      data &&
      data.Answer &&
      data.Answer.some((record: any) => record.type === 15)
    ) // MX exists
  } catch (err) {
    console.error("DNS check failed:", err)
    return false
  }
}

export function SimpleEmailPopup({ isOpen, onClose, onSuccess }: SimpleEmailPopupProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState("")

  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false)
      setEmail("")
      setValidationError("")
    }
  }, [isOpen])

  // Validate email as user types
  const handleEmailChange = async (value: string) => {
    setEmail(value)
    setValidationError("")

    if (!value) return

    // Basic email format check first
    const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!basicEmailRegex.test(value)) {
      setValidationError("Please enter a valid email address")
      return
    }

    // Check if it's a business email
    if (!businessEmailRegex.test(value)) {
      setValidationError("Please use a business email address (no Gmail, Yahoo, etc.)")
      return
    }

    // Check domain existence
    setIsValidating(true)
    try {
      const domainExists = await checkDomainExists(value)
      if (!domainExists) {
        setValidationError("This email domain doesn't exist or can't receive mail")
      }
    } catch (error) {
      console.error("Domain validation error:", error)
      setValidationError("Unable to verify domain. Please try again.")
    } finally {
      setIsValidating(false)
    }
  }

  const handleSubmitEmail = async () => {
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    if (validationError) {
      toast.error(validationError)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/store-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to store email")
      }

      // Show success state
      setIsSuccess(true)
      
      // Wait for 1.5 seconds to show the success message
      setTimeout(() => {
        onClose()
        setEmail("")
        setIsSuccess(false)
        setValidationError("")
        onSuccess({ email })
        toast.success("Starting analysis...")
      }, 1500)

    } catch (error) {
      console.error("Error storing email:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save email")
    } finally {
      setIsLoading(false) 
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#FF5C87]" />
            <span>One Last Step</span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Thank You!</h3>
              <p className="text-gray-300 text-sm">
                Your email has been successfully saved. 
                Proceeding with compliance analysis...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-300 text-sm leading-relaxed">
                  To proceed with the compliance analysis, we need your business email address. 
                  This helps us:
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF5C87]">•</span>
                    <span>Send you the detailed compliance report</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF5C87]">•</span>
                    <span>Keep you updated on compliance standards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FF5C87]">•</span>
                    <span>Provide personalized recommendations</span>
                  </li>
                </ul>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Business Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="Enter your business email"
                  className={`bg-gray-800 border-gray-700 text-white ${
                    validationError ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmitEmail()
                    }
                  }}
                />
                {isValidating && (
                  <p className="text-xs text-gray-500 mt-1">
                    Checking domain...
                  </p>
                )}
                {validationError && (
                  <p className="text-xs text-red-400 mt-1">
                    {validationError}
                  </p>
                )}
              </div>

              <Button
                onClick={handleSubmitEmail}
                disabled={isLoading || !email || !!validationError || isValidating}
                className="w-full gradient-button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Continue with Analysis
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to receive compliance-related updates
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 