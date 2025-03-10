import OpenAI from "openai";

const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY ?? "";



if (!NEBIUS_API_KEY) {
  throw new Error("Missing NEBIUS_API_KEY. Ensure it is set in .env.local");
}

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: NEBIUS_API_KEY,
});

export async function getWordImportance(prompt: string) {
  try {
    const response = await client.chat.completions.create({
      model: "microsoft/Phi-3.5-mini-instruct",
      max_tokens: 1024,
      temperature: 0.05,
      top_p: 1,
      messages: [
        {
          role: "user",
          content: `Analyze the following prompt and extract the most important words. For each word, provide:
          - A numerical importance score between 0 and 1 (higher means more important).
          - A short reason explaining why the word is important for image generation.
          
          Return the response in the following JSON format:
          {
            "words": [
              { "word": "example", "importance": 0.8, "reason": "This word defines the core concept." }
            ]
          }
          
          Prompt: "${prompt}"
          `,
        },
      ],
    });

    const responseText = response.choices[0]?.message?.content?.trim();
    if (!responseText) {
      throw new Error("Empty response from Phi-3");
    }

    // Parse JSON response from LLM
    const parsedData = JSON.parse(responseText);

    // Validate the response format
    if (!parsedData.words || !Array.isArray(parsedData.words)) {
      throw new Error("Invalid response format from Phi-3");
    }

    return parsedData.words;
  } catch (error) {
    console.error("Error fetching word importance:", error);
    return [];
  }
}


