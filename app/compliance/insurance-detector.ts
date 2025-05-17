const ENDPOINT =
  "https://ai-riderhailingappai1824849404910565.openai.azure.com/openai/deployments/gpt-4o-rider-beta/chat/completions?api-version=2024-08-01-preview"
const API_KEY = "44be3ea1f359415fb95bbe350580e1c2"

const system = `You are an AI assistant that specializes in identifying insurance advertisements.`

const prompt = `Analyze the provided image and determine if it's an insurance advertisement.

Look for:
1. Insurance company logos or branding
2. Insurance-related terms (policy, premium, coverage, claim, etc.)
3. Insurance product mentions (life insurance, health insurance, auto insurance, etc.)
4. IRDAI registration numbers or disclaimers
5. Insurance agent/broker information

Respond with ONLY a JSON object in this format:
{
  "is_insurance_ad": true/false,
  "confidence": "high/medium/low",
  "insurance_indicators": ["indicator1", "indicator2", ...]
}

Do not include any other text in your response.`

export async function detectInsuranceAd(image: File): Promise<boolean> {
  try {
    const base64 = await toBase64(image)

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
      // Parse the JSON response
      const result = JSON.parse(content)
      return result.is_insurance_ad === true
    } catch (error) {
      console.error("Failed to parse JSON response:", error)
      return false
    }
  } catch (error) {
    console.error("Error in insurance detection:", error)
    return false
  }
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}
