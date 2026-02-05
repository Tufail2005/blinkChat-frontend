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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Camera, Users, LogOut, Check, X, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ImageViewer } from "@/components/ImageViewer";
import {
  ImageUploadHandler,
  UploadHandlerRef,
} from "@/components/ImageUploadHandler";

interface RoomInfoDialogProps {
  roomId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRoomUpdate?: () => void;
}

export function RoomInfoDialog({
  roomId,
  isOpen,
  onOpenChange,
  onRoomUpdate,
}: RoomInfoDialogProps) {
  const [roomDetails, setRoomDetails] = useState<any>(null);

  // State for Full Image View
  const [viewerData, setViewerData] = useState<{
    url: string | null;
    name: string;
  } | null>(null);

  // State for Editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const base_url = process.env.NEXT_PUBLIC_BASE_API_URL;
  // State for Uploading
  const [isUploading, setIsUploading] = useState(false);

  // Ref for the invisible upload handler
  const uploadHandlerRef = useRef<UploadHandlerRef>(null);
  const router = useRouter();

  // Fetch Full Details when Dialog Opens
  useEffect(() => {
    if (isOpen && roomId) {
      axios
        .get(`${base_url}/api/room/${roomId}`, {
          withCredentials: true,
        })
        .then((res) => {
          setRoomDetails(res.data);
          setNewName(res.data.name || "");
          setNewDescription(res.data.description || "");
        })
        .catch((err) => console.error("Failed to load room details", err));
    }
  }, [isOpen, roomId]);

  // --- HELPER TO TRIGGER UPDATES EVERYWHERE ---
  const triggerRefresh = () => {
    //Tell ChatHeader to refresh
    if (onRoomUpdate) onRoomUpdate();

    //Tell Sidebar to refresh (via Custom Event)
    // dispatch an event that ChatSidebar will listen for
    window.dispatchEvent(new Event("room_updated"));

    //Refresh Next.js Server Components
    router.refresh();
  };

  // Generic Update Function (Handles both Name and Description)
  const handleUpdateRoom = async (field: "name" | "description") => {
    const value = field === "name" ? newName : newDescription;

    if (!value.trim()) return;

    try {
      const payload = { [field]: value };

      await axios.put(`${base_url}/api/room/${roomId}/update`, payload, {
        withCredentials: true,
      });

      // Optimistic Update
      setRoomDetails((prev: any) => ({ ...prev, [field]: value }));

      if (field === "name") setIsEditingName(false);
      if (field === "description") setIsEditingDesc(false);

      triggerRefresh();
    } catch (error: any) {
      console.error(`Failed to update ${field}:`, error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Update failed"}`);
      }
    }
  };

  // 3. Handle Exit Group
  const handleExitGroup = async () => {
    if (!confirm("Are you sure you want to leave this group?")) return;

    try {
      await axios.post(
        `${base_url}/api/room/${roomId}/leave`,
        {},
        { withCredentials: true }
      );
      router.push("/message");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to leave group", error);
    }
  };

  // 4. Upload Logic
  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop click from opening the View Modal
    uploadHandlerRef.current?.open(); // Trigger the hidden file input
  };

  const onUploadSuccess = async (url: string) => {
    try {
      await axios.put(
        `${base_url}/api/room/${roomId}/update`,
        { photo: url },
        { withCredentials: true }
      );
      setRoomDetails((prev: any) => ({ ...prev, photo: url }));
      setIsUploading(false);

      triggerRefresh();
    } catch (error) {
      console.error("Failed to update room photo", error);
      setIsUploading(false);
    }
  };

  if (!roomDetails) return null;

  // Thumbnail: Small, Circle, Focused on Face/Auto
  const thumbnailSrc = roomDetails.photo
    ? `${roomDetails.photo}?tr=w-150,h-150,fo-auto,r-max`
    : undefined;

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold">Group Info</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center p-6 pt-2 border-b bg-gray-50/50">
            {/* --- AVATAR SECTION --- */}
            <div className="relative">
              {/* 1. The Avatar Image (Clicks to VIEW) */}
              <div
                onClick={() =>
                  setViewerData({
                    url: roomDetails.photo,
                    name: roomDetails.name,
                  })
                }
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <Avatar className="h-28 w-28 border-4 border-white shadow-sm cursor-pointer">
                  <AvatarImage src={thumbnailSrc} className="object-cover" />
                  <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {roomDetails.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Loading Spinner Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full z-20">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>

              {/* 2. The Camera Button (Clicks to UPLOAD) */}
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg border-2 border-white transition-all transform hover:scale-110 disabled:opacity-50"
                title="Change Group Photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* --- NAME SECTION --- */}
            <div className="mt-4 w-full flex justify-center items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-2 w-full max-w-[250px]">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-8 text-center font-semibold text-lg"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={() => handleUpdateRoom("name")}
                    className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingName(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {roomDetails.name}
                  </h2>
                  <Pencil
                    className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600"
                    onClick={() => setIsEditingName(true)}
                  />
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1">
              Group · {roomDetails._count?.members || 0}{" "}
              {roomDetails._count?.members >= 2 ? "members" : "member"}
            </p>
          </div>

          <ScrollArea className="max-h-100">
            <div className="p-6 space-y-6">
              {/* --- DESCRIPTION SECTION --- */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">
                    Description
                  </h3>
                  {!isEditingDesc && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingDesc(true)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                </div>

                {isEditingDesc ? (
                  <div className="flex gap-2">
                    <Input
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="h-8 text-sm"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => handleUpdateRoom("description")}
                      className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingDesc(false)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {roomDetails.description || "Add a group description..."}
                  </p>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              {/* --- MEMBERS SECTION --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{roomDetails.members?.length} Members</span>
                </div>
                <div className="space-y-3">
                  {roomDetails.members?.map((member: any) => {
                    const memberPhoto = member.photo
                      ? `${member.photo}?tr=w-100,h-100,fo-auto,r-max`
                      : undefined;

                    const memberInitials = member.userName
                      ? member.userName.slice(0, 2).toUpperCase()
                      : "??";
                    return (
                      <div key={member.id} className="flex items-center gap-3">
                        <div
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() =>
                            setViewerData({
                              url: member.photo,
                              name: member.userName,
                            })
                          }
                        >
                          <Avatar className="h-9 w-9 border border-gray-200">
                            <AvatarImage
                              src={memberPhoto}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-bold">
                              {memberInitials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {member.userName || "Unknown User"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* --- EXIT BUTTON --- */}
              <Button
                variant="destructive"
                className="w-full gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                onClick={handleExitGroup}
              >
                <LogOut className="h-4 w-4" />
                Exit Room
              </Button>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* --- FULL SCREEN IMAGE VIEWER --- */}
      <ImageViewer
        isOpen={!!viewerData}
        onClose={() => setViewerData(null)}
        imageUrl={viewerData?.url}
        altName={viewerData?.name || "Image"}
      />

      {/* --- INVISIBLE UPLOAD HANDLER --- */}
      <ImageUploadHandler
        ref={uploadHandlerRef}
        folderPath="/rooms/icons"
        onUploadStart={() => setIsUploading(true)}
        onSuccess={onUploadSuccess}
        onError={(err) => {
          console.error("Upload failed", err);
          setIsUploading(false);
          alert("Failed to upload image.");
        }}
      />
    </div>
  );
}
