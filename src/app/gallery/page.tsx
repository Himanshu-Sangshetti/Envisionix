"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Download, Trash2, X } from "lucide-react";

interface ImageData {
  imageUrl: string;
  prompt: string;
  date: string;
}

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState<ImageData[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  useEffect(() => {
    const savedImages = JSON.parse(localStorage.getItem("gallery") || "[]");
    setGalleryImages(savedImages);
  }, []);

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated-image.png";
    link.click();
  };

  const handleDelete = (index: number) => {
    const updatedGallery = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedGallery);
    localStorage.setItem("gallery", JSON.stringify(updatedGallery));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <h2 className="text-4xl font-bold mb-8 text-center text-white">Your Gallery</h2>

      {galleryImages.length === 0 ? (
        <p className="text-gray-400 italic text-center">No images saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-2xl shadow-xl backdrop-blur-lg border border-white/20 bg-white/10 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <Image
                src={image.imageUrl}
                alt={`Saved image for: ${image.prompt}`}
                width={400}
                height={400}
                className="object-cover w-full rounded-t-2xl"
              />
              <div className="p-4 text-white space-y-2">
                <p className="text-md font-semibold truncate">{image.prompt}</p>
                <p className="text-xs opacity-70">Generated on: {image.date}</p>

                <div className="flex gap-3 mt-2">
                  <button
                    className="flex items-center gap-2 text-sm bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(image.imageUrl);
                    }}
                  >
                    <Download size={16} /> Download
                  </button>

                  <button
                    className="flex items-center gap-2 text-sm bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Expanded Image Popup */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl p-6 bg-white/10 rounded-2xl shadow-2xl border border-white/20">
            <button
              className="absolute top-4 right-4 text-white bg-black hover:bg-red-600 p-2 rounded-full"
              onClick={() => setSelectedImage(null)}
            >
              <X size={24} />
            </button>

            <Image
              src={selectedImage.imageUrl}
              alt={`Expanded view for: ${selectedImage.prompt}`}
              width={800}
              height={500}
              className="rounded-xl object-contain w-full"
            />  

            <div className="mt-4 text-white text-center space-y-2">
              <p className="text-lg font-bold">{selectedImage.prompt}</p>
              <p className="text-sm opacity-70">Generated on: {selectedImage.date}</p>

              <div className="flex gap-3 justify-center mt-4">
                <button
                  className="flex items-center gap-2 text-sm bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-lg"
                  onClick={() => handleDownload(selectedImage.imageUrl)}
                >
                  <Download size={16} /> Download
                </button>

                <button
                  className="flex items-center gap-2 text-sm bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-lg"
                  onClick={() => {
                    const updatedGallery = galleryImages.filter(
                      (img) => img.imageUrl !== selectedImage.imageUrl
                    );
                    setGalleryImages(updatedGallery);
                    localStorage.setItem("gallery", JSON.stringify(updatedGallery));
                    setSelectedImage(null);
                  }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
