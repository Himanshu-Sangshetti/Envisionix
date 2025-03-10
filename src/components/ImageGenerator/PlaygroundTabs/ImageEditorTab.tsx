"use client";
import "@pqina/pintura/pintura.css";
import { useState, useEffect, useRef } from "react";
import {
    appendEditor,
    createDefaultImageReader,
    createDefaultImageWriter,
    getEditorDefaults,
} from "@pqina/pintura";


interface ImageEditorTabProps {
    finalImage: string;
    setFinalImage: (image: string) => void;
}

// Base64 to DataURL (For Pintura Compatibility)
function base64ToDataURL(base64: string) {
    return base64.startsWith("data:image") ? base64 : `data:image/png;base64,${base64}`;
}

// Convert Blob/File back to Base64
async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export function ImageEditorTab({ finalImage, setFinalImage }: ImageEditorTabProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<any>(null);

    const [blobUrl, setBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!finalImage || !editorRef.current) return;

        const dataURL = base64ToDataURL(finalImage);
        setBlobUrl(dataURL);

        if (instanceRef.current) {
            instanceRef.current.destroy();
        }

        if (!editorRef.current) return;

        instanceRef.current = appendEditor(editorRef.current as HTMLDivElement, {
            ...(getEditorDefaults() as any),
            src: dataURL,
            utils: ["crop", "filter", "annotate", "finetune", "frame"],
            theme: "dark",
        });

        instanceRef.current.on("load", () => {
            
        });

        instanceRef.current.on("error", (err: any) => {
            console.error("❌ Pintura Error:", err);
        });

        // ✅ Correct "Done" button logic to save finalImage as Base64
        instanceRef.current.on("process", async (output: any) => {
            const editedImageBase64 = await blobToBase64(output.dest);
            setFinalImage(editedImageBase64);

            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        });

        return () => {
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }

            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, [finalImage]);

    return (
        <div className="my-editor">
            <div ref={editorRef} className="pintura-editor w-full h-full" />
        </div>
    );
}
