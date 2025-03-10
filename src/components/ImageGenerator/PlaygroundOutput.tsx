import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InferenceStepsTab } from "./PlaygroundTabs/InferenceStepsTab";
import { WordExclusionTab } from "./PlaygroundTabs/WordExclusionTab";
import { LoadingSpinner } from "../LoadingSpinner";
import { WordImportanceTab } from "./PlaygroundTabs/WordImportanceTab";
import { AttentionMapsTab } from "./PlaygroundTabs/AttentionMapsTab";
import { Customize } from "./PlaygroundTabs/Customize";
import { LayeredModificationTab } from "./PlaygroundTabs/LayeredModificationTab";
import { ImageEditorTab } from "./PlaygroundTabs/ImageEditorTab";
import { toast } from "react-hot-toast";



interface PlaygroundOutputProps {
  loading: boolean;
  finalImage: string | null;
  intermediateImages: { step: number; url: string }[];
  prompt: string;
  selectedModelName: string;
  wordHeatmap: { word: string; importance: number; reason: string }[];
  selectedWord: string | null;
  setSelectedWord: (word: string | null) => void;
  wordExclusionImages: { word: string; url: string }[];
  loadingWordExclusion: string | null;
  currentWordExclusionImage: string | null;
  generateWithoutWord: (word: string) => Promise<void>;
  activeTab: "inference" | "exclusion" | "importance" | "customize" | "layered" | "imageEditor";
  setActiveTab: (tab: "inference" | "exclusion" | "importance" | "customize" | "layered" | "imageEditor") => void;
  setFinalImage: (image: string | null) => void;
}

export function PlaygroundOutput({
  loading,
  finalImage,
  intermediateImages,
  prompt,
  selectedModelName,
  wordHeatmap,
  selectedWord,
  setSelectedWord,
  wordExclusionImages,
  loadingWordExclusion,
  generateWithoutWord,
  currentWordExclusionImage,
  setFinalImage,
}: PlaygroundOutputProps) {
  const [activeTab, setActiveTab] = useState<"inference" | "exclusion" | "importance" | "customize" | "layered" | "imageEditor">("inference");
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [playbackActive, setPlaybackActive] = useState(false);

  // Function to handle automatic playback of inference steps
  const startPlayback = () => {
    if (!intermediateImages.length) return;

    setPlaybackActive(true);
    setActiveStep(null);

    setTimeout(() => {
      let stepIndex = 0;
      const steps = intermediateImages.map((img) => img.step);
      const interval = setInterval(() => {
        if (stepIndex < steps.length) {
          setActiveStep(steps[stepIndex]);
          stepIndex++;
        } else {
          clearInterval(interval);
          setPlaybackActive(false);
          setActiveStep(null);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, 100);
  };

  const handleSaveToGallery = async () => {
    if (!finalImage) return;

    const savedImages = JSON.parse(localStorage.getItem("gallery") || "[]");

    const newImage = {
      imageUrl: finalImage,
      prompt,
      date: new Date().toLocaleString(),
    };

    localStorage.setItem("gallery", JSON.stringify([...savedImages, newImage]));
    toast.success("Image saved to gallery!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass glass-card rounded-2xl p-8 flex flex-col min-h-[800px]"
    >
      <h2 className="text-2xl font-medium mb-6 flex items-center">
        <span className="inline-block w-3 h-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full mr-3"></span>
        Generation Process
      </h2>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
            <LoadingSpinner />
          </div>
          <p className="mt-6 text-sm opacity-70">
            Creating your masterpiece with {selectedModelName}...
          </p>
        </div>
      ) : finalImage ? (
        <div className="flex-1 flex">

          {/* Sidebar with categorized options */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-1/5 p-4 pr-6 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-2xl shadow-lg border border-white/10"
          >
            <h3 className="text-lg font-medium mb-4">Features</h3>
            <div className="space-y-4">
              {/* LLM Transparency */}
              <div>
                <h4 className="text-sm font-medium mb-2 opacity-70">LLM Transparency</h4>
                <button
                  onClick={() => setActiveTab("inference")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === "inference" ? "bg-blue-500/20" : "hover:bg-white/10"
                  }`}
                >
                  Inference Steps
                </button>
                <button
                  onClick={() => setActiveTab("importance")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === "importance" ? "bg-blue-500/20" : "hover:bg-white/10"
                  }`}
                >
                  Word Importance
                </button>
                {/* <button
                  onClick={() => setActiveTab("attention")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === "attention" ? "bg-blue-500/20" : "hover:bg-white/10"
                  }`}
                >
                  Attention Maps
                </button> */}
              </div>

              {/* User Control */}
              <div>
                <h4 className="text-sm font-medium mb-2 opacity-70">User Control</h4>
                <button
                  onClick={() => setActiveTab("exclusion")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === "exclusion" ? "bg-blue-500/20" : "hover:bg-white/10"
                  }`}
                >
                  Word Exclusion
                </button>
                <button
                  onClick={() => setActiveTab("layered")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === "layered" ? "bg-blue-500/20" : "hover:bg-white/10"
                  }`}
                >
                  Layered Modification
                </button>
                <button
                  onClick={() => setActiveTab("customize")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === "customize" ? "bg-blue-500/20" : "hover:bg-white/10"
                  }`}
                >
                  Customize
                </button>
                <button
                  onClick={() => setActiveTab("imageEditor")}
                  className={`w-full text-left px-4 py-2 rounded-md ${
                    activeTab === "imageEditor" ? "bg-blue-500/20" : "hover:bg-white/10"
                  }`}
                >
                  Image Editor
                </button>
              </div>
            </div>
          </motion.div>

          {/* Tab content */}
          <div className="flex-1 pl-6">
            <AnimatePresence mode="wait">
              {activeTab === "inference" && (
                <InferenceStepsTab
                  intermediateImages={intermediateImages}
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                  playbackActive={playbackActive}
                  startPlayback={startPlayback}
                  finalImage={finalImage}
                  prompt={prompt}
                />
              )}
              {activeTab === "importance" && (
                <WordImportanceTab prompt={prompt} setSelectedWord={setSelectedWord} wordHeatmap={wordHeatmap} />
              )}
              {/* {activeTab === "attention" && <AttentionMapsTab finalImage={finalImage} wordHeatmap={wordHeatmap} />} */}
              {activeTab === "exclusion" && <WordExclusionTab {...{ wordHeatmap, selectedWord, setSelectedWord, generateWithoutWord, loadingWordExclusion, finalImage, currentWordExclusionImage, prompt }} />}
              {activeTab === "layered" && <LayeredModificationTab finalImage={finalImage} />}
              {activeTab === "customize" && <Customize prompt={prompt} finalImage={finalImage} setFinalImage={setFinalImage} />}
              {activeTab === "imageEditor" && <ImageEditorTab finalImage={finalImage} setFinalImage={setFinalImage} />}
            </AnimatePresence>
            <div className="mt-4 flex justify-end gap-4 mt-6 sticky bottom-4 bg-gradient-to-t from-white/5 to-transparent p-4 rounded-lg">
            <motion.a
              href={finalImage}
              download={`ai-image-${Date.now()}.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm py-2 px-4 rounded-lg glass-input hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Image
            </motion.a>
            <motion.button
              onClick={handleSaveToGallery}
              className="text-sm py-2 px-4 rounded-lg glass-input hover:bg-green-500/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save to Gallery
            </motion.button>
          </div>
          </div>
          
        </div>
        
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium">Your image will appear here</p>
          <p className="mt-2 text-sm max-w-xs">
            Enter a prompt and click "Generate Image" to create AI art
          </p>
        </div>
      )}
    </motion.div>
  );
}
