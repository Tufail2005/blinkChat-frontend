// "use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Loader2, Users, LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation } from "@/hooks/useLocation";
import { Badge } from "@/components/ui/badge";

interface NearbyRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinSuccess?: () => void;
}
type NearbyRoom = {
  id: string;
  name: string;
  description?: string;
  membersCount: number;
};

export function NearbyRoomDialog({
  open,
  onOpenChange,
  onJoinSuccess,
}: NearbyRoomDialogProps) {
  const {
    location,
    error: locationError,
    loading: locationLoading,
    getLocation,
  } = useLocation();
  const [rooms, setRooms] = useState<NearbyRoom[]>([]);
  const [searching, setSearching] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      fetchNearbyRooms(location.lat, location.lng);
    }
  }, [location]);

  const fetchNearbyRooms = async (latitude: number, longitude: number) => {
    setSearching(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/api/room/nearby?latitude=${latitude}&longitude=${longitude}`,
        { withCredentials: true }
      );
      setRooms(res.data.rooms);
    } catch (error) {
      console.error("Error fetching nearby rooms", error);
    } finally {
      setSearching(false);
    }
  };

  const handleJoin = async (roomId: string) => {
    try {
      setJoiningId(roomId);
      await axios.post(
        "http://localhost:4000/api/room/join",
        {},
        { params: { roomId }, withCredentials: true }
      );

      // Close dialog and maybe redirect to the room
      onOpenChange(false);

      if (onJoinSuccess) {
        onJoinSuccess();
      }
      alert("Joined room successfully!");
    } catch (error) {
      alert("Failed to join room");
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 h-150 flex flex-col">
        <DialogHeader>
          <DialogTitle>Explore Nearby Rooms</DialogTitle>
          <DialogDescription>
            Discover and join active chat rooms around your location.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 flex-1 min-h-0 py-4">
          {/* 1. Location Status Bar */}
          <div
            className={`flex items-center justify-between p-3 border rounded-md transition-colors ${
              locationError ? "bg-red-50 border-red-200" : "bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-2 text-sm">
              <MapPin
                className={`h-4 w-4 ${
                  locationError ? "text-red-500" : "text-primary"
                }`}
              />
              {location ? (
                <span className="font-medium">
                  Lat: {location.lat.toFixed(3)}, Lng: {location.lng.toFixed(3)}
                </span>
              ) : (
                <span className="text-gray-500">
                  {locationError || "Location required to scan"}
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={getLocation}
              disabled={locationLoading}
            >
              {locationLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Scan Area"
              )}
            </Button>
          </div>

          {/* 2. Room List (Scrollable) */}
          <div className="flex-1 border rounded-md overflow-hidden relative">
            <ScrollArea className="h-full">
              {searching ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-500">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p>Scanning nearby area...</p>
                </div>
              ) : rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
                  <Users className="h-10 w-10 opacity-20" />
                  <p>No rooms found nearby.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                    >
                      {/* Left: Info */}
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage
                            src={`https://i.pravatar.cc/150?u=${room.id}`}
                          />
                          <AvatarFallback>
                            {room.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900">
                            {room.name}
                          </h4>
                          <p className="text-sm text-gray-600 ">
                            {room.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" /> {room.membersCount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Join Button */}
                      <Button
                        size="sm"
                        onClick={() => handleJoin(room.id)}
                        disabled={joiningId === room.id}
                        className="cursor-pointer bg-white text-primary border border-primary hover:bg-primary hover:text-white transition-colors"
                      >
                        {joiningId === room.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            Join <LogIn className="ml-1 h-3 w-3" />
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
