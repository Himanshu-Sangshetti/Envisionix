import { LoadingSpinner } from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import Image from "next/image";

interface WordExclusionTabProps {
  wordHeatmap: { word: string; importance: number; reason:string }[];
  selectedWord: string | null;
  setSelectedWord: (word: string | null) => void;
  generateWithoutWord: (word: string) => Promise<void>;
  loadingWordExclusion: string | null;
  finalImage: string | null;
  currentWordExclusionImage: string | null;
  prompt: string;
}

export function WordExclusionTab({
  wordHeatmap,
  selectedWord,
  setSelectedWord,
  generateWithoutWord,
  loadingWordExclusion,
  finalImage,
  currentWordExclusionImage,
  prompt
}: WordExclusionTabProps) {
  return (
    <motion.div
      key="exclusion-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1"
    >
      <h3 className="text-lg font-medium mb-3">Word Exclusion Analysis</h3>
      <p className="text-sm opacity-70 mb-4">
        Click on a word to see how it impacts the generated image. The more intense the color, the more important the word is to the final result.
      </p>
      
      {/* Word heatmap visualization */}
      <div className="flex flex-wrap gap-2 mb-6">
        {wordHeatmap.map((item, index) => (
          <motion.button
            key={index}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              selectedWord === item.word ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{
              backgroundColor: `rgba(59, 130, 246, ${item.importance * 0.5})`,
              color: item.importance > 0.6 ? 'white' : 'inherit'
            }}
            onClick={() => generateWithoutWord(item.word)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loadingWordExclusion === item.word}
          >
            {loadingWordExclusion === item.word ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {item.word}
              </span>
            ) : (
              item.word
            )}
          </motion.button>
        ))}
      </div>
      
      {/* Comparison view */}
      <div className="grid grid-cols-2 gap-4">
        {/* Original image */}
        <div>
          <h4 className="text-sm font-medium opacity-80 mb-2">Original Image</h4>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 shadow-lg">
            <Image
              src={finalImage!}
              alt={`Original image`}
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        {/* Image without selected word */}
        <div>
          <h4 className="text-sm font-medium opacity-80 mb-2">
            {selectedWord ? `Without "${selectedWord}"` : "Select a word"}
          </h4>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 shadow-lg">
            {currentWordExclusionImage ? (
              <Image
                src={currentWordExclusionImage}
                alt={`Image generated without the word "${selectedWord}"`}
                fill
                className="object-cover"
              />
            ) : selectedWord ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <p className="text-sm opacity-70">Click a word to see its impact</p>
              </div>
            )}
          </div>
          {selectedWord && (
            <p className="text-xs opacity-70">
              Prompt without "{selectedWord}"
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
