"use client";
import { useState, useRef } from "react";
import { IKImage, ImageKitProvider } from "imagekitio-next";
import { Camera, Loader2 } from "lucide-react";
import axios from "axios";
import ImageKit from "imagekit-javascript"; // Direct SDK usage
import imageCompression from "browser-image-compression"; // The compression library

interface AvatarUploadProps {
  onUploadComplete: (url: string) => void;
  folderPath: string;
  defaultImage?: string;
}

export default function AvatarUpload({
  onUploadComplete,
  folderPath,
  defaultImage,
}: AvatarUploadProps) {
  const [image, setImage] = useState(defaultImage || "/placeholder-avatar.png");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- THE COMPRESSION & UPLOAD LOGIC ---
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const originalFile = event.target.files?.[0];
    if (!originalFile) return;

    try {
      setUploading(true);
      console.log(
        `Original size: ${(originalFile.size / 1024 / 1024).toFixed(2)} MB`
      );

      // COMPRESS THE IMAGE
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(originalFile, options);
      console.log(
        `Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
      );

      // GET AUTH TOKEN FROM BACKEND
      const authResponse = await axios.get(
        "http://localhost:4000/api/auth/imagekit"
      );
      const { signature, token, expire } = authResponse.data;

      // INITIALIZE IMAGEKIT SDK MANUALLY
      const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      });

      // UPLOAD THE COMPRESSED FILE
      const result = await imagekit.upload({
        file: compressedFile, // Upload the small file
        fileName: "avatar.jpg",
        folder: folderPath,
        useUniqueFileName: true,
        token,
        signature,
        expire,
      });

      // SUCCESS
      setImage(result.url);
      onUploadComplete(result.url);
      setUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
      setUploading(false);
    }
  };

  // here we use ImageKitProvider just for the IKImage display component
  return (
    <ImageKitProvider
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
    >
      <div className="flex justify-center mb-6">
        <div className="relative group">
          {/* Circular Preview */}
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md cursor-pointer bg-gray-100 relative"
            onClick={() => fileInputRef.current?.click()}
          >
            {image.includes("imagekit.io") ? (
              <IKImage
                src={image}
                transformation={[
                  { width: "400", height: "400", focus: "auto", radius: "max" },
                ]}
                className="w-full h-full object-cover"
                alt="Avatar"
              />
            ) : (
              <img
                src={image}
                className="w-full h-full object-cover"
                alt="Default"
              />
            )}

            {/* Loading Overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Camera Icon Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition z-20"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Standard Input (Replaces IKUpload) */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            // Reset value so selecting the same file triggers change again
            onClick={(e) => (e.currentTarget.value = "")}
          />
        </div>
      </div>
    </ImageKitProvider>
  );
}
