"use client";

import { Search, Plus, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
// import { users } from "./chatData";
import axios from "axios";
import { useState, useEffect } from "react";

type Room = {
  id: string;
  name: string;
  photo: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
};

export function ChatSidebar() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/room/joined", {
          withCredentials: true,
        });
        setRooms(res.data);
      } catch (error) {
        console.error("Error fetching room info:", error);
      }
    };

    fetchRoom();
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="w-[320px] flex flex-col border-r bg-white h-full min-h-0">
      {/* Header*/}
      <div className="flex-none p-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Chats</h1>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 border-dashed border-gray-300"
        >
          <Plus className="h-5 w-5 text-gray-500" />
        </Button>
      </div>

      {/* Search */}
      <div className="flex-none px-5 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Chats search..."
            className="pl-10 py-5 bg-white border-gray-200 text-gray-600 focus-visible:ring-1 focus-visible:ring-gray-400 rounded-xl"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col pb-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                className={cn(
                  "flex items-start gap-3 p-4 px-5 cursor-pointer transition-colors hover:bg-gray-50"
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${room.id}`}
                    />
                    <AvatarFallback>{getInitials(room.name)}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold text-sm text-gray-900 truncate">
                      {room.name}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {room.lastMessageTime
                        ? new Date(room.lastMessageTime).toLocaleTimeString(
                            [],
                            { hour: "numeric", minute: "2-digit" }
                          )
                        : ""}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {/* <CheckCheck className="h-3.5 w-3.5 text-green-500 shrink-0" /> */}
                      <p className="text-sm text-gray-500 truncate max-w-35">
                        {room.lastMessage}
                      </p>
                    </div>
                    {/* {user.unread > 0 && (
                      <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-500 hover:bg-green-600 text-[10px]">
                        {user.unread}
                      </Badge>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
