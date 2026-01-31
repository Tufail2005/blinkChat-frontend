"use client";

import { useRef, useImperativeHandle, forwardRef, useState } from "react";
import axios from "axios";
import ImageKit from "imagekit-javascript";
import imageCompression from "browser-image-compression";

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

    useImperativeHandle(ref, () => ({
      open: () => {
        if (inputRef.current) {
          inputRef.current.click();
        }
      },
    }));

    const handleFileChange = async (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const originalFile = event.target.files?.[0];
      if (!originalFile) return;

      try {
        if (onUploadStart) onUploadStart();
        setUploading(true);

        console.log(
          `Original: ${(originalFile.size / 1024 / 1024).toFixed(2)} MB`
        );

        //  COMPRESS
        const options = {
          maxSizeMB: 5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(originalFile, options);
        console.log(
          `Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`
        );

        // AUTH
        const authResponse = await axios.get(
          "http://localhost:4000/api/auth/imagekit"
        );
        const { signature, token, expire } = authResponse.data;


        const imagekit = new ImageKit({
          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
          urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
        });

        const result = await imagekit.upload({
          file: compressedFile,
          fileName: fileName,
          folder: folderPath,
          useUniqueFileName: true,
          token,
          signature,
          expire,
        });

        onSuccess(result.url);
      } catch (err) {
        console.error("Upload process failed:", err);
        if (onError) onError(err);
      } finally {
        setUploading(false);
        // Reset input so same file can be chosen again
        if (inputRef.current) inputRef.current.value = "";
      }
    };

    return (
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    );
  }
);

ImageUploadHandler.displayName = "ImageUploadHandler";
