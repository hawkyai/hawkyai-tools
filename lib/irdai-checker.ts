const ENDPOINT =
  "https://ai-riderhailingappai1824849404910565.openai.azure.com/openai/deployments/gpt-4o-rider-beta/chat/completions?api-version=2024-08-01-preview"
const API_KEY = "44be3ea1f359415fb95bbe350580e1c2"

const system = `You are a highly trained advertising compliance reviewer with deep expertise in regulatory, ethical, and platform-specific guidelines for advertisements, including IRDAI norms where applicable.

IMPORTANT: Your response must be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other markdown syntax.`

const prompt = `You are given an advertisement image. Your task is to analyze the ad copy and visual layout for regulatory, ethical, and accessibility compliance across all industries, with additional emphasis on IRDAI guidelines if the ad relates to insurance. Do not fabricate compliance responses — false assurances can mislead users and harm the organization.

IMPORTANT: Your response must be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other markdown syntax.

Evaluate the advertisement strictly using the following 12-point checklist:

## Ad Compliance & Ethical Review Checklist ##
1. IRDAI Registration Number (if insurance-related)
- Must be visible, readable (≥9pt font), and placed prominently (usually bottom or footer). Required for insurers/intermediaries only.

2. Spurious Call Warning (if insurance-related)
- Mandatory verbatim text: "BEWARE OF SPURIOUS PHONE CALLS AND FICTITIOUS/FRAUDULENT OFFERS. IRDAI is not involved in activities like selling insurance policies, announcing bonus or investment of premiums. Public receiving such phone calls are requested to lodge a police complaint."
- Must be in a prominent box or shown for ≥5s in videos.

3. No Misleading Information
- Content must not be ambiguous, exaggerated, or misleading. Claims (e.g., "guaranteed returns") must be fact-based and provable.

4. Identity and Contact Details
- Ad must clearly show brand or advertiser's name and contact info (e.g., toll-free, email, website) for consumer follow-up or trust-building.

5. Rating/Award Claims
- Ratings/awards must be disclosed with credible source names, dates, and no ambiguity (e.g., "Rated by XYZ Agency, 2024").

6. No Market Ranking Claims
- Ads must avoid self-rankings or unverified titles (e.g., "#1 in India") unless validated by a cited, verifiable source.

7. Product-Specific Disclosures
- Ads promoting a product/service must mention key features, limitations, and provide a link or prompt for full info. No hidden terms.

8. Language Compliance
- If not in English/Hindi, ad creators must file a certified translation with relevant authorities (assume compliance unless non-standard dialect or mismatch is evident).

9. Consumer Education
- Especially for regulated sectors, ads must clarify that regulators (like IRDAI) don't sell policies or guarantee bonuses. Educate against fraud.

10. ASCI Code Compliance
- Ads must follow the Advertising Standards Council of India's (ASCI) ethical code: No harmful visuals, misleading tone, or indecent portrayal.

11. Platform-Specific Compliance
- Ads on digital/social media must contain required disclosures in the image, caption, or linked landing page. For ISNP/insurance, IRDAI permission is required.

12. Accessibility and Readability
- All content must be legible on mobile and desktop — clear fonts, sufficient contrast, no overcrowding.

### TASK ###
Return your evaluation in structured JSON format:
{
  "compliance_summary": "Short summary of whether the ad aligns with IRDAI and other applicable guidelines",
  "guideline_violations": [
    {
      "id": "unique-id",
      "rule": "Issue title",
      "status": "pass/warning/fail",
      "description": "Detailed description of what's right/wrong",
      "suggestedFix": "Clear fix recommendation"
    }
  ],
  "overall_rating": "Compliant / Partially Compliant / Non-Compliant",
  "is_insurance_ad": true
}

IMPORTANT: Include ALL compliance checks in your response, not just violations. For each of the 12 checklist items above, include at least one entry in the guideline_violations array with a status of "pass", "warning", or "fail" as appropriate.

Important:
- DO NOT generate false passes.
- Use your best judgment to handle ads outside the insurance domain.
- Use visual cues (branding, context) to determine industry if not obvious.
- If unsure about regulation applicability, flag it as a warning and suggest validation.

REMEMBER: Return ONLY the JSON object without any markdown formatting or additional text.
`

/**
 * Preprocesses the API response to extract JSON when it might be wrapped in markdown code blocks
 */
function preprocessJsonResponse(content: string): string {
  // Check if the response is wrapped in markdown code blocks
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)```/
  const match = content.match(jsonBlockRegex)

  if (match && match[1]) {
    // Return the content inside the code block
    return match[1].trim()
  }

  // If no code blocks found, return the original content
  return content.trim()
}

export async function checkIrdaiCompliance(image: Buffer): Promise<any> {
  try {
    const base64 = `data:image/jpeg;base64,${image.toString('base64')}`

    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: system,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: base64,
                },
              },
            ],
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error("No response content from API")
    }

    try {
      // Preprocess the content to handle markdown code blocks
      const processedContent = preprocessJsonResponse(content)

      // Parse the JSON response
      return JSON.parse(processedContent)
    } catch (error) {
      console.error("Failed to parse JSON response:", error)
      console.error("Raw response:", content.substring(0, 500) + "...")

      // Create a fallback response with the error information
      return {
        compliance_summary:
          "Error parsing compliance results. The analysis was completed but there was an issue processing the response.",
        guideline_violations: [
          {
            id: "error-1",
            rule: "Error Processing Results",
            status: "warning",
            description:
              "The compliance check was run, but there was an error processing the results. Please try again.",
            suggestedFix: "Try running the analysis again or contact support if the issue persists.",
          },
        ],
        overall_rating: "Unknown",
        is_insurance_ad: true,
      }
    }
  } catch (error) {
    console.error("Error in IRDAI compliance check:", error)
    throw error
  }
}
