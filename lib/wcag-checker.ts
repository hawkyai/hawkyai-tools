const ENDPOINT =
  "https://ai-riderhailingappai1824849404910565.openai.azure.com/openai/deployments/gpt-4o-rider-beta/chat/completions?api-version=2024-08-01-preview"
const API_KEY = "44be3ea1f359415fb95bbe350580e1c2"

const system = `You are an expert in accessibility compliance, specifically WCAG 2.1 standards. Your task is to evaluate digital image advertisements for accessibility issues with extreme precision and thoroughness. You have deep knowledge of all WCAG success criteria and how they apply to digital advertisements.

IMPORTANT: Your response must be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other markdown syntax.`

const prompt = `
Analyze this advertisement image for WCAG 2.1 accessibility compliance. Your evaluation must be comprehensive, accurate, and applicable to any type of advertisement regardless of industry.

IMPORTANT: Your response must be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other markdown syntax.

Respond with ONLY the following JSON structure:
{
  "compliance_summary": "Brief summary of the ad's accessibility compliance.",
  "guideline_violations": [
    {
      "id": "1.1.1",
      "description": "Missing or irrelevant alt text.",
      "status": "fail",
      "rule": "1.1.1 Non-text Content (A)",
      "suggestedFix": "Add meaningful alt text to describe image content."
    }
    ...
  ],
  "overall_rating": "Compliant / Partially Compliant / Non-Compliant",
  "wcag_level": "A / AA / AAA",
  "wcag_level_explanation": "Explanation of why this ad meets or fails to meet specific WCAG levels"
}

Include ALL compliance checks in your response, not just violations. For each guideline area below, include at least one entry in the guideline_violations array with a status of "pass", "warning", or "fail" as appropriate.

### Evaluate the ad against the following WCAG 2.1 criteria:


1. **1.4.3 Contrast (Minimum) (AA)** 
   - Does all text maintain a minimum contrast ratio of 4.5:1 against its background?
   - For large text (18pt or 14pt bold), is the contrast ratio at least 3:1?
   - Check text over images, gradients, or complex backgrounds particularly carefully.

2. **1.4.5 Images of Text (AA)** 
   - Is text presented as actual text rather than within images?
   - Are there any instances where text is embedded in images unnecessarily?
   - Exceptions are allowed for logos or primary design elements when the presentation is essential.

3. **1.4.1 Use of Color (A)** 
   - Is color not the only visual means of conveying information?
   - Are there additional indicators (text, patterns, icons) to convey information beyond color?
   - Would the ad be understandable in grayscale?

4. **1.4.11 Non-text Contrast (AA)** 
   - Do other components apart from text have at least a 3:1 contrast ratio with adjacent colors?
   - Do graphical objects that convey information have sufficient contrast?


5. **3.1.1 Language of Page (A)** 
    - Is the primary language of the ad content properly declared or identifiable?
    - Would assistive technologies correctly identify the language?

6. **3.1.2 Language of Parts (AA)** 
    - If multiple languages are used, are those parts correctly identified?
    - Would screen readers pronounce foreign words correctly?

7. **1.3.1 Info and Relationships (A)** 
    - Is the content structure logical and conveyed through proper semantic markup?
    - Would the ad's structure make sense when read by a screen reader?


For each criterion:
1. Examine the ad thoroughly
2. Determine if it passes, fails, or needs warning
3. Provide specific details about what was found
4. For failures or warnings, suggest specific fixes

After evaluating all criteria, determine the highest WCAG level (A, AA, or AAA) that the ad fully complies with:
- If all Level A criteria pass, the ad is "A" compliant
- If all Level A and AA criteria pass, the ad is "AA" compliant
- If all Level A, AA, and AAA criteria pass, the ad is "AAA" compliant
- If any Level A criteria fail, the ad is "Not Compliant"

Be extremely precise in your analysis. If you cannot determine compliance for a specific criterion due to limitations in the static image, mark it as "warning" and explain what would need to be verified in the actual implementation.

DO NOT fabricate passes. If you cannot verify compliance, indicate this clearly.

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

export async function checkWcagCompliance(image: Buffer): Promise<any> {
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
          { role: "system", content: system },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: base64Url } },
            ],
          },
        ],
        temperature: 0.1, // Lower temperature for more consistent results
        max_tokens: 3000, // Increased token limit for more comprehensive analysis
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
      console.log("Processed content:", processedContent.substring(0, 100) + "...")

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
        wcag_level: "Unknown",
        wcag_level_explanation: "Could not determine WCAG compliance level due to processing error.",
      }
    }
  } catch (error) {
    console.error("Error in WCAG compliance check:", error)
    throw error
  }
}
