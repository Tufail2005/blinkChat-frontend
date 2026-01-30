"use client";

import { memo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Define the Room type
export type Room = {
  id: string;
  name: string;
  photo: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
};

interface SidebarItemProps {
  room: Room;
}

export const SidebarItem = memo(
  function SidebarItem({ room }: SidebarItemProps) {
    const getInitials = (name: string) =>
      name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
      // 🛑 I kept your route structure: /roomId/messages
      <Link href={`/${room.id}/messages`}>
        <div
          className={cn(
            "flex items-start gap-3 p-4 px-5 cursor-pointer transition-colors hover:bg-gray-50"
          )}
        >
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  room.photo
                    ? `${room.photo}?tr=w-400,h-400,fo-auto`
                    : undefined
                }
                alt={room.name}
                className="object-cover"
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
                  ? new Date(room.lastMessageTime).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : ""}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 overflow-hidden">
                <p className="text-sm text-gray-500 truncate max-w-35">
                  {room.lastMessage || "No messages yet"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  },
  (prev, next) => {
    // Custom comparison for maximum performance:
    // Only re-render if specific data changed
    return (
      prev.room.lastMessage === next.room.lastMessage &&
      prev.room.lastMessageTime === next.room.lastMessageTime &&
      prev.room.name === next.room.name &&
      prev.room.photo === next.room.photo
    );
  }
);
