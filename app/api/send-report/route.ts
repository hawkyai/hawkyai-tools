import { Resend } from "resend"
import { NextResponse } from "next/server"

const resend = new Resend("re_Ho7ca4Sq_EJXWVtJc4FnaEhvVbmBojMPZ")

export async function POST(request: Request) {
  try {
    const { email, pdfBase64, standard } = await request.json()

    if (!email || !pdfBase64 || !standard) {
      return NextResponse.json(
        { error: "Email, PDF data, and standard are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Convert base64 to buffer for attachment
    let pdfBuffer
    try {
      const base64Data = pdfBase64.split(',')[1]
      if (!base64Data) {
        throw new Error("Invalid PDF data format")
      }
      pdfBuffer = Buffer.from(base64Data, 'base64')
    } catch (error) {
      console.error("Error converting PDF data:", error)
      return NextResponse.json(
        { error: "Invalid PDF data" },
        { status: 400 }
      )
    }

    // Send email with PDF attachment
    const { data, error } = await resend.emails.send({
      from: "Hawky <login@hawky.xyz>",
      to: email,
      subject: `Your Hawky ${standard.toUpperCase()} Compliance Report`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color:rgb(0, 0, 0); margin-bottom: 24px;">Your Compliance Report is Ready</h2>
          <p>Thank you for using Hawky.ai for your compliance analysis. Your ${standard.toUpperCase()} compliance report is attached to this email.</p>
          <p>If you have any questions or need further assistance, please don't hesitate to reach out to our support team.</p>
          <p>Best regards,<br>The Hawky Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `hawky-${standard}-compliance-report.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    if (error) {
      console.error("Resend API error:", error)
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Report sent successfully",
    })
  } catch (error) {
    console.error("Error sending report:", error)
    return NextResponse.json(
      { error: "Failed to send report" },
      { status: 500 }
    )
  }
} 