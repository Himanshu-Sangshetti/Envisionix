/**
 * Clears the specified canvas.
 * @param {string} canvasId - The ID of the canvas to clear.
 */
export function clearCanvas(canvasId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draws bounding boxes for words on the image.
 * @param {string} imageUrl - The generated image URL.
 * @param {Array<{ word: string; importance: number }>} wordHeatmap - List of words with importance scores.
 */
export async function drawBoundingBoxes(imageUrl: string, wordHeatmap: { word: string; importance: number }[]) {
  const canvas = document.getElementById("boundingBoxCanvas") as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Clear previous boxes
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Load image for dimensions
  const img = new Image();
  img.src = imageUrl;
  await img.decode();
  canvas.width = img.width;
  canvas.height = img.height;

  // Generate approximate bounding boxes (for now, randomized)
  wordHeatmap.forEach(({ word, importance }) => {
    const x = Math.random() * canvas.width * 0.7;
    const y = Math.random() * canvas.height * 0.7;
    const width = 100 + Math.random() * 200;
    const height = 100 + Math.random() * 200;


    // Draw bounding box
    ctx.strokeStyle = `rgba(255, 0, 0, ${importance})`;
    ctx.lineWidth = 2 + importance * 3;
    ctx.strokeRect(x, y, width, height);

    // Label with word
    ctx.fillStyle = "red";
    ctx.font = "14px Arial";
    ctx.fillText(word, x + 5, y + 15);
  });
}

/**
 * Generates a pixel-wise attention heatmap.
 * @param {string} imageUrl - The generated image URL.
 * @param {Array<{ word: string; importance: number }>} wordHeatmap - List of words with importance scores.
 */
export async function generatePixelHeatmap(imageUrl: string, wordHeatmap: { word: string; importance: number }[]) {
  const canvas = document.getElementById("attentionMapCanvas") as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Load the image
  const img = new Image();
  img.src = imageUrl;
  await img.decode();
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image first
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Get image pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Apply attention-based color mapping
  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % canvas.width;
    const y = Math.floor(i / 4 / canvas.width);

    // Assign attention intensity based on word importance
    let intensity = 0;
    wordHeatmap.forEach(({ importance }) => {
      intensity += importance * Math.exp(-((x - canvas.width / 2) ** 2 + (y - canvas.height / 2) ** 2) / (2 * 50000));
    });

    intensity = Math.min(1, intensity); // Clamp intensity between 0 and 1

    // Apply color transformation (heatmap effect: Red = High, Blue = Low)
    data[i] = 255 * intensity; // Red
    data[i + 1] = 0; // Green
    data[i + 2] = 255 * (1 - intensity); // Blue
  }

  // Put modified pixel data back
  ctx.putImageData(imageData, 0, 0);
}
