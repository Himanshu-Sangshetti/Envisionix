import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const { prompt, model, steps } = await request.json();

    if (!prompt) {
      return NextResponse.json({ message: "Prompt is required" }, { status: 400 });
    }

    if (!model) {
      return NextResponse.json({ message: "Model is required" }, { status: 400 });
    }

    const NEBIUS_API_KEY = process.env.NEBIUS_API_KEY;
    if (!NEBIUS_API_KEY) {
      return NextResponse.json({ message: "API key not configured" }, { status: 500 });
    }

    // ✅ Create OpenAI client for Nebius API
    const client = new OpenAI({
      baseURL: "https://api.studio.nebius.com/v1/",
      apiKey: NEBIUS_API_KEY,
    });

    // ✅ Run multiple inference steps in parallel
    const inferenceRequests = steps.map(async (step: number) => {
      const response = await client.images.generate({
        model: model,
        response_format: "b64_json",
        prompt: prompt,
        ...( { extra_body: {
            response_extension: "webp",
            width: 1024,
            height: 1024,
            num_inference_steps: step, // Different step for each request
            seed: 123456
          } } as any ),
      });

      return { step, url: `data:image/webp;base64,${response.data[0].b64_json}` };
    });

    // ✅ Wait for all requests to complete
    const intermediateImages = await Promise.all(inferenceRequests);

    // ✅ Get the final image with the highest inference step
    const finalResponse = await client.images.generate({
      model: model,
      response_format: "b64_json",
      prompt: prompt,
      ...({extra_body: {
        response_extension: "webp",
        width: 1024,
        height: 1024,
        num_inference_steps: Math.max(...steps), // Highest step for final image
        seed: -1
      }} as any),
    });

    const finalImage = `data:image/webp;base64,${finalResponse.data[0].b64_json}`;

    return NextResponse.json({ intermediateImages, finalImage });
  } catch (error) {
    console.error("Error in generate-image API route:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
