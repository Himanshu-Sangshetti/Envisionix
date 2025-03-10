"use client";

import { useState } from "react";
import { ImageGenerator } from "@/components/ImageGenerator";
import { Hero } from "@/components/Hero";
import { motion } from "framer-motion";
import { FeaturesSection } from "@/components/FeaturesSection";
import { ContactSection } from "@/components/contactSection";
import { RemixFeatureSection } from "@/components/RemixSection";
import { IntroSection } from "@/components/IntroSection";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full hero-gradient">
        <Hero />
      </section>

      {/* Intro Section */}
      <section className="w-full p-35 pt-25">
      <IntroSection />
      </section>
      
      {/* Features Section */}
      <section className="w-full p-35 pt-0">
      <FeaturesSection />
      </section>
     
      
      {/* Image Generator Section */}
      <section className="w-full p-20 pt-16">
        <div className="w-full max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gradient">
              Create Your Own AI Masterpiece
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Enter a prompt below to generate stunning images via Nebius AI Studio
            </p>
          </motion.div>
          
          <div className="w-full">
            <ImageGenerator />
          </div>
          

        </div>
      </section>

      {/* Remix Section */}
      <section className="w-full p-35 pt-25">
      <RemixFeatureSection />
      </section>

      <section className="w-full p-20 pt-25">
      <ContactSection />
      </section>
    </main>
  );
}