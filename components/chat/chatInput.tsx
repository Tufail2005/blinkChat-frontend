"use client";

import { useState } from "react";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

// 1. Define the Prop Type
interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

// 2. Accept the prop here
export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // 3. Create a Send Handler
  const handleSend = () => {
    if (!inputValue.trim()) return; // Don't send empty messages
    
    onSendMessage(inputValue); // <--- Call the parent function!
    setInputValue("");         // Clear the input
    setShowEmojiPicker(false); // Close emoji picker if open
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
    // Optional: Keep picker open or close it. 
    // Usually better to keep open for multiple emojis, or close for single.
  };

  // 4. Handle "Enter" key to send
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t bg-white relative">
      {/* EMOJI PICKER POPUP */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 z-50 shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={320}
            height={400}
            searchDisabled={false}
            skinTonesDisabled
            previewConfig={{ showPreview: false }}
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown} // <--- Add Key Listener
            placeholder="Enter message..."
            className="pr-24 py-6 border-gray-200 focus-visible:ring-0 focus-visible:border-gray-300 text-base"
          />
          {/* ICONS INSIDE INPUT */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Smile
                className={`h-5 w-5 ${showEmojiPicker ? "text-green-500" : ""}`}
              />
            </button>
          </div>
        </div>
        
        {/* 5. Attach Click Handler */}
        <Button 
          onClick={handleSend}
          className="h-12 px-8 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm font-medium"
        >
          Send
        </Button>
      </div>
    </div>
  );
}