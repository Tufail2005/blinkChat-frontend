"use client";

import { Search, Plus, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { users } from "./chatData";

export function ChatSidebar() {
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
            {users.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "flex items-start gap-3 p-4 px-5 cursor-pointer transition-colors hover:bg-gray-50"
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://i.pravatar.cc/150?u=${user.id}`}
                    />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  {user.status === "online" && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-semibold text-sm text-gray-900 truncate">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {user.time}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <CheckCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      <p className="text-sm text-gray-500 truncate max-w-35">
                        {user.lastMsg}
                      </p>
                    </div>
                    {user.unread > 0 && (
                      <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-500 hover:bg-green-600 text-[10px]">
                        {user.unread}
                      </Badge>
                    )}
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
