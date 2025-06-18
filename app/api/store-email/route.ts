import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("hawky-compliance")
    const collection = db.collection("emails")

    // Check if email already exists
    const existingEmail = await collection.findOne({ email })
    
    if (existingEmail) {
      // Update existing email
      await collection.updateOne(
        { email },
        { 
          $set: { 
            last_seen: new Date(),
            updated_at: new Date()
          }
        }
      )
    } else {
      // Insert new email
      await collection.insertOne({
        email,
        created_at: new Date(),
        last_seen: new Date(),
        source: "compliance_checker"
      })
    }

    return NextResponse.json({
      success: true,
      message: "Email stored successfully"
    })
  } catch (error) {
    console.error("Error storing email:", error)
    return NextResponse.json({ error: "Failed to store email" }, { status: 500 })
  }
} 