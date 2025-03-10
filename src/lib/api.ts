export async function generateImageWithSteps(
  prompt: string, 
  model: string, 
  steps: number[]
): Promise<{
  intermediateImages: {step: number, url: string}[],
  finalImage: string,
  wordImportance?: number[]
}> {
  try {
    // Replace with your actual Nebius AI Studio API endpoint and key
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, model, steps }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate image');
    }

    const data = await response.json();
    return {
      intermediateImages: data.intermediateImages || [],
      finalImage: data.finalImage,
      wordImportance: data.wordImportance
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

export async function fetchWordImportance(prompt: string): Promise<{ word: string; importance: number; reason: string }[]> {
  try {
    const response = await fetch('/api/phi3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch word importance data.');
    }

    const data = await response.json();
    return data.words;
  } catch (error) {
    console.error('Error fetching word importance:', error);
    return [];
  }
}

export async function fetchCustomizedPrompt(
  prompt: string,
  modifications: {
    style?: string;
    lighting?: string;
    composition?: string;
    detailLevel?: number;
    negativePrompts?: string[];
  }
): Promise<string> {
  try {
    const response = await fetch("/api/customize-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, modifications }), // ✅ Ensure correct JSON payload
    });

    if (!response.ok) {
      const errorData = await response.json(); // 🔹 Capture server error
      throw new Error(errorData.error || "Failed to fetch customized prompt.");
    }

    const data = await response.json();
    return data.modifiedPrompt;
  } catch (error) {
    console.error("Error fetching customized prompt:", error);
    return prompt; // Return original prompt on failure
  }
}

export async function fetchRemixedImage(
  prompt1: string,
  prompt2: string
): Promise<{ funnyPrompt: string }> {
  try {
    const response = await fetch("/api/remix-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt1, prompt2 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch funny prompt.");
    }

    const data = await response.json();
    return {
      funnyPrompt: data.funnyPrompt,
    };
  } catch (error) {
    console.error("Error fetching funny prompt:", error);
    throw error;
  }
}
