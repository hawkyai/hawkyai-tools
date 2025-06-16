"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendlyEmbed } from "./calendly-embed"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PhoneInput } from "./phone-input"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  referralSource: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export function GetDemoForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)

      // Send data to our server-side API route
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Form submission error:", result)
        throw new Error(result.error || "Error submitting form")
      }

      // Store the form data for Calendly
      setFormData(data)

      // Move to the next step (Calendly) even if there was an issue with Sheety
      // This ensures users can still book a demo even if the sheet update fails
      setStep(2)
    } catch (error) {
      console.error("Error submitting form:", error)

      // Provide a helpful error message but still allow proceeding to Calendly
      if (error instanceof Error) {
        setSubmitError(
          `Note: There was an issue saving your information (${error.message}). You can still proceed to schedule your demo.`,
        )
      } else {
        setSubmitError("Note: There was an issue saving your information. You can still proceed to schedule your demo.")
      }

      // Store the form data anyway
      setFormData(data)

      // Option to proceed despite the error
      setTimeout(() => {
        setStep(2)
      }, 3000) // Give user 3 seconds to read the error before proceeding
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-1 rounded-xl border border-gray-3/20 p-6 md:p-8">
      {step === 1 ? (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-white">Book Your Demo</h2>
            <p className="text-gray-9">
              Fill out the form below and we'll get in touch to schedule your personalized demo.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Business Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.name@company.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <div className="w-full">
                <PhoneInput
                  id="phone"
                  {...register("phone")}
                  className={`w-full ${errors.phone ? "border-red-500" : ""}`}
                  onChange={(e) => {
                    // This ensures the phone input value is properly set in the form
                    if (e.target) {
                      setValue("phone", e.target.value)
                    }
                  }}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralSource">Where did you hear about Hawky.ai? (Optional)</Label>
              <Select onValueChange={(value) => setValue("referralSource", value)}>
                <SelectTrigger id="referralSource" className={errors.referralSource ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Search</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="friend">Friend or Colleague</SelectItem>
                  <SelectItem value="event">Event or Conference</SelectItem>
                  <SelectItem value="ad">Advertisement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.referralSource && <p className="text-red-500 text-sm mt-1">{errors.referralSource.message}</p>}
            </div>

            {submitError && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-md">
                <p className="text-amber-500 text-sm">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-10 bg-white text-black font-medium rounded-md shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Book Demo"
              )}
            </button>

            <p className="text-xs text-gray-8 text-center mt-4">
              By submitting this form, you agree to our{" "}
              <a href="https://boundless-group-558.notion.site/Hawky-ai-Privacy-Policy-7b225ca0295c40a09a365f2fbee46ef0" className="text-[#ee2a7b] hover:underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://www.hawky.ai/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="text-[#ee2a7b] hover:underline">
                Terms of Service
              </a>
              .
            </p>
          </form>
        </>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-white">Schedule Your Demo</h2>
            <p className="text-gray-9">Choose a convenient time for your personalized Hawky.ai demo.</p>
          </div>

          <CalendlyEmbed userEmail={formData?.email} userName={formData?.name} />

          <button
            className="w-full h-10 border border-gray-3/20 bg-transparent text-white font-medium rounded-md hover:bg-gray-2 transition-colors mt-4"
            onClick={() => {
              setStep(1)
              reset()
            }}
          >
            Back to Form
          </button>
        </div>
      )}
    </div>
  )
}