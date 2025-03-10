"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center py-0 px-4 pb-10 w-full max-w-[1440px] mx-auto space-y-[72px] overflow-hidden">
      {/* Title Text */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-white text-4xl sm:text-6xl md:text-7xl lg:text-[130px] leading-tight lg:leading-[144px] font-semibold max-w-[1126px] text-center mt-16 md:mt-24 hero-text-shadow"
      >
        Generate AI Images
      </motion.h1>

      {/* Bars with Image Masking Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative w-full max-w-[1158px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[610px] bg-transparent p-0 rounded-3xl overflow-hidden"
      >
        {/* Container for the bars */}
        <div className="absolute inset-0 grid grid-cols-10 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
          {/* Generate 10 bars with the image visible only inside them */}
          {Array(10).fill(0).map((_, index) => (
            <motion.div 
              key={index} 
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5 + index * 0.05,
                ease: "easeOut" 
              }}
              className="relative h-full rounded-[30px] md:rounded-[53px] overflow-hidden bg-[var(--hero-bar-bg)] border border-[var(--hero-bar-border)]"
              style={{ transformOrigin: "bottom" }}
            >
              {/* The shared image that's positioned to align across all bars */}
              <div className="absolute inset-0">
                <div 
                  className="absolute"
                  style={{
                    width: `calc(1000% + 9 * var(--bar-gap-lg))`,
                    height: "100%",
                    left: `calc(-${index} * (100% + var(--bar-gap-lg)))`,
                  }}
                >
                  <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src="/bg-2.gif"
                      alt="Abstract flow shape with rainbow reflections"
                      fill
                      className="object-cover scale-180 object-center"
                      priority
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}