import React from "react";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  PuzzlePieceIcon,
  BeakerIcon,
  CogIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline"; // Transparent icons

const features = [
  {
    title: "Inference Steps",
    description: "Visualize your AI-generated image step-by-step for full transparency.",
    icon: <BeakerIcon className="w-12 h-12 text-white/60" />,
    size: "lg:col-span-1 md:col-span-1", // Standard
  },
  {
    title: "Word Exclusion",
    description: "See how excluding a specific word affects the generated image.",
    icon: <PuzzlePieceIcon className="w-12 h-12 text-white/60" />,
    size: "lg:col-span-2 md:col-span-1", // Wide (Full width on smaller screens)
  },
  {
    title: "Word Importance",
    description: "Understand word influence with importance scores and reasoning.",
    icon: <SparklesIcon className="w-12 h-12 text-white/60" />,
    size: "lg:col-span-1 md:col-span-2", // Standard (Expands on medium screens)
  },
  {
    title: "Layered Selection",
    description: "Modify only specific parts of the image, keeping the rest intact.",
    icon: <SparklesIcon className="w-12 h-12 text-white/60" />,
    size: "lg:col-span-2 md:col-span-1", // Wide
  },
  {
    title: "Customization Options",
    description: "Fine-tune image styles, colors, and effects with precision.",
    icon: <CogIcon className="w-12 h-12 text-white/60" />,
    size: "lg:col-span-1 md:col-span-1", // Standard
  },
  {
    title: "Future Features",
    description: "Stay tuned for more groundbreaking features coming soon!",
    icon: <RocketLaunchIcon className="w-12 h-12 text-white/60" />,
    size: "lg:col-span-1 md:col-span-2", // Standard
  },
];

export function FeaturesSection() {
  return (
    <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className={`feature-card p-6 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-xl ${feature.size}`}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.97, rotate: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="icon-container flex items-center justify-center w-full h-32 rounded-xl bg-gradient-to-br from-white/5 to-white/20 shadow-inner hover:scale-105 transition-all duration-300">
            {feature.icon}
          </div>

          <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
          <p className="text-sm text-gray-300 opacity-80 mt-2">{feature.description}</p>
        </motion.div>
      ))}
      
    </div>

  );
}
