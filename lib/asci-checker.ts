const ENDPOINT =
  "https://ai-riderhailingappai1824849404910565.openai.azure.com/openai/deployments/gpt-4o-rider-beta/chat/completions?api-version=2024-08-01-preview"
const API_KEY = "44be3ea1f359415fb95bbe350580e1c2"

const system = `You are an expert in Indian advertising regulations and must evaluate the following advertisement image for compliance with the Advertising Standards Council of India (ASCI) Code. Use the criteria below to analyze ethical, legal, and content-based violations in visual layout, claims, influencers, disclaimers, or message tone.

IMPORTANT: Your response must be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other markdown syntax.
`

const prompt = `You are given an advertisement image. Your task is to analyze the ad copy and visual layout for regulatory, ethical, and accessibility compliance across all industries.

IMPORTANT: Your response must be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other markdown syntax.

Evaluate the advertisement strictly using the following:

Respond with ONLY the following JSON structure:
{
  "compliance_summary": "Short summary of whether the ad aligns with ASCI code",
  "guideline_violations": [
    {
      "id": "ASCI-1",
      "rule": "Truthful & Honest Representation",
      "status": "fail",
      "description": "The claim of '100% guaranteed weight loss' is misleading and unsubstantiated.",
      "suggestedFix": "Qualify the claim or provide evidence and cite the source visibly."
    }
  ],
  "overall_rating": "Compliant / Partially Compliant / Non-Compliant",
  "is_insurance_ad": true/false
}

Include ALL compliance checks in your response, not just violations. For each guideline area below, include at least one entry in the guideline_violations array with a status of "pass", "warning", or "fail" as appropriate.

### Evaluate the Ad against the following ASCI Guideline Areas:

1. **Truthful & Honest Representation**
   - Are all claims substantiated with evidence?
   - Are visuals or statements exaggerated beyond reasonable expectations?
   - Is consumer trust abused or vulnerable audiences exploited?
   - Is any part of the message misleading by omission or implication?

2. **Influencer Advertising in Digital Media**
   - Is there proper disclosure such as "Ad", "Sponsored", or "Collaboration"?
   - If a virtual influencer is used, is their artificial nature disclosed?
   - Does the influencer present claims responsibly and substantiate them?
   - Are finance/health influencers qualified and showing credentials?

3. **Online Deceptive Design Patterns**
   - Does the ad avoid tactics like bait-and-switch, drip pricing, or false urgency?
   - Are any disguised ads clearly marked as such?

4. **Virtual Digital Asset (VDA) Advertising**
   - Is there a visible risk disclaimer in the correct language?
   - Are terms like "currency" or "guaranteed income" avoided?
   - Are celebrities/minors improperly shown endorsing financial risk?

5. **Disclaimers**
   - Are disclaimers easy to read, properly timed, and not contradictory to claims?
   - Are they presented clearly across visual/audio formats?

6. **Against Harmful Products or Messages**
   - Does the ad avoid encouraging crime, discrimination, intolerance, or unsafe acts?
   - Are children or vulnerable communities handled with care?
   - Does the ad avoid surrogate promotion of banned items (e.g., liquor, tobacco)?

7. **Gender Stereotypes**
   - Does the ad avoid unrealistic gender roles or sexual objectification?
   - Does it refrain from equating success with beauty or body type?
   - Are children's roles not based on stereotyped gender behavior?

8. **Charitable Cause Advertising**
   - Is guilt-shaming or undignified representation of beneficiaries avoided?
   - Is fund usage or platform fee info transparently shared?

9. **Environmental/Green Claims**
   - Are environmental claims backed by data or lifecycle assessments?
   - Are comparisons or superlatives justified and meaningful?
   - Are future claims based on actual plans?

Use critical judgment, flag unclear or borderline cases as "warning". Do not assume compliance if visual evidence is lacking. Base analysis only on what's visible or textually implied in the ad.

Also, please include an "is_insurance_ad": true/false field in your JSON response to indicate if this appears to be an insurance advertisement.

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

export async function checkAsciCompliance(image: Buffer): Promise<any> {
  try {
    const base64 = image.toString('base64')
    const base64Url = `data:image/jpeg;base64,${base64}`

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
                  url: base64Url,
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
        is_insurance_ad: false,
      }
    }
  } catch (error) {
    console.error("Error in ASCI compliance check:", error)
    throw error
  }
}
