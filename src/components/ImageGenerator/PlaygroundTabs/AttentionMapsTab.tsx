import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { drawBoundingBoxes, generatePixelHeatmap, clearCanvas } from "@/lib/attentionUtils"; // ✅ Import helper functions

interface AttentionMapsTabProps {
  finalImage: string | null;
  wordHeatmap: { word: string; importance: number }[];
}

export function AttentionMapsTab({ finalImage, wordHeatmap }: AttentionMapsTabProps) {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  // 🛠️ Update bounding boxes and heatmaps for the selected word
  useEffect(() => {
    if (finalImage && wordHeatmap.length > 0) {
      clearCanvas("boundingBoxCanvas");
      clearCanvas("attentionMapCanvas");
      if (selectedWord) {
        const selectedHeatmap = wordHeatmap.filter(({ word }) => word === selectedWord);
        drawBoundingBoxes(finalImage, selectedHeatmap);
        generatePixelHeatmap(finalImage, selectedHeatmap);
      } else {
        drawBoundingBoxes(finalImage, wordHeatmap);
        generatePixelHeatmap(finalImage, wordHeatmap);
      }
    }
  }, [finalImage, wordHeatmap, selectedWord]);

  return (
    <motion.div
      key="attention-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1"
    >
      <h3 className="text-lg font-medium mb-3">Attention Map Analysis</h3>
      <p className="text-sm opacity-70 mb-4">
        Visualize how different words in your prompt influenced specific regions of the image.
      </p>

      {finalImage && wordHeatmap.length > 0 ? (
        <>
          {/* Word List */}
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-white/10 mb-4">
            {wordHeatmap.map(({ word }) => (
              <button
                key={word}
                onMouseEnter={() => setHoveredWord(word)}
                onMouseLeave={() => setHoveredWord(null)}
                onClick={() => setSelectedWord(word)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedWord === word
                    ? "bg-red-600 text-white"
                    : hoveredWord === word
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {word}
              </button>
            ))}
          </div>

          {/* Image + Attention Visualization */}
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 shadow-lg">
            <Image src={finalImage} alt="Generated Image" fill className="object-cover" />

            {/* Bounding Boxes */}
            <canvas
              id="boundingBoxCanvas"
              className="absolute inset-0 pointer-events-none"
            />

            {/* Per-Pixel Attention Map */}
            <canvas
              id="attentionMapCanvas"
              className="absolute inset-0 pointer-events-none"
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium mb-2">No attention data available</p>
          <p className="text-sm opacity-70 max-w-md">
            Generate an image to see the attention maps for different words.
          </p>
        </div>
      )}
    </motion.div>
  );
}
