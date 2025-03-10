"use client";

import { useState } from "react";
import { fetchWordImportance, generateImageWithSteps } from "@/lib/api";
import { ModeToggle } from "./ImageGenerator/ModeToggle";
import { PromptForm } from "./ImageGenerator/PromptForm";
import { StandardOutput } from "./ImageGenerator/StandardOutput";
import { PlaygroundOutput } from "./ImageGenerator/PlaygroundOutput";
import { getWordImportance } from "@/lib/phi3";

// Define available models
const AVAILABLE_MODELS = [
  {
    id: "black-forest-labs/flux-schnell",
    name: "Flux Schnell",
    description: "Fast generation with good quality"
  },
  {
    id: "black-forest-labs/flux-dev",
    name: "Flux Dev",
    description: "Development version with latest features"
  },
  {
    id: "stability-ai/sdxl",
    name: "Stability SDXL",
    description: "High quality, detailed images"
  }
];

// Define inference steps to capture
const INFERENCE_STEPS = [5, 10, 15, 20];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generationMode, setGenerationMode] = useState<"standard" | "playground">("standard");
  const [intermediateImages, setIntermediateImages] = useState<{step: number, url: string}[]>([]);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [wordHeatmap, setWordHeatmap] = useState<{word: string, importance: number; reason: string}[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordExclusionImages, setWordExclusionImages] = useState<{word: string, url: string}[]>([]);
  const [loadingWordExclusion, setLoadingWordExclusion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"inference" | "exclusion" | "importance"  | "customize" | "layered" | "imageEditor">("inference");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFinalImage(null);
      setIntermediateImages([]);
      setWordHeatmap([]);
      setWordExclusionImages([]);
      setSelectedWord(null);
      
      if (generationMode === "standard") {
        // Standard mode - just get the final image
        const { finalImage } = await generateImageWithSteps(prompt, selectedModel, []);
        setFinalImage(finalImage);
      } else {
        // Playground mode - get intermediate steps and word importance
        const { intermediateImages, finalImage, wordImportance } = 
          await generateImageWithSteps(prompt, selectedModel, INFERENCE_STEPS);
        
        setIntermediateImages(intermediateImages);
        setFinalImage(finalImage);
        
        // Process word importance data
        try {
          // ✅ Call API instead of calling `getWordImportance(prompt)` directly
          const importanceData = await fetchWordImportance(prompt);
          setWordHeatmap(importanceData);
        } catch (err) {
          console.error("Error fetching word importance:", err);
        }
        
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  // Function to generate an image without a specific word
  const generateWithoutWord = async (word: string) => {
    if (loading || loadingWordExclusion) return;
    
    try {
      setLoadingWordExclusion(word);
      setSelectedWord(word);
      
      // Check if we already generated this word exclusion
      const existingImage = wordExclusionImages.find(item => item.word === word);
      if (existingImage) {
        return;
      }
      
      // Create a new prompt without the selected word
      const words = prompt.split(/\s+/);
      const newPrompt = words.filter(w => w !== word).join(' ');
      
      // Generate the image without the word using the same API
      const { finalImage: comparisonImage } = await generateImageWithSteps(newPrompt, selectedModel, []);
      
      // Add to our collection of word exclusion images
      setWordExclusionImages(prev => [...prev, { word, url: comparisonImage }]);
      
    } catch (err) {
      console.error(`Error generating image without word "${word}":`, err);
    } finally {
      setLoadingWordExclusion(null);
    }
  };

  // Get the currently selected model name
  const selectedModelName = AVAILABLE_MODELS.find(model => model.id === selectedModel)?.name || "Select Model";
  
  // Get the current word exclusion image if any
  const currentWordExclusionImage = selectedWord 
  ? wordExclusionImages.find(item => item.word === selectedWord)?.url ?? null
  : null;



  return (
    <div className="space-y-8">
      {/* Mode Toggle */}
      <ModeToggle 
        generationMode={generationMode} 
        setGenerationMode={setGenerationMode} 
      />
      
      {/* Main content grid - adjust layout based on mode */}
      <div className={`grid gap-8 ${generationMode === "playground" ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"}`}>
        {/* Input Section */}
        <PromptForm
          prompt={prompt}
          setPrompt={setPrompt}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          models={AVAILABLE_MODELS}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
          wordHeatmap={wordHeatmap}
          generationMode={generationMode}
        />

        {/* Output Section */}
        {generationMode === "standard" ? (
          <StandardOutput
            loading={loading}
            finalImage={finalImage}
            prompt={prompt}
            selectedModelName={selectedModelName}
          />
        ) : (
          <PlaygroundOutput
            loading={loading}
            finalImage={finalImage}
            intermediateImages={intermediateImages}
            prompt={prompt}
            selectedModelName={selectedModelName}
            wordHeatmap={wordHeatmap}
            selectedWord={selectedWord}
            setSelectedWord={setSelectedWord}
            wordExclusionImages={wordExclusionImages}
            loadingWordExclusion={loadingWordExclusion}
            generateWithoutWord={generateWithoutWord}
            currentWordExclusionImage={currentWordExclusionImage}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setFinalImage={setFinalImage}
          />
        )}
      </div>
    </div>
  );
}