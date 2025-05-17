const ENDPOINT =
  "https://ai-riderhailingappai1824849404910565.openai.azure.com/openai/deployments/gpt-4o-rider-beta/chat/completions?api-version=2024-08-01-preview"
const API_KEY = "44be3ea1f359415fb95bbe350580e1c2"

const system = `You are an AI assistant that specializes in identifying advertisement types, with particular expertise in financial services and products.

IMPORTANT: Your response must be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other markdown syntax.`

const prompt = `Analyze the provided image and determine what type of advertisement it is.

IMPORTANT: Your response must be a valid JSON object WITHOUT any markdown formatting, code blocks, or additional text. Do not wrap your response in \`\`\`json or any other markdown syntax.

Look for:
1. Product or service category
2. Brand indicators
3. Industry-specific terminology
4. Visual elements that indicate the industry

For financial advertisements, consider these categories:
- Banking services (savings, loans, credit cards)
- Investment products (mutual funds, stocks, bonds)
- Insurance products (life, health, general)
- Financial technology (fintech) services
- Wealth management
- Financial education
- Real estate financing
- Business loans and financing
- Payment services
- Financial consulting

Respond with ONLY a JSON object in this format:
{
  "ad_type": "finance|banking|investment|insurance|fintech|wealth_management|real_estate_finance|business_finance|payment_services|financial_consulting|electronics|food|automotive|fashion|healthcare|travel|entertainment|other",
  "confidence": "high|medium|low",
  "description": "Brief description of what the ad is promoting",
  "indicators": ["indicator1", "indicator2", ...]
}

REMEMBER: Return ONLY the JSON object without any markdown formatting or additional text.`

export interface AdTypeResult {
  ad_type: string
  confidence: string
  description: string
  indicators: string[]
}

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

export async function detectAdType(image: Buffer): Promise<AdTypeResult> {
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
        temperature: 0.1,
        max_tokens: 500,
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
      return JSON.parse(processedContent) as AdTypeResult
    } catch (error) {
      console.error("Failed to parse JSON response:", error)
      console.error("Raw response:", content)

      return {
        ad_type: "other",
        confidence: "low",
        description: "Unable to determine ad type",
        indicators: [],
      }
    }
  } catch (error) {
    console.error("Error in ad type detection:", error)
    return {
      ad_type: "other",
      confidence: "low",
      description: "Error analyzing image",
      indicators: [],
    }
  }
}
