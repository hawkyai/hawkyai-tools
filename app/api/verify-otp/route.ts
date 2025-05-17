import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, otp, userOtp } = await request.json()

    if (!email || !otp || !userOtp) {
      return NextResponse.json({ error: "Email, OTP, and user input are required" }, { status: 400 })
    }

    // In a real application, you would fetch the stored OTP from a database
    // and check if it's valid and not expired

    // For demo purposes, we're directly comparing the OTPs
    if (otp === userOtp) {
      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
      })
    } else {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
