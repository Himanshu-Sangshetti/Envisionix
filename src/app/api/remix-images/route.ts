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

    const { prompt1, prompt2 } = await request.json();

    if (!prompt1 || !prompt2) {
      return NextResponse.json({ error: "Both prompts are required" }, { status: 400 });
    }

    // 🔥 Step 1: Generate Funny Remix Prompt
    const remixPromptResponse = await client.chat.completions.create({
      model: "microsoft/Phi-3.5-mini-instruct",
      max_tokens: 256,
      temperature: 0.8,
      messages: [
        {
          role: "user",
          content: `Create a hilarious and creative prompt that combines the following two ideas:
          
          1. "${prompt1}"
          2. "${prompt2}"
          
          The result should be whimsical, unexpected, yet still visually coherent. Return ONLY the new funny prompt.`,
        },
      ],
    });

    const funnyPrompt = remixPromptResponse.choices[0]?.message?.content?.trim();
    if (!funnyPrompt) {
      return NextResponse.json({ error: "Failed to generate remix prompt" }, { status: 500 });
    }

    return NextResponse.json({ funnyPrompt });  // ✅ Only return the funny prompt
  } catch (error) {
    console.error("Error in remix-images API:", error);
    return NextResponse.json({ error: "Failed to remix images" }, { status: 500 });
  }
}
