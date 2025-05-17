import { Resend } from "resend"
import { NextResponse } from "next/server"

// Initialize Resend with API key directly in the file
// Note: Hardcoding API keys is generally not recommended for security reasons
const resend = new Resend("re_Ho7ca4Sq_EJXWVtJc4FnaEhvVbmBojMPZ") // Replace with your actual Resend API key

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Generate OTP
    const otp = generateOTP()

    // Store OTP in a way that can be verified later
    // In a real app, you would store this in a database with an expiration
    // For demo purposes, we'll use a simple approach

    // Send email with OTP
    const { data, error } = await resend.emails.send({
      from: "Hawky <login@hawky.xyz>", // Replace with your verified domain
      to: email,
      subject: "Your Hawky Verification Code",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; margin-bottom: 24px;">Verify Your Email</h2>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 16px; border-radius: 4px; font-size: 24px; letter-spacing: 4px; text-align: center; margin: 24px 0;">
            <strong>${otp}</strong>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return the OTP for demo purposes
    // In production, don't return the actual OTP to the client
    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      // Only for development, remove in production:
      otp,
    })
  } catch (error) {
    console.error("Error sending OTP:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}
