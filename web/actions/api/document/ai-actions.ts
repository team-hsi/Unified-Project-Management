"use server";

import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export interface AIActionResult {
  success: boolean;
  result?: string;
  error?: string;
}

export async function processTextWithAI(
  prevState: AIActionResult | null,
  formData: FormData
): Promise<AIActionResult> {
  try {
    const action = formData.get("action") as string;
    const text = formData.get("text") as string;
    const html = formData.get("html") as string;

    // Check if we have the API key
    const apiKey = process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_P;

    if (!apiKey) {
      return {
        success: false,
        error:
          "Groq API key is missing. Please check your environment variables.",
      };
    }

    if (!action || !text) {
      return {
        success: false,
        error: "Missing required parameters",
      };
    }

    let prompt = "";

    // If we have HTML, use it to preserve formatting
    if (html) {
      switch (action) {
        case "fix":
          prompt = `Fix any grammar, spelling, or punctuation mistakes in the following HTML content. Keep ALL HTML tags and formatting exactly the same, only fix the text content inside the tags. Return the corrected HTML:

${html}`;
          break;
        case "improve":
          prompt = `Improve the writing quality, clarity, and flow of the text in the following HTML content. Keep ALL HTML tags and formatting exactly the same, only improve the text content inside the tags. Return the improved HTML:

${html}`;
          break;
        case "simplify":
          prompt = `Rewrite the text in the following HTML content to make it simpler and easier to understand. Keep ALL HTML tags and formatting exactly the same, only simplify the text content inside the tags. Return the simplified HTML:

${html}`;
          break;
        case "detail":
          prompt = `Expand the text in the following HTML content by adding more detail, examples, and context. Keep ALL HTML tags and formatting exactly the same, only expand the text content inside the tags. Return the expanded HTML:

${html}`;
          break;
        case "summarize":
          prompt = `Create a concise summary of the text in the following HTML content. Keep ALL HTML tags and formatting exactly the same, only summarize the text content inside the tags. Return the summarized HTML:

${html}`;
          break;
        case "professional":
          prompt = `Rewrite the text in the following HTML content to make it more professional and formal. Keep ALL HTML tags and formatting exactly the same, only make the text content more professional. Return the professional HTML:

${html}`;
          break;
        case "casual":
          prompt = `Rewrite the text in the following HTML content to make it more casual and conversational. Keep ALL HTML tags and formatting exactly the same, only make the text content more casual. Return the casual HTML:

${html}`;
          break;
        default:
          return {
            success: false,
            error: "Invalid action",
          };
      }
    } else {
      // Fallback to plain text prompts if no HTML is provided
      switch (action) {
        case "fix":
          prompt = `Fix any grammar, spelling, or punctuation mistakes in the following text. Return ONLY the corrected text without any explanations:

"${text}"`;
          break;
        case "improve":
          prompt = `Improve the writing quality, clarity, and flow of the following text while maintaining its original meaning. Return ONLY the improved text without any explanations:

"${text}"`;
          break;
        case "simplify":
          prompt = `Rewrite the following text to make it simpler and easier to understand. Return ONLY the simplified text without any explanations:

"${text}"`;
          break;
        case "detail":
          prompt = `Expand the following text by adding more detail, examples, and context. Return ONLY the expanded text without any explanations:

"${text}"`;
          break;
        case "summarize":
          prompt = `Create a concise summary of the following text. Return ONLY the summary without any explanations:

"${text}"`;
          break;
        case "professional":
          prompt = `Rewrite the following text to make it more professional and formal. Return ONLY the professional version without any explanations:

"${text}"`;
          break;
        case "casual":
          prompt = `Rewrite the following text to make it more casual and conversational. Return ONLY the casual version without any explanations:

"${text}"`;
          break;
        default:
          return {
            success: false,
            error: "Invalid action",
          };
      }
    }
    // const groq = createGroq({
    //   apiKey: apiKey,
    // });
    const { text: result } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
      maxTokens: 1000,
      temperature: 0.2,
    });

    // Clean up the response
    let cleanedResult = result.trim();

    // If we sent HTML, the response should be HTML, so we don't need to clean it as much
    if (!html) {
      // Remove common wrapper phrases for plain text responses
      const unwantedPhrases = [
        "Here's the corrected text:",
        "Here's the improved text:",
        "Here's the simplified text:",
        "Here's the expanded text:",
        "Here's the summary:",
        "Here's the professional version:",
        "Here's the casual version:",
        "Corrected text:",
        "Improved text:",
        "Simplified text:",
        "Expanded text:",
        "Summary:",
        "Professional version:",
        "Casual version:",
      ];

      // Remove unwanted phrases from the beginning
      for (const phrase of unwantedPhrases) {
        if (cleanedResult.toLowerCase().startsWith(phrase.toLowerCase())) {
          cleanedResult = cleanedResult.substring(phrase.length).trim();
          break;
        }
      }

      // Remove quotes if the entire response is wrapped in quotes
      if (cleanedResult.startsWith('"') && cleanedResult.endsWith('"')) {
        cleanedResult = cleanedResult.slice(1, -1);
      }
    }

    return {
      success: true,
      result: cleanedResult,
    };
  } catch (error) {
    console.error("AI processing error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to process with AI",
    };
  }
}
