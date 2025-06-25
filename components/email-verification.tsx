"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, CheckCircle, Mail } from "lucide-react"

interface EmailVerificationProps {
  onVerificationComplete?: () => void
}

export function EmailVerification({ onVerificationComplete }: EmailVerificationProps) {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [userOtp, setUserOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email address")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/compliance-checker/api/send-otp", {
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

      // In development, we're getting the OTP from the response
      // In production, this would come from the user's email
      setOtp(data.otp)
      setIsSent(true)
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
      const response = await fetch("/compliance-checker/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, userOtp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP")
      }

      setIsVerified(true)
      toast.success("Email verified successfully")

      if (onVerificationComplete) {
        onVerificationComplete()
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error(error instanceof Error ? error.message : "Invalid verification code")
    } finally {
      setIsLoading(false)
    }
  }

  if (isVerified) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-gray-900 border border-gray-800 rounded-lg">
        <CheckCircle className="h-12 w-12 text-green-400 mb-4" />
        <h3 className="text-xl font-medium mb-2">Email Verified</h3>
        <p className="text-gray-400 text-center mb-4">Your email has been successfully verified.</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
      <h3 className="text-xl font-medium mb-4">Email Verification</h3>

      {!isSent ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <Button onClick={handleSendOtp} disabled={isLoading} className="w-full">
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
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium mb-1">
              Verification Code
            </label>
            <Input
              id="otp"
              type="text"
              value={userOtp}
              onChange={(e) => setUserOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              className="bg-gray-800 border-gray-700"
              maxLength={6}
            />
            <p className="text-sm text-gray-400 mt-1">A verification code has been sent to {email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsSent(false)} disabled={isLoading} className="flex-1">
              Back
            </Button>
            <Button onClick={handleVerifyOtp} disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
