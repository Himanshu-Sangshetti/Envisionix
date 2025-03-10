import OpenAI from "openai";
import { cache } from "react"; // Ensure function is only run on the server

export const customizedPrompt = cache(async (
  prompt: string,
  modifications: {
    style?: string;
    lighting?: string;
    composition?: string;
    detailLevel?: number;
    negativePrompts?: string[];
  }
) => {
  const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY;

  if (!NEBIUS_API_KEY) {
    throw new Error("Missing NEBIUS_API_KEY. Ensure it is set in .env.local");
  }

  const client = new OpenAI({
    baseURL: "https://api.studio.nebius.com/v1/",
    apiKey: NEBIUS_API_KEY,
  });

  try {
    const response = await client.chat.completions.create({
      model: "microsoft/Phi-3.5-mini-instruct",
      max_tokens: 512,
      temperature: 0.2,
      top_p: 1,
      messages: [
        {
          role: "user",
          content: `Modify the following prompt according to these parameters:
          ${modifications.style ? `- Style: ${modifications.style}` : ""}
          ${modifications.lighting ? `- Lighting: ${modifications.lighting}` : ""}
          ${modifications.composition ? `- Composition: ${modifications.composition}` : ""}
          ${modifications.detailLevel ? `- Detail Level: ${modifications.detailLevel}` : ""}
          ${modifications.negativePrompts?.length ? `- Negative Prompts: ${modifications.negativePrompts.join(", ")}` : ""}
          
          Return only the modified prompt:
          Original Prompt: "${prompt}"`,
        },
      ],
    });

    const modifiedPrompt = response.choices[0]?.message?.content?.trim();
    if (!modifiedPrompt) throw new Error("Empty response from Phi-3");

    return modifiedPrompt;
  } catch (error) {
    console.error("Error modifying prompt:", error);
    return prompt; // Return original prompt if error occurs
  }
});
