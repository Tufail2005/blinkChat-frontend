"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image"; 
// Update the path if your Message type is in a separate types file, 
// otherwise import it from ChatWindow
import { type Message } from "./chatWindow"; 

// 1. ADD 'currentUserId' TO INTERFACE
interface MessageListProps {
  messages: Message[];
  loading: boolean;
  currentUserId: string | null; // 👈 Add this
}

export function MessageList({ messages, loading, currentUserId }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
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
    <ScrollArea className="h-full w-full">
      <div className="flex flex-col gap-4 px-4 py-4 pb-4">
        {messages.map((msg, index) => {
          
          // 2. LOGIC: Compare msg.userId with currentUserId
          // We use String() to be safe against number/string mismatches
          const isMe = currentUserId 
            ? String(msg.userId) === String(currentUserId) 
            : false;

          return (
            <div
              key={index}
              className={cn(
                "flex flex-col max-w-[75%]",
                // 3. CSS: This moves the bubble to Right (End) or Left (Start)
                isMe ? "items-end self-end" : "items-start self-start"
              )}
            >
              <div className={cn("flex items-end gap-3", isMe && "flex-row-reverse")}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${msg.userId}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "relative px-4 py-3 shadow-md text-sm leading-relaxed rounded-2xl",
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none" // Your Bubble
                      : "bg-white border border-gray-100 rounded-bl-none text-gray-700" // Their Bubble
                  )}
                >
                  <p>{msg.text}</p>
                </div>
              </div>

              <div className={cn("flex items-center gap-1 mt-1", isMe ? "mr-11" : "ml-11")}>
                <span className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                {isMe && <CheckCheck className="h-3.5 w-3.5 text-green-500" />}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}