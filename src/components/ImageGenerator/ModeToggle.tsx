import { motion } from "framer-motion";

interface ModeToggleProps {
  generationMode: "standard" | "playground";
  setGenerationMode: (mode: "standard" | "playground") => void;
}

export function ModeToggle({ generationMode, setGenerationMode }: ModeToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="glass rounded-xl p-1 flex">
        <button
          onClick={() => setGenerationMode("standard")}
          className={`px-4 py-2 rounded-lg transition-all ${
            generationMode === "standard" 
              ? "glass-button text-white" 
              : "hover:bg-white/10"
          }`}
        >
          Standard Mode
        </button>
        <button
          onClick={() => setGenerationMode("playground")}
          className={`px-4 py-2 rounded-lg transition-all ${
            generationMode === "playground" 
              ? "glass-button text-white" 
              : "hover:bg-white/10"
          }`}
        >
          Playground Mode
        </button>
      </div>
    </div>
  );
}
