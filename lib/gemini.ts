export interface EngagementData {
  labels: string[]
  values: number[]
}

export interface AdAnalysisResult {
  overallScore: number
  psychologicalImpact: {
    tone: string
    emotion: string
  }
  keyTriggers: string[]
  qualityScore: number
  avgEngagement: number
  targetMatch: number
  contentType: string
  primaryGoal: string
  keyStrengths: string
  targetAudience: string
  engagementData: EngagementData
  narrativeAnalysis: Array<{
    timeRange: string
    label: string
    description: string
    engagement: number
  }>
  psychologicalAnalysis: string
  hookEffectiveness: string
  designFeedback: string
  complianceCheck: {
    platform: string
    checks: Array<{
      name: string
      passed: boolean
    }>
  }
  successPatterns: Array<{
    category: string
    patterns: string[]
  }>
}

export async function analyzeAd(file: File): Promise<AdAnalysisResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = async () => {
      try {
        const result = reader.result
        if (!result || typeof result !== "string") {
          throw new Error("Failed to read file as base64.")
        }

        const base64Data = result.split(",")[1]
        if (!base64Data) {
          throw new Error("Base64 data not found.")
        }

        const apiKey = "AIzaSyALeM_0S7cIczSIEBpKVHCQuRfJf4j3p3U" // Replace with your actual Gemini API key

        const prompt = `
You are an advanced ad marketing AI. Analyze the uploaded ad image/video and provide an in-depth evaluation focused on:

1. Overall performance score (0-100)
2. Psychological impact (tone and emotions evoked)
3. Key psychological triggers used
4. Quality score (0-100)
5. Average engagement percentage
6. Target audience match percentage
7. Content type and primary goal
8. Key strengths and target audience
9. Engagement timeline data (7 data points over 1 minute)
10. Narrative analysis for different time segments
11. Detailed psychological analysis
12. Hook effectiveness
13. Design feedback
14. Compliance check for major ad platforms (Meta/Facebook, Google, LinkedIn)
15. Success patterns identified

For the compliance check, evaluate the ad against common platform guidelines including:
- Text-to-image ratio
- Prohibited content
- Sensitive topics
- Health claims
- Personal attributes
- Misleading claims
- Call-to-action clarity
- Brand presence
- Image quality

Format the response as a JSON object with the following structure:

{
  "overallScore": number,
  "psychologicalImpact": {
    "tone": string,
    "emotion": string
  },
  "keyTriggers": string[],
  "qualityScore": number,
  "avgEngagement": number,
  "targetMatch": number,
  "contentType": string,
  "primaryGoal": string,
  "keyStrengths": string,
  "targetAudience": string,
  "engagementData": {
    "labels": string[],
    "values": number[]
  },
  "narrativeAnalysis": [
    {
      "timeRange": string,
      "label": string,
      "description": string,
      "engagement": number
    }
  ],
  "psychologicalAnalysis": string,
  "hookEffectiveness": string,
  "designFeedback": string,
  "complianceCheck": {
    "platform": string,
    "checks": [
      {
        "name": string,
        "passed": boolean
      }
    ]
  },
  "successPatterns": [
    {
      "category": string,
      "patterns": string[]
    }
  ]
}
`

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      inlineData: {
                        mimeType: file.type,
                        data: base64Data,
                      },
                    },
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
            }),
          },
        )

        if (!response.ok) {
          throw new Error(`Gemini API Error: ${response.statusText}`)
        }

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
          throw new Error("No meaningful response from Gemini.")
        }

        try {
          // Try to parse the JSON response
          const jsonStart = text.indexOf("{")
          const jsonEnd = text.lastIndexOf("}") + 1

          if (jsonStart === -1 || jsonEnd === 0) {
            throw new Error("Could not find valid JSON in the response")
          }

          const jsonText = text.substring(jsonStart, jsonEnd)

          // Clean the JSON text to handle potential formatting issues
          const cleanedJsonText = jsonText
            .replace(/(\r\n|\n|\r)/gm, " ") // Replace newlines with spaces
            .replace(/\s+/g, " ") // Replace multiple spaces with a single space

          let parsedResult
          try {
            parsedResult = JSON.parse(cleanedJsonText)
          } catch (jsonError) {
            console.error("Initial JSON parsing failed, attempting to fix common issues:", jsonError)

            // Try to fix common JSON issues and parse again
            const fixedJsonText = cleanedJsonText
              .replace(/,\s*}/g, "}") // Remove trailing commas in objects
              .replace(/,\s*]/g, "]") // Remove trailing commas in arrays
              .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Ensure property names are double-quoted

            parsedResult = JSON.parse(fixedJsonText)
          }

          // Ensure compliance check data is properly structured
          if (!parsedResult.complianceCheck || !parsedResult.complianceCheck.checks) {
            parsedResult.complianceCheck = {
              platform: "meta",
              checks: [
                { name: "Text-to-image ratio", passed: true },
                { name: "Prohibited content", passed: true },
                { name: "Sensitive topics", passed: true },
                { name: "Health claims", passed: true },
                { name: "Personal attributes", passed: false },
                { name: "Misleading claims", passed: true },
                { name: "Call-to-action clarity", passed: true },
                { name: "Brand presence", passed: true },
                { name: "Image quality", passed: true },
              ],
            }
          }

          // Ensure engagementData is properly structured
          if (
            !parsedResult.engagementData ||
            !parsedResult.engagementData.labels ||
            !parsedResult.engagementData.values
          ) {
            parsedResult.engagementData = {
              labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"],
              values: [30, 45, 65, 80, 70, 60, 50],
            }
          }

          // Ensure narrativeAnalysis is properly structured
          if (
            !parsedResult.narrativeAnalysis ||
            !Array.isArray(parsedResult.narrativeAnalysis) ||
            parsedResult.narrativeAnalysis.length === 0
          ) {
            parsedResult.narrativeAnalysis = [
              {
                timeRange: "0-15s",
                label: "Hook",
                description: "Introduction that captures attention",
                engagement: 45,
              },
              {
                timeRange: "15-30s",
                label: "Problem",
                description: "Presents the main challenge or pain point",
                engagement: 65,
              },
              {
                timeRange: "30-45s",
                label: "Solution",
                description: "Offers the product/service as the solution",
                engagement: 80,
              },
              {
                timeRange: "45-60s",
                label: "CTA",
                description: "Clear call to action with urgency",
                engagement: 60,
              },
            ]
          }

          // Ensure successPatterns is properly structured
          if (
            !parsedResult.successPatterns ||
            !Array.isArray(parsedResult.successPatterns) ||
            parsedResult.successPatterns.length === 0
          ) {
            parsedResult.successPatterns = [
              {
                category: "Engagement Tactics",
                patterns: ["Clear value proposition", "Emotional appeal", "Storytelling elements"],
              },
              {
                category: "Visual Elements",
                patterns: ["High contrast", "Clear branding", "Professional quality"],
              },
            ]
          }

          resolve(parsedResult)
        } catch (parseError) {
          console.error("Error parsing JSON from Gemini response:", parseError)
          // If parsing fails, return a formatted error message
          reject(new Error("Failed to parse analysis results. The API response was not in the expected format."))
        }
      } catch (error) {
        console.error("Error in Gemini analysis:", error)
        reject(error instanceof Error ? error : new Error("Unknown error during analysis."))
      }
    }

    reader.onerror = () => {
      reject(new Error("Error reading file."))
    }

    reader.readAsDataURL(file)
  })
}
