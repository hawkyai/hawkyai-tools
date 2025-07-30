"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, CheckCircle, Mail, X } from "lucide-react"

interface EmailCollectionPopupProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function EmailCollectionPopup({ isOpen, onClose, onSuccess }: EmailCollectionPopupProps) {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [userOtp, setUserOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"email" | "verification" | "success">("email")

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data && data.error ? data.error : "Failed to send OTP"
        throw new Error(errorMessage)
      }

      // Store the OTP for verification (in dev, we get it from response)
      setOtp(data.otp)
      setStep("verification")
      toast.success("Verification code sent to your email")
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send verification code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!userOtp) {
      toast.error("Please enter the verification code")
      return
    }

    setIsLoading(true)
    try {
      // First verify the OTP
      const verifyResponse = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, userOtp }),
      })

      const verifyData = await verifyResponse.json()

      if (!verifyResponse.ok) {
        throw new Error(verifyData.error || "Failed to verify OTP")
      }

      // If verification successful, store email in MongoDB
      const storeResponse = await fetch("/api/store-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const storeData = await storeResponse.json()

      if (!storeResponse.ok) {
        console.error("Failed to store email:", storeData.error)
        // Still proceed even if storage fails
      }

      setStep("success")
      toast.success("Email verified and saved successfully")

      // Auto-close after 2 seconds and call onSuccess
      setTimeout(() => {
        handleClose()
        onSuccess()
      }, 2000)
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error(error instanceof Error ? error.message : "Invalid verification code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail("")
    setOtp("")
    setUserOtp("")
    setStep("email")
    onClose()
  }

  const handleBackToEmail = () => {
    setStep("email")
    setUserOtp("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-800">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-white">
              {step === "email" && "Email Required"}
              {step === "verification" && "Verify Email"}
              {step === "success" && "Email Verified"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">
          {step === "email" && (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Please provide your email address to proceed with compliance analysis. 
                We'll send you a verification code to confirm your email.
              </p>
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
                />
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={isLoading || !email}
                className="w-full gradient-button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </div>
          )}

          {step === "verification" && (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                We've sent a 6-digit verification code to <strong>{email}</strong>. 
                Please enter it below to proceed.
              </p>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-2">
                  Verification Code
                </label>
                <Input
                  id="otp"
                  type="text"
                  value={userOtp}
                  onChange={(e) => setUserOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="bg-gray-800 border-gray-700 text-white text-center text-lg tracking-widest"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleBackToEmail}
                  disabled={isLoading}
                  className="flex-1 border-gray-700 text-gray-300"
                >
                  Back
                </Button>
                <Button
                  onClick={handleVerifyOtp}
                  disabled={isLoading || !userOtp}
                  className="flex-1 gradient-button"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-400 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Email Verified!</h3>
              <p className="text-gray-300 text-sm mb-4">
                Your email has been successfully verified and saved. 
                Proceeding with compliance analysis...
              </p>
              <div className="flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-green-400" />
                <span className="text-green-400 text-sm">Processing...</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 