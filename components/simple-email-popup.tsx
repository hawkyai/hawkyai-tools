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

export function SimpleEmailPopup({ isOpen, onClose, onSuccess }: SimpleEmailPopupProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false)
      setEmail("")
    }
  }, [isOpen])

  const handleSubmitEmail = async () => {
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
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
                  To proceed with the compliance analysis, we need your email address. 
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
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-gray-800 border-gray-700 text-white"
                  disabled={isLoading}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmitEmail()
                    }
                  }}
                />
              </div>

              <Button
                onClick={handleSubmitEmail}
                disabled={isLoading || !email}
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