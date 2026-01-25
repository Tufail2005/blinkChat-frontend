"use client";

import { Video, Phone, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function ChatHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://i.pravatar.cc/150?u=1" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-900">
            Jacquenetta Slowgrave
          </h2>
          <p className="text-xs text-green-500 font-medium">Online</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 h-9 w-9 border-none"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
