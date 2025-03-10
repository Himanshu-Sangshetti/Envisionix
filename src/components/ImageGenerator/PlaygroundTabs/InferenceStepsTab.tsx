import { motion } from "framer-motion";
import Image from "next/image";

interface InferenceStepsTabProps {
  intermediateImages: { step: number; url: string }[];
  finalImage: string;
  activeStep: number | null;
  setActiveStep: (step: number | null) => void;
  playbackActive: boolean;
  startPlayback: () => void;
  prompt: string;
}

export function InferenceStepsTab({
  intermediateImages,
  finalImage,
  activeStep,
  setActiveStep,
  playbackActive,
  startPlayback,
  prompt
}: InferenceStepsTabProps) {
  return (
    <motion.div
      key="steps-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1"
    >
      {/* Inference steps visualization */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 shadow-lg mb-4">
        {activeStep ? (
          // Show the active step during playback
          <div className="absolute inset-0">
            <Image
              src={intermediateImages.find(img => img.step === activeStep)?.url || intermediateImages[intermediateImages.length - 1]?.url || finalImage
              }
              alt={`Generation step ${activeStep}`}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-center">Step {activeStep}</p>
            </div>
          </div>
        ) : (
          // Show the final image when not in playback
          <div className="absolute inset-0">
            <Image
              src={finalImage}
              alt={`AI generated image for: ${prompt}`}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Step thumbnails */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {intermediateImages.map((img) => (
          <motion.button
            key={img.step}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
              activeStep === img.step ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => setActiveStep(img.step)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={img.url}
              alt={`Step ${img.step}`}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
              Step {img.step}
            </div>
          </motion.button>
        ))}
      </div>
      
      {/* Playback controls */}
      <div className="flex justify-center space-x-4 mb-4">
        <motion.button
          onClick={startPlayback}
          className="px-4 py-2 rounded-lg glass-input hover:bg-white/10 transition-colors flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={playbackActive}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Play Generation Process
        </motion.button>
      </div>
    </motion.div>
  );
}
