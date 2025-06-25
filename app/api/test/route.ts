import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "API routes are working!" })
}

export async function POST(request: Request) {
  const body = await request.json()
  return NextResponse.json({ 
    message: "POST request received", 
    data: body 
  })
} 