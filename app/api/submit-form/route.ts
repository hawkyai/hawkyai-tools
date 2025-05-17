import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Get form data from request
    const formData = await request.json()

    // Format data for Sheety API
    const body = {
      sheet1: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        source: formData.referralSource,
        date: new Date().toISOString().split("T")[0], // Just the date part YYYY-MM-DD
      },
    }

    console.log("Submitting to Sheety:", body)

    // Send data to Sheety API
    const response = await fetch("https://api.sheety.co/a7c2ca819c40cdf7e56412728ce3216f/websiteContact/sheet1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    // Get response data
    let responseData
    try {
      responseData = await response.json()
    } catch (e) {
      console.error("Could not parse response as JSON")
    }

    // Log response for debugging
    console.log("Sheety response status:", response.status)
    console.log("Sheety response:", responseData)

    if (!response.ok) {
      // Return error response
      return NextResponse.json(
        {
          success: false,
          error: `API error: ${response.status}`,
          details: responseData || {},
        },
        { status: 500 },
      )
    }

    // Return success response
    return NextResponse.json({ success: true, data: responseData })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ success: false, error: "Server error processing your request" }, { status: 500 })
  }
}
