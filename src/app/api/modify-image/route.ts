import { NextResponse } from "next/server";
import axios from "axios";

const SEGMIND_API_URL = "https://api.segmind.com/v1/sdxl-inpaint";
const SEGMIND_API_KEY = process.env.SEGMIND_API_KEY;

// ✅ Convert Image URL to Base64
async function imageUrlToBase64(imageUrl: string) {
  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary").toString("base64");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, mask, replacement } = body;

    if (!imageUrl || !mask || !replacement) {
      console.error("❌ Missing fields:", { imageUrl, mask, replacement });
      return NextResponse.json(
        { message: "Image URL, mask, and replacement text are required" },
        { status: 400 }
      );
    }

    if (!SEGMIND_API_KEY) {
      console.error("❌ Segmind API key is missing.");
      return NextResponse.json(
        { message: "Segmind API key not configured" },
        { status: 500 }
      );
    }

    const requestData = {
      "image": await imageUrlToBase64(imageUrl),
      "mask": await imageUrlToBase64(mask),
      "prompt": replacement,
      "negative_prompt": "disfigured, deformed, ugly",
      "samples": 1,
      "scheduler": "DDIM",
      "num_inference_steps": 25,
      "guidance_scale": 7.5,
      "seed": 12467,
      "strength": 0.9,
      "base64": false // Since we're sending base64 data, keep this `false`
    };

    // ✅ Handle Binary Response Correctly
    const response = await axios.post(SEGMIND_API_URL, requestData, {
      headers: {
        "x-api-key": SEGMIND_API_KEY,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      timeout:30000 // 🚨 Key fix here — correctly receives binary data
    });

    // ✅ Convert binary data to base64 for front-end display
    const modifiedImage = `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;

    return NextResponse.json({ modifiedImage });

  } catch (error) {
    console.error("❌ Error in API route:");
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
