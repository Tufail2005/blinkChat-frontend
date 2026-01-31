"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { type Message } from "./chatWindow";
import { ImageViewer } from "@/components/ImageViewer";

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  currentUserId: string | null;
}

export function MessageList({
  messages,
  loading,
  currentUserId,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [viewerData, setViewerData] = useState<{
    url: string | null;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Loading State
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  // Empty State
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center text-center p-8 opacity-80 animate-in fade-in duration-500">
          <div className="relative h-64 w-64 mb-6 opacity-80 grayscale">
            <Image
              src="/not-selected-chat.svg"
              alt="Empty conversation"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            It's quiet here...
          </h3>
          <p className="text-gray-500 max-w-xs mt-2 text-sm">
            Start the conversation by sending the first message!
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-4 px-4 py-4 pb-4">
          {messages.map((msg, index) => {
            // LOGIC: Compare msg.userId with currentUserId
            const isMe = currentUserId
              ? String(msg.userId) === String(currentUserId)
              : false;
            // --- Photo LOGIC ---
            // the raw URL from the user object
            const rawPhoto = msg.user?.photo || null;

            // Add ImageKit parameters for performance
            const userDp = rawPhoto
              ? `${rawPhoto}?tr=w-400,h-400,fo-auto,r-max`
              : undefined;

            const displayName = msg.userName;

            const initials = displayName
              ? displayName.slice(0, 2).toUpperCase()
              : "?";

            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col max-w-[75%]",
                  //CSS: This moves the bubble to Right (End) or Left (Start)
                  isMe ? "items-end self-end" : "items-start self-start"
                )}
              >
                <div
                  className={cn(
                    "flex items-end gap-3",
                    isMe && "flex-row-reverse"
                  )}
                >
                  {/* 3. CLICKABLE AVATAR WRAPPER */}
                  <div
                    onClick={() =>
                      setViewerData({
                        url: rawPhoto,
                        name: displayName as string,
                      })
                    }
                    className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                  >
                    <Avatar className="h-8 w-8 border border-gray-100 shadow-sm">
                      <AvatarImage src={userDp} className="object-cover" />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div
                    className={cn(
                      "relative px-3 py-2 shadow-md text-sm leading-snug rounded-2xl",
                      isMe
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white border border-gray-100 rounded-bl-none text-gray-700"
                    )}
                  >
                    <span
                      className={cn(
                        "text-[10px] block leading-none mb-0.5 font-bold opacity-70",
                        isMe ? "text-blue-100" : "text-gray-600"
                      )}
                    >
                      {isMe ? "You" : msg.userName}
                    </span>

                    <p>{msg.text}</p>
                  </div>
                </div>

                <div
                  className={cn(
                    "flex items-center gap-1 mt-1",
                    isMe ? "mr-11" : "ml-11"
                  )}
                >
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                  {/* {isMe && (
                    <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                  )} */}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* FULL SCREEN VIEWER */}
      <ImageViewer
        isOpen={!!viewerData}
        onClose={() => setViewerData(null)}
        imageUrl={viewerData?.url}
        altName={viewerData?.name || ""}
      />
    </>
  );
}
