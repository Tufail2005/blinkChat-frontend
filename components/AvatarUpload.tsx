"use client";
import { useState, useRef } from "react";
import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import { Camera, Loader2 } from "lucide-react";
import axios from "axios";

interface AvatarUploadProps {
  onUploadComplete: (url: string) => void;
  folderPath: string; // e.g. "/users/avatars" or "/rooms/icons"
  defaultImage?: string;
}

export default function AvatarUpload({
  onUploadComplete,
  folderPath,
  defaultImage,
}: AvatarUploadProps) {
  const [image, setImage] = useState(defaultImage || "/placeholder-avatar.png"); // Put a default dummy image in public folder
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  // Authenticator for ImageKit (Calls your Express Backend)
  const authenticator = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/auth/imagekit"
      );
      return response.data;
    } catch (error) {
      throw new Error("Authentication failed");
    }
  };

  const onSuccess = (res: any) => {
    setUploading(false);
    setImage(res.url); // Update preview
    onUploadComplete(res.url); // Send URL to Parent Form
  };

  return (
    <ImageKitProvider
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div className="flex justify-center mb-6">
        <div className="relative group">
          {/* Circular Preview */}
          <div
            className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md cursor-pointer bg-gray-100"
            onClick={() => uploadRef.current?.click()}
          >
            {/* If it's a raw URL (placeholder), use img tag. If from ImageKit, use IKImage */}
            {image.includes("imagekit.io") ? (
              <IKImage
                src={image}
                transformation={[
                  { width: "200", height: "200", focus: "face", radius: "max" },
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
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Camera Icon Button */}
          <button
            type="button"
            onClick={() => uploadRef.current?.click()}
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Hidden Input */}
          <IKUpload
            ref={uploadRef}
            fileName="avatar.jpg"
            folder={folderPath}
            useUniqueFileName={true}
            validateFile={(file) => file.size < 5000000} // 5MB Limit
            onSuccess={onSuccess}
            onError={() => setUploading(false)}
            onUploadStart={() => setUploading(true)}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </ImageKitProvider>
  );
}
