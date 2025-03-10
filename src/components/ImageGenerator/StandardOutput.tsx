import { motion } from "framer-motion";
import Image from "next/image";
import { LoadingSpinner } from "../LoadingSpinner";
import { toast } from "react-hot-toast"; 


interface StandardOutputProps {
  loading: boolean;
  finalImage: string | null;
  prompt: string;
  selectedModelName: string;
}

export function StandardOutput({
  loading,
  finalImage,
  prompt,
  selectedModelName
}: StandardOutputProps) {
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
      className="glass glass-card rounded-2xl p-8 flex flex-col"
    >
      <h2 className="text-2xl font-medium mb-6 flex items-center">
        <span className="inline-block w-3 h-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full mr-3"></span>
        Generated Result
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
        <div className="flex-1 flex flex-col">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 shadow-lg"
          >
            <Image
              src={finalImage}
              alt={`AI generated image for: ${prompt}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </motion.div>
          <div className="mt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium opacity-70">Prompt</h3>
                <p className="text-sm mt-1">{prompt}</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium opacity-70">Model</h3>
                <p className="text-sm mt-1">{selectedModelName}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
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