"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fetchCustomizedPrompt, generateImageWithSteps } from "@/lib/api";
import debounce from "lodash.debounce"; 

const STYLES = ["Realism", "Artistic", "Cartoon", "Hyperrealism", "Sketch", "Anime"];
const LIGHTING_OPTIONS = ["Bright", "Dark", "Warm", "Cool"];
const COMPOSITION_OPTIONS = ["Wide Shot", "Close-Up"];

interface CustomizeProps {
  prompt: string;
  finalImage: string | null;
  setFinalImage: (image: string | null) => void;
}

export function Customize({ prompt, finalImage, setFinalImage }: CustomizeProps) {
  const [modifiedPrompt, setModifiedPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("Realism");
  const [selectedLighting, setSelectedLighting] = useState("Bright");
  const [selectedComposition, setSelectedComposition] = useState("Wide Shot");
  const [detailLevel, setDetailLevel] = useState(5);
  const [loading, setLoading] = useState(false);

  // Function to update customization and regenerate image
  const applyCustomizations = async () => {
    if (!prompt) return; // Prevent API call if no prompt

    setLoading(true);
    try {
      // Modify the prompt using Phi-3
      const updatedPrompt = await fetchCustomizedPrompt(prompt, {
        style: selectedStyle,
        lighting: selectedLighting,
        composition: selectedComposition,
        detailLevel,
      });

      setModifiedPrompt(updatedPrompt);

      // Generate the image using the modified prompt
      const { finalImage: newImage } = await generateImageWithSteps(updatedPrompt, "stability-ai/sdxl", []);

      if (!newImage) {
        console.error("⚠️ No image was returned from API");
      } else {
        setFinalImage(newImage); 
      }  
    } catch (error) {
      console.error("Error applying customizations:", error);
    }
    setLoading(false);
  };

  // Debounce API calls to prevent excessive requests
  const debouncedApplyCustomizations = debounce(applyCustomizations, 1000);

  useEffect(() => {
    debouncedApplyCustomizations();
    return () => debouncedApplyCustomizations.cancel(); // Cleanup debounce
  }, [selectedStyle, selectedLighting, selectedComposition, detailLevel]);

  return (
    <motion.div
      key="customize-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col lg:flex-row gap-8 p-6 bg-[#0A0F1D] rounded-xl shadow-2xl text-white"
    >
      {/* Left Section - Controls */}
      <div className="w-full lg:w-2/5 space-y-8">
        {/* Style Selection - Live Updates */}
        <div>
          <h4 className="font-medium text-lg mb-3">Style & Aesthetic</h4>
          <div className="flex flex-wrap gap-2">
            {STYLES.map(style => (
              <motion.button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedStyle === style ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                }`}
              >
                {style}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Lighting Selection - Live Updates */}
        <div>
          <h4 className="font-medium text-lg mb-3">Lighting & Color</h4>
          <div className="flex flex-wrap gap-2">
            {LIGHTING_OPTIONS.map(light => (
              <motion.button
                key={light}
                onClick={() => setSelectedLighting(light)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedLighting === light ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-300"
                }`}
              >
                {light}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Composition Selection - Live Updates */}
        <div>
          <h4 className="font-medium text-lg mb-3">Composition & Perspective</h4>
          <div className="flex gap-4">
            {COMPOSITION_OPTIONS.map(comp => (
              <motion.button
                key={comp}
                onClick={() => setSelectedComposition(comp)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  selectedComposition === comp ? "bg-green-500 text-white" : "bg-gray-700 text-gray-300"
                }`}
              >
                {comp}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Detail Level - Live Updates */}
        <div>
          <h4 className="font-medium text-lg mb-3">Detail Level</h4>
          <input
            type="range"
            min="1"
            max="10"
            value={detailLevel}
            onChange={(e) => setDetailLevel(Number(e.target.value))}
            className="w-full"
          />
          <p className="text-sm opacity-70">Detail Level: {detailLevel}</p>
        </div>
      </div>

      {/* Right Section - Live Preview */}
      <div className="relative w-full lg:w-3/5">
        <h4 className="font-medium text-lg mb-3">Live Preview</h4>
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 shadow-lg">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <p className="text-sm opacity-70">Updating...</p>
            </div>
          ) : (
            <Image
              key={finalImage} // ✅ Forces React to re-render
              src={finalImage || ""}
              alt="Generated Image"
              fill
              className="object-cover opacity-90 transition-all duration-300"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
