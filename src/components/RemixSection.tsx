import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, CogIcon, LightBulbIcon } from "@heroicons/react/24/solid";

export function RemixFeatureSection() {
  return (
    <div className="remix-feature-section p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg mt-12">
      <div className="flex flex-col md:flex-row items-center gap-8">
        
        {/* Left Content */}
        <div className="flex-1 text-white">
          <h2 className="text-3xl font-bold mb-4">Unleash Your Creativity</h2>

          <p className="opacity-80 text-sm mb-6">
            Introducing the <span className="font-semibold">Remix Feature</span> — a powerful tool that lets you combine and remix AI-generated images in creative and fun ways!
          </p>

          {/* How to Use Section */}
          <div className="bg-white/1 p-4 rounded-xl mb-6">
            <h3 className="text-lg font-medium mb-2 text-white">How to Use:</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                Generate two unique images with prompts.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                Click the <span className="font-semibold">Remix Button</span> to combine them.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-blue-400" />
                Let the MAGIC happen!
              </li>
            </ul>
          </div>

          <motion.a
            href="/remix"
            className="bg-white/10 text-white py-3 px-6 rounded-lg shadow-md hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Remix Now
          </motion.a>
        </div>

        {/* Right Content - Mockup Display */}
        <div className="flex-1 relative flex justify-center items-center">
          <div className="relative w-[90%] md:w-[80%] p-6 rounded-xl bg-white/5 border border-white/20 shadow-md">
            
            <p className="text-sm opacity-70 text-gray-300">
              Blend two unique AI-generated images to create something unexpected and exciting!
            </p>

            {/* Image with 3D Overflow Effect */}
            <div className="relative mt-7 ">
              <img
                src="remix-image.png"
                alt="Remix Masterpiece"
                className="absolute -top-12 right-1/2 translate-x-1/2 w-[120%] md:w-[140%] rounded-xl shadow-2xl"
              />
            </div>

            <div className="flex items-center gap-4 mt-20">
              <CogIcon className="w-10 h-10 text-white/80" />
              <span className="text-sm text-gray-300">Fast | Creative | Fun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
