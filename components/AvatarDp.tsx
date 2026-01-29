"use client";
import { useState, useRef } from "react";
import { IKImage, IKUpload, ImageKitProvider } from "imagekitio-next";
import axios from "axios"; // <--- Import Axios
import { Camera, X } from "lucide-react";

interface AvatarProps {
  currentImage: string;
  userId: string; // We need this to know WHO to update in the DB
}

export default function WhatsAppAvatar({ currentImage, userId }: AvatarProps) {
  const [image, setImage] = useState(currentImage || "/default-avatar.png");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  // --- STEP 1: AUTHENTICATOR (Using Axios) ---
  // The SDK calls this automatically when you try to upload.
  const authenticator = async () => {
    try {
      // We use axios to get the signature from YOUR Express backend
      const response = await axios.get(
        "http://localhost:4000/api/imagekit-auth"
      );

      // Axios puts the actual JSON body inside .data
      return response.data;
    } catch (error) {
      console.error("Auth failed:", error);
      throw error;
    }
  };

  // --- STEP 2: ON SUCCESS (Using Axios) ---
  // ImageKit calls this AFTER the file is safely stored in their cloud.
  const onSuccess = async (res: any) => {
    setUploading(false);
    const newUrl = res.url;

    // 1. Update Frontend UI instantly
    setImage(newUrl);

    // 2. Update Backend Database (Using Axios)
    try {
      await axios.post("http://localhost:4000/api/users/update-avatar", {
        userId: userId,
        avatarUrl: newUrl,
      });
      console.log("Database updated successfully");
    } catch (err) {
      console.error("Failed to update database", err);
    }
  };

  const onError = (err: any) => {
    setUploading(false);
    console.error("Upload Error", err);
  };

  return (
    <ImageKitProvider
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div className="flex flex-col items-center gap-4">
        {/* AVATAR CIRCLE */}
        <div className="relative group">
          <div
            onClick={() => setIsModalOpen(true)}
            className="w-32 h-32 rounded-full overflow-hidden cursor-pointer border-4 border-gray-100 hover:border-green-500 transition-all relative bg-gray-200"
          >
            <IKImage
              urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
              src={image}
              transformation={[
                { width: "200", height: "200", focus: "face", radius: "max" },
              ]}
              className="object-cover w-full h-full"
              alt="User Avatar"
            />

            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                Uploading...
              </div>
            )}
          </div>

          <button
            onClick={() => uploadRef.current?.click()}
            className="absolute bottom-1 right-1 bg-green-500 p-2 rounded-full text-white shadow-lg hover:bg-green-600 transition"
          >
            <Camera size={20} />
          </button>
        </div>

        {/* HIDDEN INPUT */}
        <IKUpload
          ref={uploadRef}
          fileName="avatar.jpg"
          useUniqueFileName={true}
          validateFile={(file) => file.size < 5000000}
          onSuccess={onSuccess}
          onError={onError}
          onUploadStart={() => setUploading(true)}
          style={{ display: "none" }}
        />

        {/* MODAL */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-12 right-0 text-white p-2 hover:bg-white/10 rounded-full"
              >
                <X size={32} />
              </button>

              {/* FIXED: Added 'alt' prop here too */}
              <IKImage
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                src={image}
                transformation={[
                  { width: "600", height: "600", focus: "face" },
                ]}
                className="w-full rounded-lg shadow-2xl bg-white"
                alt="Full User Profile"
              />
            </div>
          </div>
        )}
      </div>
    </ImageKitProvider>
  );
}
