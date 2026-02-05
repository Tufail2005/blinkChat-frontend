"use client";

import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Camera, Check, X, Loader2, LogOut } from "lucide-react"; // Added LogOut
import axios from "axios";
import { useRouter } from "next/navigation"; // Added useRouter
import { ImageViewer } from "@/components/ImageViewer"; // Ensure you have this component
import {
  ImageUploadHandler,
  UploadHandlerRef,
} from "@/components/ImageUploadHandler";

interface UserInfoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: any;
  onUserUpdate: (user: any) => void;
}

export function UserInfoDialog({
  isOpen,
  onOpenChange,
  currentUser,
  onUserUpdate,
}: UserInfoDialogProps) {
  // --- STATE ---
  const [userDetails, setUserDetails] = useState<any>(currentUser);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isViewImageOpen, setIsViewImageOpen] = useState(false); // New State for Image Viewer
  const base_url = process.env.NEXT_PUBLIC_BASE_API_URL;

  // --- REFS & HOOKS ---
  const uploadHandlerRef = useRef<UploadHandlerRef>(null);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      setUserDetails(currentUser);
      setNewName(currentUser.userName || "");
    }
  }, [currentUser]);

  // ==========================================
  // 1. UPDATE NAME LOGIC
  // ==========================================
  const handleUpdateName = async () => {
    if (!newName.trim()) return;

    try {
      await axios.put(
        `${base_url}/api/auth/update`,
        { userName: newName },
        { withCredentials: true }
      );

      // Optimistic Update
      const updated = { ...userDetails, userName: newName };
      setUserDetails(updated);
      onUserUpdate(updated);
      setIsEditingName(false);
    } catch (error: any) {
      console.error("Failed to update name", error);
    }
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    uploadHandlerRef.current?.open();
  };

  const onUploadSuccess = async (url: string) => {
    try {
      await axios.put(
        `${base_url}/api/auth/update`,
        { photo: url },
        { withCredentials: true }
      );

      // Optimistic Update
      const updated = { ...userDetails, photo: url };
      setUserDetails(updated);
      onUserUpdate(updated);
      setIsUploading(false);
    } catch (error) {
      console.error("Failed to update photo", error);
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${base_url}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      router.push("/signin");
      onOpenChange(false);
    } catch (error) {
      console.error("Logout failed", error);
      //router.push("/signin");
    }
  };

  if (!userDetails) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold">My Profile</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center pt-6 px-6 pb-4 space-y-6">
            {/* --- AVATAR SECTION --- */}
            <div className="relative group">
              {/* Image Click -> Open Viewer */}
              <div
                onClick={() => setIsViewImageOpen(true)}
                className="cursor-pointer transition-transform active:scale-95"
              >
                <Avatar className="h-28 w-28 border-4 border-white shadow-sm">
                  <AvatarImage
                    src={userDetails.photo}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600">
                    {userDetails.userName?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Loading Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full z-20">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* Camera Button -> Open Upload Handler */}
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white transition-transform hover:scale-110"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* --- NAME EDITING SECTION --- */}
            <div className="w-full flex justify-center items-center gap-2 h-10">
              {isEditingName ? (
                <div className="flex items-center gap-2 w-full max-w-[250px] animate-in fade-in zoom-in-95 duration-200">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-9 text-center font-semibold text-lg"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleUpdateName}
                    className="h-9 w-9 p-0 bg-green-500 hover:bg-green-600"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingName(false)}
                    className="h-9 w-9 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group p-1 rounded-md hover:bg-gray-50 transition-colors">
                  <h2 className="text-xl font-bold text-gray-900">
                    {userDetails.userName}
                  </h2>
                  <Pencil
                    className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-600"
                    onClick={() => setIsEditingName(true)}
                  />
                </div>
              )}
            </div>

            {/* Email (Read Only) */}
            <div className="text-sm text-gray-500 pb-2">
              {userDetails.email}
            </div>
          </div>

          {/* --- LOGOUT SECTION (Added) --- */}
          <div className="border-t bg-gray-50/50 p-6">
            <Button
              variant="destructive"
              className="w-full gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Log Out
            </Button>
          </div>

          {/* Hidden Upload Handler */}
          <ImageUploadHandler
            ref={uploadHandlerRef}
            folderPath="/users/avatars"
            onUploadStart={() => setIsUploading(true)}
            onSuccess={onUploadSuccess}
            onError={() => setIsUploading(false)}
          />
        </DialogContent>
      </Dialog>

      {/* --- INTEGRATED COMPONENTS --- */}
      <ImageViewer
        isOpen={isViewImageOpen}
        onClose={() => setIsViewImageOpen(false)}
        imageUrl={userDetails.photo}
        altName={userDetails.userName}
      />
    </>
  );
}
