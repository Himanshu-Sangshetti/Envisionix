import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface LayeredModificationTabProps {
  finalImage: string | null;
}

export function LayeredModificationTab({ finalImage }: LayeredModificationTabProps) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [replacementText, setReplacementText] = useState("");
  const [modifiedImage, setModifiedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleReplacementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplacementText(e.target.value);
  };

  const handleApplyChanges = async () => {
    if (!canvasRef.current || !replacementText) {
      setError("Please paint the area and provide replacement text.");
      return;
    }

    const maskDataURL = canvasRef.current.toDataURL();


    setSelectionMode(false);
    setTimeout(() => setSelectionMode(true), 100);

    try {
      setIsLoading(true); // 🔄 Start Loader
      const response = await fetch('/api/modify-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: finalImage,
          mask: maskDataURL,
          replacement: replacementText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to modify image');
      }

      const data = await response.json();
      setModifiedImage(data.modifiedImage);
    } catch (error) {
      console.error('Error applying changes:', error);
      setError(error instanceof Error ? error.message : "Failed to apply changes");
    } finally {
      setIsLoading(false); // ✅ Stop Loader
    }
  };

  const handleEnableSelection = () => {
    setSelectionMode(true);
  };

  // 🖌️ Draw Mask Logic
  useEffect(() => {
    if (!selectionMode) return;
    if (!canvasRef.current || !finalImage) {
      console.error("❌ Canvas or Final Image Not Found");
      return;
    }


    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      console.error("❌ Canvas Context Not Found");
      return;
    }

    const img = new window.Image();
    img.src = finalImage;
    img.onload = () => {
      // ✅ Correct Canvas Dimensions (Matches Image)
      canvas.width = img.width;
      canvas.height = img.height;

      // 🔹 Initialize Mask with Black Background
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    let painting = false;

    const getMousePos = (canvas: HTMLCanvasElement, e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const startPosition = (e: MouseEvent) => {
      painting = true;
      draw(e);
    };

    const endPosition = () => {
      painting = false;
      ctx.beginPath();
    };

    const draw = (e: MouseEvent) => {
      if (!painting) return;

      const { x, y } = getMousePos(canvas, e);

      ctx.lineWidth = 30;
      ctx.lineCap = "round";
      ctx.strokeStyle = "white"; // ⚪ Mark areas for modification

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", endPosition);
    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousedown", startPosition);
      canvas.removeEventListener("mouseup", endPosition);
      canvas.removeEventListener("mousemove", draw);
    };
  }, [finalImage, selectionMode]);

  return (
    <motion.div
      key="layered-modification-tab"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1"
    >
      <h3 className="text-xl font-bold mb-3 text-blue-400">Layered Modification</h3>
      <p className="text-sm text-gray-400 mb-4">
        Paint over the area you want to modify while keeping the rest of the image intact.
      </p>

      {finalImage ? (
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 shadow-lg">
          <Image src={finalImage} alt="Generated Image" fill className="object-cover opacity-50" />

          {selectionMode && finalImage && (
            <canvas
              ref={canvasRef}
              key={selectionMode ? "paint-mode-enabled" : "paint-mode-disabled"} // 🔹 Forces canvas to re-render
              width={1024}
              height={1024}
              className="absolute inset-0 w-full h-full z-10"
              style={{
                pointerEvents: "auto",
                background: "transparent",
                opacity: 0.7,
              }}
            />
          )}

          {!selectionMode && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button
                onClick={handleEnableSelection}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                Enable Painting Mode
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium text-gray-300 mb-2">No image available</p>
          <p className="text-sm opacity-70 max-w-md">
            Generate an image to start modifying specific areas.
          </p>
        </div>
      )}

      {selectionMode && (
        <div className="mt-6 space-y-3">
          <label htmlFor="replacement" className="block text-sm font-medium text-white">
            Replace with:
          </label>
          <input
            type="text"
            id="replacement"
            value={replacementText}
            onChange={handleReplacementChange}
            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter replacement text"
          />
          <button
            onClick={handleApplyChanges}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold text-lg hover:opacity-90 transition-all"
          >
            Apply Changes
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="mt-3 text-white text-lg">Generating image...</p>
        </div>
      ) : modifiedImage ? (
        <div className="mt-6">
          <h4 className="text-lg font-medium mb-2">Modified Image</h4>
          <img src={modifiedImage} alt="Modified Image" className="object-cover w-full h-full rounded-xl" />
        </div>
      ) : (
        <p className="text-gray-400 italic">No modified image generated yet.</p>
      )}
    </motion.div>
  );
}
