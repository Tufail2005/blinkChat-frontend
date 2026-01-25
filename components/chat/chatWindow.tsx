"use client";

import { ChatHeader } from "./chatHeader";
import { MessageList } from "./messagelist";
import { ChatInput } from "./chatInput";

export function ChatWindow() {
  return (
    // Added 'min-h-0' and ensured 'h-full' to force containment
    <div className="flex flex-1 flex-col h-full min-h-0 bg-white overflow-hidden">
      {/* Header stays at the top */}
      <div className="flex-none">
        <ChatHeader />
      </div>

      {/* Messages take all remaining space */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageList />
      </div>

      {/* Input stays at the bottom */}
      <div className="flex-none">
        <ChatInput />
      </div>
    </div>
  );
}
