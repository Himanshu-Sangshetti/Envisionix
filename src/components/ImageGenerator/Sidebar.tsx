"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <motion.div
      className="flex flex-col w-64 bg-[#0A0F1D] p-4 shadow-lg"
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      exit={{ x: -100 }}
    >
      <h2 className="text-xl font-bold text-white mb-4">Playground Dashboard</h2>
      <nav className="flex flex-col space-y-2">
        <button
          onClick={() => setActiveTab("inference")}
          className={`p-2 rounded-lg transition-colors ${activeTab === "inference" ? "bg-blue-500 text-white" : "hover:bg-white/10"}`}
        >
          Inference Steps
        </button>
        <button
          onClick={() => setActiveTab("exclusion")}
          className={`p-2 rounded-lg transition-colors ${activeTab === "exclusion" ? "bg-blue-500 text-white" : "hover:bg-white/10"}`}
        >
          Word Exclusion
        </button>
        <button
          onClick={() => setActiveTab("importance")}
          className={`p-2 rounded-lg transition-colors ${activeTab === "importance" ? "bg-blue-500 text-white" : "hover:bg-white/10"}`}
        >
          Word Importance
        </button>
        <button
          onClick={() => setActiveTab("customize")}
          className={`p-2 rounded-lg transition-colors ${activeTab === "customize" ? "bg-blue-500 text-white" : "hover:bg-white/10"}`}
        >
          Customize
        </button>
        <button
          onClick={() => setActiveTab("layered")}
          className={`p-2 rounded-lg transition-colors ${activeTab === "layered" ? "bg-blue-500 text-white" : "hover:bg-white/10"}`}
        >
          Layered Modification
        </button>
      </nav>
    </motion.div>
  );
}
