const ENDPOINT =
  "https://ai-riderhailingappai1824849404910565.openai.azure.com/openai/deployments/gpt-4o-rider-beta/chat/completions?api-version=2024-08-01-preview";
const API_KEY = "44be3ea1f359415fb95bbe350580e1c2";

const system = `You are an expert in accessibility compliance, specifically WCAG 2.1 standards. Your task is to evaluate digital image advertisements for accessibility issues with extreme precision and thoroughness. You have deep knowledge of all WCAG success criteria and how they apply to digital advertisements.

IMPORTANT: Your response must be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other markdown syntax.`;

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

1. **1.1.1 Non-text Content (A)**
   - Are all images or non-text content described with appropriate alt text?

2. **1.4.3 Contrast (Minimum) (AA)**
   - Does all text maintain a minimum contrast ratio of 4.5:1 against its background?
   - Large text (18pt or 14pt bold): At least 3:1 contrast?

3. **1.4.5 Images of Text (AA)**
   - Are images of text avoided except where necessary (e.g., logos)?
   - Is actual text used where possible instead of embedding text in images?

4. **1.4.1 Use of Color (A)**
   - Is color not the only means of conveying information?
   - Are there backup indicators (text, icons, patterns)?

5. **2.3.1 Three Flashes or Below Threshold (A)**
   - Does any animated content flash more than three times per second?

6. **2.4.7 Focus Visible (AA)**
   - Is there a visible focus indicator for all interactive elements?

7. **1.2.2 Captions (Pre-recorded) (A)**
   - Are captions provided for all pre-recorded video content?

8. **1.3.1 Info and Relationships (A)**
   - Is the content structure conveyed using semantic HTML (e.g., proper headings, lists)?

9. **2.1.1 Keyboard (A)**
   - Can all functionality be used via keyboard only?

10. **1.4.4 Resize Text (AA)**
    - Can text be resized up to 200% without loss of content or functionality?

After evaluating all criteria, determine the highest WCAG level (A, AA, or AAA) that the ad fully complies with:
- If all Level A criteria pass, the ad is "A" compliant
- If all Level A and AA criteria pass, the ad is "AA" compliant
- If all Level A, AA, and AAA criteria pass, the ad is "AAA" compliant
- If any Level A criteria fail, the ad is "Not Compliant"

Be extremely precise in your analysis. If you cannot determine compliance for a specific criterion due to limitations in the static image, mark it as "warning" and explain what would need to be verified in the actual implementation.

DO NOT fabricate passes. If you cannot verify compliance, indicate this clearly.

REMEMBER: Return ONLY the JSON object without any markdown formatting or additional text.
`;

/**
 * Preprocesses the API response to extract JSON when it might be wrapped in markdown code blocks
 */
function preprocessJsonResponse(content: string): string {
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)```/;
  const match = content.match(jsonBlockRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return content.trim();
}

export async function checkWcagCompliance(image: Buffer): Promise<any> {
  try {
    const base64 = image.toString("base64");
    const base64Url = `data:image/jpeg;base64,${base64}`;

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
        temperature: 0.1,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response content from API");
    }

    try {
      const processedContent = preprocessJsonResponse(content);
      console.log("Processed content:", processedContent.substring(0, 100) + "...");
      return JSON.parse(processedContent);
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      console.error("Raw response:", content.substring(0, 500) + "...");

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
            suggestedFix:
              "Try running the analysis again or contact support if the issue persists.",
          },
        ],
        overall_rating: "Unknown",
        wcag_level: "Unknown",
        wcag_level_explanation:
          "Could not determine WCAG compliance level due to processing error.",
      };
    }
  } catch (error) {
    console.error("Error in WCAG compliance check:", error);
    throw error;
  }
}

