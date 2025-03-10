import React, { useState } from "react";
import { motion } from "framer-motion";
import { SparklesIcon, PuzzlePieceIcon, BeakerIcon, CogIcon } from "@heroicons/react/24/outline";

const tabs = [
  {
    title: "Transparency",
    content: "Visualize each step of the image generation process and understand how your prompt influences the outcome.",
  },
  {
    title: "User Control",
    content: "Take full control with features like word exclusion, layered modification, and customization options.",
  },
  {
    title: "Creative Editing",
    content: "Refine your images directly with Pintura's advanced editing tools for cropping, annotating, and enhancing visuals.",
  },
  {
    title: "Gallery", // No content for the 4th box
    content: "",
    image: "/bg.gif", // Add the image URL
  },
];

export function IntroSection() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  return (
    <div className="relative text-left text-white p-10 flex items-center gap-6">
      {/* Text Section */}
      <div className="w-full">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
          Envisionix: See AI Differently
        </h1>
        <p className="text-lg mt-3 opacity-80">
          The AI Image Generator with Transparency, Control, and Creative Power.
        </p>
      </div>

      {/* Flipping Card Section */}
      <div className="flex gap-6 w-full">
        {tabs.map((tab, index) => (
          <motion.div
            key={tab.title}
            onClick={() => setActiveTab(activeTab === tab.title ? null : tab.title)}
            className={`cursor-pointer relative rounded-xl text-sm font-medium overflow-hidden
              ${index === 3 ? 'w-96' : 'w-48'} h-48`} // For the last image box, adjust width
          >
            {/* If it's the last box, just show the image */}
            {index === 3 ? (
              <motion.img
                src={tab.image}
                alt="Gallery"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <motion.div
                className={`absolute w-full h-full flex items-center justify-center rounded-xl p-6 transition-all duration-300 ease-in-out border-2 border-transparent
                  ${activeTab === tab.title ? 'bg-blue-500/80 text-white shadow-xl' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}
              >
                {/* Title (Visible when not clicked) */}
                <div className={`absolute w-full h-full flex items-center justify-center p-6 transition-opacity duration-300 ${activeTab === tab.title ? 'opacity-0' : 'opacity-100'}`}>
                  <span>{tab.title}</span>
                </div>

                {/* Content (Visible when clicked) */}
                <div className={`absolute w-full h-full flex items-center justify-center p-6 transition-opacity duration-300 ${activeTab === tab.title ? 'opacity-100' : 'opacity-0'}`}>
                  <span>{tab.content}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
