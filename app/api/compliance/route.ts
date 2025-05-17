import { type NextRequest, NextResponse } from "next/server"
import { checkAsciCompliance } from "@/lib/asci-checker"
import { checkWcagCompliance } from "@/lib/wcag-checker"
import { checkIrdaiCompliance } from "@/lib/irdai-checker"
import { checkFinanceCompliance } from "@/lib/finance-checker"
import { detectAdType } from "@/lib/ad-type-detector"

// This is a server-side API route that could be used for more complex processing
// or to keep API keys secure in a production environment

// Helper to convert a Blob/File to a Buffer in Node.js
async function fileToBuffer(file: Blob): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function GET() {
  return NextResponse.json({ message: "Compliance checker API is running" })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const standard = formData.get("standard") as string

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    if (!standard) {
      return NextResponse.json({ error: "No compliance standard specified" }, { status: 400 })
    }

    const imageBuffer = await fileToBuffer(image)

    // Validate ad type for selected standard
    const adType = await detectAdType(imageBuffer)

    // Validate ad type against selected standard
    if (standard === "irdai" && adType.ad_type !== "insurance") {
      return NextResponse.json(
        {
          error: `This appears to be a ${adType.ad_type} advertisement, not an insurance ad. IRDAI compliance checking is specifically for insurance ads.`,
        },
        { status: 400 }
      )
    }

    if (standard === "finance" && !["finance", "banking", "investment", "financial"].some((term) => adType.ad_type.includes(term))) {
      return NextResponse.json(
        {
          error: `This appears to be a ${adType.ad_type} advertisement, not a financial ad. Finance compliance checking is specifically for financial advertisements, IPOs, and securities offerings.`,
        },
        { status: 400 }
      )
    }

    // Run the appropriate compliance check based on the selected standard
    let result
    switch (standard) {
      case "asci":
        result = await checkAsciCompliance(imageBuffer)
        break
      case "wcag":
        result = await checkWcagCompliance(imageBuffer)
        break
      case "irdai":
        result = await checkIrdaiCompliance(imageBuffer)
        break
      case "finance":
        result = await checkFinanceCompliance(imageBuffer)
        break
      default:
        return NextResponse.json({ error: "Invalid compliance standard selected" }, { status: 400 })
    }

    if (!result) {
      return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
    }

    return NextResponse.json({ ...result, adType })
  } catch (error) {
    console.error("Error in analyze API:", error)
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 })
  }
} 