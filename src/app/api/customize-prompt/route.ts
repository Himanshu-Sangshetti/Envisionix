import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY;
    if (!NEBIUS_API_KEY) {
      throw new Error("Missing NEBIUS_API_KEY. Ensure it is set in .env.local");
    }

    const client = new OpenAI({
      baseURL: "https://api.studio.nebius.com/v1/",
      apiKey: NEBIUS_API_KEY,
    });

    const { prompt, modifications } = await request.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!modifications || typeof modifications !== "object") {
      return NextResponse.json({ error: "Modifications are required" }, { status: 400 });
    }

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
    if (!modifiedPrompt) {
      console.error("Empty response from Phi-3");
      return NextResponse.json({ error: "Failed to generate modified prompt" }, { status: 500 });
    }


    return NextResponse.json({ modifiedPrompt });
  } catch (error) {
    console.error("Error in customize-prompt API:", error);
    return NextResponse.json({ error: "Failed to modify prompt" }, { status: 500 });
  }
}
