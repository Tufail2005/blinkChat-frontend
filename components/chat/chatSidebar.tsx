"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarCreateMenu } from "./SidebarCreateMenu";
import axios from "axios";
import { socket } from "@/lib/socket"; // 2. Import the shared socket
import { SidebarItem, type Room } from "./SidebarItem"; // 3. Import the memoized item

// Shape of the incoming socket data
type NewMessagePayload = {
  roomId: string;
  text: string;
  createdAt: string;
};

export function ChatSidebar() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [searchValue, setSearchValue] = useState("");

  // --- 1. FETCH ROOMS ---
  const fetchRooms = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/room/joined", {
        withCredentials: true,
      });
      const fetchedRooms = res.data;
      setRooms(fetchedRooms);
      setFilteredRooms(fetchedRooms);
      // Connect to socket channels for all these rooms
      if (socket.connected) {
        fetchedRooms.forEach((room: Room) => {
          socket.emit("join_room", room.id);
        });
      }
    } catch (error) {
      console.error("Error fetching room info:", error);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    // LISTEN FOR THE UPDATE EVENT FROM THE DIALOG
    const handleRoomUpdate = () => {
      console.log("Room updated, refreshing sidebar...");
      fetchRooms();
    };
    window.addEventListener("room_updated", handleRoomUpdate);
    return () => {
      window.removeEventListener("room_updated", handleRoomUpdate);
    };
  }, [fetchRooms]);

  useEffect(() => {
    const filtered = rooms.filter((room) =>
      room.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [searchValue, rooms]);

  // --- 2. LISTEN FOR LIVE UPDATES ---
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const handleLiveMessage = (data: NewMessagePayload) => {
      setRooms((prevRooms) => {
        const roomIndex = prevRooms.findIndex((r) => r.id === data.roomId);
        if (roomIndex === -1) return prevRooms;

        // OPTIMIZATION TRICK:
        // We reuse the OLD objects for rooms that didn't change.
        // 'SidebarItem' sees the same object reference and SKIPS rendering them.
        const otherRooms = prevRooms.filter((r) => r.id !== data.roomId);

        // We only create a NEW object for the room that actually updated.
        const updatedRoom = {
          ...prevRooms[roomIndex],
          lastMessage: data.text,
          lastMessageTime: data.createdAt,
        };

        // Move updated room to the top
        return [updatedRoom, ...otherRooms];
      });
    };

    socket.on("receive_message", handleLiveMessage);

    // Re-join rooms if we lose connection and reconnect
    socket.on("connect", () => {
      rooms.forEach((r) => socket.emit("join_room", r.id));
    });

    return () => {
      socket.off("receive_message", handleLiveMessage);
      socket.off("connect");
    };
  }, [rooms]);

  return (
    <div className="w-[320px] flex flex-col border-r bg-white h-full min-h-0">
      {/* Header */}
      <div className="flex-none p-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
        <SidebarCreateMenu onRefresh={fetchRooms}>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10 border-dashed border-gray-300"
          >
            <Plus className="h-5 w-5 text-gray-500" />
          </Button>
        </SidebarCreateMenu>
      </div>

      {/* Search */}
      <div className="flex-none px-5 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Chats search..."
            className="pl-10 py-5 bg-white border-gray-200 text-gray-600 focus-visible:ring-1 focus-visible:ring-gray-400 rounded-xl"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col pb-2">
            {filteredRooms.map((room) => (
              // KEY CHANGE: Use the optimized component
              <SidebarItem key={room.id} room={room} />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
