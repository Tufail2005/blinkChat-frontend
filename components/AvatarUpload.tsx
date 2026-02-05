"use client";

import { useState, useRef } from "react";
import { IKImage, ImageKitProvider } from "imagekitio-next";
import { Camera, Loader2 } from "lucide-react";
import axios from "axios";
import ImageKit from "imagekit-javascript";
import imageCompression from "browser-image-compression";
import { ImageCropper } from "@/components/ImageCropper";

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

  // Cropper State
  const [cropOpen, setCropOpen] = useState(false);
  const [selectedImgSrc, setSelectedImgSrc] = useState<string | null>(null);
  const base_url = process.env.NEXT_PUBLIC_API_URL;

  // Handle Selection -> Open Cropper
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSelectedImgSrc(reader.result as string);
        setCropOpen(true);
      });
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      // Compression Logic
      if (!file.name.endsWith(".heic")) {
        try {
          const options = {
            maxSizeMB: 6,
            maxWidthOrHeight: 1000,
            useWebWorker: true,
          };
          file = await imageCompression(file, options);
        } catch (e) {
          console.warn("Compression failed", e);
        }
      }

      // Upload Logic
      const authRes = await axios.get(
        `${base_url}/api/auth/imagekit`
      );
      const { signature, token, expire } = authRes.data;

      const imagekit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
      });

      const result = await imagekit.upload({
        file: file,
        fileName: "avatar.jpg",
        folder: folderPath,
        useUniqueFileName: true,
        token,
        signature,
        expire,
      });

      setImage(result.url);
      onUploadComplete(result.url);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
      setCropOpen(false);
    }
  };

  return (
    <ImageKitProvider
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
    >
      <div className="flex justify-center mb-6">
        <div className="relative group">
          {/* ...Avatar UI (Circle + Camera Button) ... */}
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
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition z-20"
          >
            <Camera className="w-4 h-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* The Cropper Dialog */}
      <ImageCropper
        isOpen={cropOpen}
        onClose={() => setCropOpen(false)}
        imageSrc={selectedImgSrc}
        onCropComplete={handleUpload}
      />
    </ImageKitProvider>
  );
}
