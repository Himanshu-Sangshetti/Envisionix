import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext"; // Import the User Context

interface ModelType {
  id: string;
  name: string;
  description: string;
}

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  models: ModelType[];
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  error: string | null;
  wordHeatmap: { word: string; importance: number }[];
  generationMode: "standard" | "playground";
}

export function PromptForm({
  prompt,
  setPrompt,
  selectedModel,
  setSelectedModel,
  models,
  handleSubmit,
  loading,
  error,
  wordHeatmap,
  generationMode
}: PromptFormProps) {
  const { user, signIn } = useUser(); // ⬅️ Added `signIn` from User Context
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const selectedModelName = models.find(model => model.id === selectedModel)?.name || "Select Model";

  // Modified handleSubmit to include redirect logic
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      await signIn(); // ⬅️ Trigger Sign In flow if user is not authenticated
      return;
    }

    await handleSubmit(e); // Proceed with the original submission logic
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass glass-card rounded-2xl p-8"
    >
      <h2 className="text-2xl font-medium mb-6 flex items-center">
        <span className="inline-block w-3 h-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full mr-3"></span>
        Create Your Image
      </h2>

      <form onSubmit={handleAuthSubmit} className="space-y-6">
        {/* Model Selection Dropdown */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium mb-2 opacity-80">
            Select AI Model
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full p-4 rounded-xl glass-input text-foreground focus:outline-none flex justify-between items-center"
              onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            >
              <span>{selectedModelName}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isModelDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-1 w-full rounded-xl bg-gray-600 overflow-hidden shadow-lg"
              >
                <div className="py-1">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      className={`w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex flex-col ${
                        selectedModel === model.id ? 'bg-white/10' : ''
                      }`}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setIsModelDropdownOpen(false);
                      }}
                    >
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs opacity-70 mt-1">{model.description}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-2 opacity-80">
            Describe your image
          </label>
          <textarea
            id="prompt"
            className="w-full p-4 rounded-xl glass-input text-foreground focus:outline-none"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cyberpunk cityscape with neon lights, flying cars, and holographic advertisements..."
            disabled={loading}
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 glass-button text-white font-medium rounded-xl transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Processing..." : `Generate Image${generationMode === "playground" ? " with Steps" : ""}`}
        </motion.button>
      </form>

      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <p className="text-red-400">{error}</p>
        </motion.div>
      )}

      <div className="mt-8 text-sm opacity-70">
        <h3 className="font-medium mb-2">Pro Tips:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Be specific with details like style, lighting, and mood</li>
          <li>Try adding "photorealistic", "8k", or art styles like "cyberpunk"</li>
          <li>Different models excel at different types of images</li>
          {generationMode === "playground" && (
            <li>Watch how the image evolves through different inference steps</li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}
