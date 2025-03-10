"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { generateImageWithSteps, fetchRemixedImage } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function RemixPage() {
  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("");
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [remixImage, setRemixImage] = useState<string | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [remixLoading, setRemixLoading] = useState(false);

  const handleGenerateImage = async (prompt: string, setImage: (url: string | null) => void, setLoading: (state: boolean) => void) => {
    try {
      setLoading(true);
      const { finalImage } = await generateImageWithSteps(prompt, "stability-ai/sdxl", []);
      setImage(finalImage);
    } catch (error) {
      toast.error("Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  const handleRemix = async () => {
    try {
      setRemixLoading(true);
      const { funnyPrompt } = await fetchRemixedImage(prompt1, prompt2);

      if (funnyPrompt) {
        const { finalImage } = await generateImageWithSteps(funnyPrompt, "stability-ai/sdxl", []);
        setRemixImage(finalImage);
      } else {
        toast.error("Failed to remix images");
      }
    } catch (error) {
      toast.error("Error remixing images");
    } finally {
      setRemixLoading(false);
    }
  };

  const handleSaveToGallery = async () => {
    if (!remixImage) return;

    const savedImages = JSON.parse(localStorage.getItem("gallery") || "[]");
    

    const newImage = {
      imageUrl: remixImage,
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
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8 text-white"
    >
      {/* Title and Description */}
      <h1 className="text-4xl font-bold text-center text-gradient mb-4">🎨 Remix Your Images!</h1>
      <p className="text-center text-sm opacity-80 max-w-2xl mx-auto mb-8">
        Generate two unique images from AI and remix them into an unexpected, funny, and creative masterpiece!
      </p>

      {/* Prompt & Image Section (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Prompt Box */}
        <div className="glass-input p-6 rounded-xl flex flex-col">
          <h3 className="text-sm font-medium opacity-80 mb-2">Prompt 1</h3>
          <textarea
            value={prompt1}
            onChange={(e) => setPrompt1(e.target.value)}
            placeholder="Describe the first image..."
            className="w-full p-4 rounded-lg bg-white/10 text-foreground focus:outline-none"
          />
          <button
            onClick={() => handleGenerateImage(prompt1, setImage1, setLoading1)}
            className="mt-4 w-full py-2 rounded-lg glass-button text-sm"
            disabled={loading1}
          >
            {loading1 ? "Generating..." : "Generate the first Image"}
          </button>
          <div className="mt-4 aspect-square rounded-lg overflow-hidden border border-white/20 flex items-center justify-center">
            {loading1 ? <LoadingSpinner /> : image1 ? <img src={image1} alt="Image 1" className="object-cover w-full h-full" /> : <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium">Your image will appear here</p>
              <p className="mt-2 text-sm max-w-xs">
                Enter a prompt and click "Generate Image" to create AI art
              </p>
            </div>}
          </div>
        </div>

        {/* Second Prompt Box */}
        <div className="glass-input p-6 rounded-xl flex flex-col">
          <h3 className="text-sm font-medium opacity-80 mb-2">Prompt 2</h3>
          <textarea
            value={prompt2}
            onChange={(e) => setPrompt2(e.target.value)}
            placeholder="Describe the second image..."
            className="w-full p-4 rounded-lg bg-white/10 text-foreground focus:outline-none"
          />
          <button
            onClick={() => handleGenerateImage(prompt2, setImage2, setLoading2)}
            className="mt-4 w-full py-2 rounded-lg glass-button text-sm"
            disabled={loading2}
          >
            {loading2 ? "Generating..." : "Generate the second Image"}
          </button>
          <div className="mt-4 aspect-square rounded-lg overflow-hidden border border-white/20 flex items-center justify-center">
            {loading2 ? <LoadingSpinner /> : image2 ? <img src={image2} alt="Image 2" className="object-cover w-full h-full" /> : <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium">Your image will appear here</p>
              <p className="mt-2 text-sm max-w-xs">
                Enter a prompt and click "Generate Image" to create AI art
              </p>
            </div>}
          </div>
        </div>

        {/* Remixed Image Box */}
        <div className="glass-input p-6 rounded-xl flex flex-col">
          <h3 className="text-sm font-medium opacity-80 mb-2">Remixed Image</h3>
          <button
            onClick={handleRemix}
            disabled={!image1 || !image2}
            className={`mt-4 w-full py-2 rounded-lg text-sm transition-all ${!image1 || !image2 ? "bg-gray-500 opacity-50 cursor-not-allowed" : "glass-button hover:scale-105"}`}
          >
            {remixLoading ? "Remixing..." : "Remix Images"}
          </button>
          <div className="mt-4 aspect-square rounded-lg overflow-hidden border-4 border-pink-500 flex items-center justify-center relative">
            {remixLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-blue-500/20 blur-2xl rounded-lg"
              />
            )}
            {remixLoading ? <LoadingSpinner /> : remixImage ? <img src={remixImage} alt="Remixed Image" className="object-cover w-full h-full" /> : <p className="text-xs opacity-50">Remixed image will appear here</p>}
          </div>
          {remixImage && (
    <div className="mt-4 flex justify-end gap-2">
      <motion.a
        href={remixImage}
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
  )}
        </div>
      </div>

      {/* Remixing Animation Overlay */}
      <AnimatePresence>
        {remixLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-white/10 rounded-xl shadow-lg"
            >
              <p className="text-white text-lg font-semibold text-center">Let the magic happen...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
