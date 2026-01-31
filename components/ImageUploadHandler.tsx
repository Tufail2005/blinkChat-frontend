"use client";

import { useRef, useImperativeHandle, forwardRef, useState } from "react";
import axios from "axios";
import ImageKit from "imagekit-javascript";
import imageCompression from "browser-image-compression";
import { ImageCropper } from "@/components/ImageCropper";

export interface UploadHandlerRef {
  open: () => void;
}

interface ImageUploadHandlerProps {
  onSuccess: (url: string) => void;
  onError?: (err: any) => void;
  onUploadStart?: () => void;
  folderPath: string;
  fileName?: string;
}

export const ImageUploadHandler = forwardRef<
  UploadHandlerRef,
  ImageUploadHandlerProps
>(
  (
    { onSuccess, onError, onUploadStart, folderPath, fileName = "image.jpg" },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    // --- CROPPER STATE ---
    const [cropOpen, setCropOpen] = useState(false);
    const [selectedImgSrc, setSelectedImgSrc] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      open: () => inputRef.current?.click(),
    }));

    // Handle Selection  -> Read it & Open Cropper
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Create URL for preview
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSelectedImgSrc(reader.result?.toString() || null);
        setCropOpen(true); // Open the modal
      });
      reader.readAsDataURL(file);

      // Reset input immediately so same file can be selected again
      event.target.value = "";
    };

    // The Actual Upload Logic (Called AFTER Crop)
    const processUpload = async (file: File) => {
      try {
        if (onUploadStart) onUploadStart();
        setUploading(true);
        console.log(
          `Processing: ${file.name} (${(file.size / 1024 / 1024).toFixed(
            2
          )} MB)`
        );

        // SKIP COMPRESSION FOR HEIC, COMPRESS OTHERS (Reuse your existing logic)
        const isHeic =
          file.type.toLowerCase() === "image/heic" ||
          file.name.toLowerCase().endsWith(".heic");

        if (!isHeic) {
          try {
            const options = {
              maxSizeMB: 6,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            };
            file = await imageCompression(file, options);
          } catch (e) {
            console.warn("Compression skipped", e);
          }
        }

        // AUTH & UPLOAD
        const authRes = await axios.get(
          "http://localhost:4000/api/auth/imagekit"
        );
        const { signature, token, expire } = authRes.data;

        const imagekit = new ImageKit({
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
          urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
        });

        const result = await imagekit.upload({
          file: file,
          fileName: fileName,
          folder: folderPath,
          useUniqueFileName: true,
          token,
          signature,
          expire,
          tags: ["chat-upload"],
        });

        onSuccess(result.url);
      } catch (err) {
        console.error("Upload failed:", err);
        if (onError) onError(err);
      } finally {
        setUploading(false);
        setCropOpen(false); // Close modal
      }
    };

    return (
      <>
        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*, .heic"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Cropper Modal */}
        <ImageCropper
          isOpen={cropOpen}
          onClose={() => setCropOpen(false)}
          imageSrc={selectedImgSrc}
          onCropComplete={processUpload}
        />
      </>
    );
  }
);
ImageUploadHandler.displayName = "ImageUploadHandler";
