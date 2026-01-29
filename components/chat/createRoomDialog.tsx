"use client";

import { useState } from "react";
import axios from "axios";
import { MapPin, Loader2, AlertCircle } from "lucide-react"; // Added AlertCircle
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import AvatarUpload from "@/components/AvatarUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation } from "@/hooks/useLocation"; // Ensure path matches your file

interface CreateRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateRoomDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateRoomDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roomPhoto, setRoomPhoto] = useState("");
  const router = useRouter();

  const {
    location,
    error: locationError, // This now contains the specific error message
    loading: locationLoading,
    getLocation,
  } = useLocation();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name) return alert("Room name is required");
    if (!location) return alert("Location is required");

    try {
      setSubmitting(true);

      const payload = {
        name,
        description,
        latitude: location.lat,
        longitude: location.lng,
        photo: roomPhoto,
      };

      await axios.post("http://localhost:4000/api/room/create", payload, {
        withCredentials: true,
      });
      router.refresh();
      setSubmitting(false);
      onOpenChange(false);
      setName("");
      setDescription("");

      if (onSuccess) {
        onSuccess();
      }

      alert("Room created successfully!");
    } catch (error) {
      console.error(error);
      setSubmitting(false);
      alert("Failed to create room");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Chat Room</DialogTitle>
          <DialogDescription>
            Create a location-based room for people nearby to join.
          </DialogDescription>
        </DialogHeader>

        {/* AVATAR UPLOAD  */}
        <div className="flex justify-center py-2">
          <AvatarUpload
            folderPath="/rooms/icons"
            onUploadComplete={(url) => setRoomPhoto(url)}
            defaultImage="/default-room-icon.png"
          />
        </div>

        <div className="grid gap-4 py-4">
          {/* Room Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Guwahati Tech Meetup"
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this room about?"
            />
          </div>

          {/* Location Section */}
          <div className="grid gap-2">
            <Label>Location</Label>

            {/* 1. Location Box Container */}
            <div
              className={`flex items-center justify-between p-3 border rounded-md transition-colors ${
                locationError
                  ? "border-red-200 bg-red-50"
                  : "bg-slate-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin
                  className={`h-4 w-4 ${
                    locationError ? "text-red-500" : "text-primary"
                  }`}
                />

                {/* Location Status Text */}
                {location ? (
                  <span className="font-medium text-gray-900">
                    Lat: {location.lat.toFixed(4)}, Lng:{" "}
                    {location.lng.toFixed(4)}
                  </span>
                ) : (
                  <span
                    className={
                      locationError
                        ? "text-red-600 font-medium"
                        : "text-gray-500"
                    }
                  >
                    {locationError
                      ? "Location detection failed"
                      : "No location selected"}
                  </span>
                )}
              </div>

              {/* Get Location Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={getLocation}
                disabled={locationLoading}
                className={
                  locationError
                    ? "border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700"
                    : ""
                }
              >
                {locationLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Get Location"
                )}
              </Button>
            </div>

            {/* 2. Specific Error Instruction */}
            {locationError && (
              <div className="flex items-start gap-2 mt-1 p-2 rounded-md bg-red-50 text-xs text-red-600 border border-red-100">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  {locationError.toLowerCase().includes("denied")
                    ? "Browser blocked location. Click the lock icon 🔒 in your URL bar to allow access."
                    : "Please turn on your device's Location / GPS services and try again."}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={submitting || !location}>
            {submitting ? "Creating..." : "Create Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
