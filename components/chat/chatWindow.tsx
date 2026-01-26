"use client";

import { ChatHeader } from "./chatHeader";
import { MessageList } from "./messagelist";
import { ChatInput } from "./chatInput";

export function ChatWindow() {
  return (
    <div className="flex flex-1 flex-col h-full min-h-0 bg-white overflow-hidden">
      <div className="flex-none">
        <ChatHeader />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageList />
      </div>

      <div className="flex-none">
        <ChatInput />
      </div>
    </div>
  );
}
