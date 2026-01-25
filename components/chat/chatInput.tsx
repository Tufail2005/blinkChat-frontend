"use client";

import { useState } from "react";
import { Smile, Paperclip, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

export function ChatInput() {
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInputValue((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="p-4 border-t bg-white bg-white relative">
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
            placeholder="Enter message..."
            className="pr-24 py-6 border-gray-200 focus-visible:ring-0 focus-visible:border-gray-300 text-base"
          />
          {/* ICONS INSIDE INPUT */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Emoji Trigger Button */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Smile
                className={`h-5 w-5 ${showEmojiPicker ? "text-green-500" : ""}`}
              />
            </button>

            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Mic className="h-5 w-5" />
            </button>
          </div>
        </div>
        <Button className="h-12 px-8 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm font-medium">
          Send
        </Button>
      </div>
    </div>
  );
}
