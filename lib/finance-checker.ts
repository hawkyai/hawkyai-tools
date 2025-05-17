const ENDPOINT =
  "https://ai-riderhailingappai1824849404910565.openai.azure.com/openai/deployments/gpt-4o-rider-beta/chat/completions?api-version=2024-08-01-preview"
const API_KEY = "44be3ea1f359415fb95bbe350580e1c2"

const system = `You are an expert in financial advertisement regulations and must evaluate the following advertisement image for compliance with financial advertisement guidelines, particularly for issue advertisements (IPOs, securities offerings, etc.). Use the criteria below to analyze regulatory, ethical, and content-based violations in visual layout, claims, disclosures, or message tone.

IMPORTANT: Your response must be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other markdown syntax.`

const prompt = `You are given an advertisement image related to financial products or services. Your task is to analyze the ad copy and visual layout for regulatory and ethical compliance with financial advertisement guidelines, particularly for issue advertisements (IPOs, securities offerings, etc.).

IMPORTANT: Your response must be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other markdown syntax.

Evaluate the advertisement strictly using the following guidelines:

Respond with ONLY the following JSON structure:
{
  "compliance_summary": "Short summary of whether the ad aligns with financial advertisement guidelines",
  "guideline_violations": [
    {
      "id": "FIN-1",
      "rule": "Truthful & Clear Representation",
      "status": "fail",
      "description": "The advertisement contains misleading statements about guaranteed returns without necessary explanatory statements.",
      "suggestedFix": "Remove guarantees of rapid profit increase or qualify the claims with appropriate risk disclosures."
    }
  ],
  "overall_rating": "Compliant / Partially Compliant / Non-Compliant"
}

Include ALL compliance checks in your response, not just violations. For each guideline area below, include at least one entry in the guideline_violations array with a status of "pass", "warning", or "fail" as appropriate.

### Evaluate the Ad against the following Financial Advertisement Guidelines:

1. **Truthfulness and Clarity (9.1.1, 9.1.3, 9.1.4)**
   - Is the advertisement truthful, fair, and clear?
   - Does it avoid statements that give an exaggerated picture of performance?
   - Is the language clear, concise, and understandable?
   - Does it avoid excessive technical or legal terminology?
   - Does it avoid inaccurate portrayal of past performance?

2. **Complete Information Disclosure (9.1.2, 9.1.6, 9.1.11)**
   - If reproducing information from an offer document, is it reproduced in full with all relevant facts?
   - Does the ad avoid containing information not in the offer document?
   - If financial data is included, does it contain data for the past three years (sales, profit, share capital, etc.)?

3. **No Guarantees of Profits (9.1.5)**
   - Does the ad avoid statements that promise or guarantee rapid increase in profits?

4. **No Celebrities or Fictional Characters (9.1.7)**
   - Are there any models, celebrities, fictional characters, landmarks or caricatures displayed?

5. **Format and Presentation (9.1.8, 9.1.9, 9.1.10)**
   - Does the ad avoid appearing as crawlers on television?
   - Does it avoid issue slogans or brand names except normal commercial names?
   - Does it avoid non-factual and unsubstantiated titles or slogans?

6. **Risk Factors (9.1.12, 9.1.13)**
   - Does the ad include risk factors given equal importance (including print size)?
   - Is the print size of highlights and risk factors not less than point 7 size?
   - Does it contain the names of Issuer company, address, Lead Merchant Bankers, and Registrars?

7. **Timing and Corporate Advertising (9.1.14, 9.1.15)**
   - If this is a corporate advertisement, was it issued within 21 days of filing the offer document?
   - Does any product advertisement avoid reference to company performance during the restricted period?

8. **Subscription Status (9.1.16, 9.1.17)**
   - Does the ad avoid stating the issue has been fully subscribed while still open?
   - Are announcements regarding closure made only on the last closing date or when fully subscribed?

9. **No Improper Incentives (9.1.18)**
   - Does the ad avoid offering incentives beyond permissible underwriting commission and brokerage?

10. **NRI Information (9.1.19)**
    - If there's a reservation for NRIs, does the ad specify this and indicate where NRI applicants can procure forms?

Use critical judgment, flag unclear or borderline cases as "warning". Do not assume compliance if visual evidence is lacking. Base analysis only on what's visible or textually implied in the ad.

REMEMBER: Return ONLY the JSON object without any markdown formatting or additional text.`

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

export async function checkFinanceCompliance(image: Buffer): Promise<any> {
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
      }
    }
  } catch (error) {
    console.error("Error in Finance compliance check:", error)
    throw error
  }
}
