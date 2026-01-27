"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { ChatHeader } from "./chatHeader";
import { MessageList } from "./messagelist"; 
import { ChatInput } from "./chatInput";
import { socket } from "@/lib/socket"; 

// 🛑 TYPE DEFINITION
export type Message = {
  id?: string;       // Database ID
  text: string;
  userId: string;    // Used to compare against 'myUserId'
  userName?: string; 
  createdAt: string;
};

export function ChatWindow() {
  const params = useParams();
  const roomId = params.roomId as string;

  // --- STATE ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 1. IDENTITY STATE: Stores the ID of the currently logged-in user
  const [myUserId, setMyUserId] = useState<string | null>(null);

  // --- STEP 1: VERIFY IDENTITY (Get ID from HttpOnly Cookie) ---
  useEffect(() => {
    const fetchUserIdentity = async () => {
      try {
        // We ask the backend "Who am I?"
        // 'withCredentials: true' sends the auth_token cookie automatically
        const res = await axios.get("http://localhost:4000/api/auth/me", {
          withCredentials: true,
        });

        if (res.data?.id) {
          console.log("✅ Identity Verified:", res.data.id);
          setMyUserId(res.data.id);
        }
      } catch (error) {
        console.error("❌ Failed to verify identity (User might be logged out)");
        // Optional: Redirect to login here if strict auth is needed
      }
    };

    fetchUserIdentity();
  }, []);

  // --- STEP 2: FETCH MESSAGE HISTORY (Redis/DB) ---
  const fetchMessages = useCallback(async () => {
    if (!roomId) return;
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:4000/api/room/${roomId}/messages`, {
        withCredentials: true,
        params: { limit: 50 } 
      });

      if (res.data.success) {
        // Reverse needed if backend returns Newest->Oldest (we want Oldest->Newest)
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  // --- STEP 3: LIVE SOCKET CONNECTION ---
  useEffect(() => {
    // Ensure socket is connected
    if (!socket.connected) socket.connect();

    // A. Join the Room
    socket.emit("join_room", roomId);

    // B. Listen for Incoming Messages
    const handleReceiveMessage = (newMessage: Message) => {
      setMessages((prev) => {
        // Deduplication: Prevent showing the same message twice
        // (Handles rare race conditions between REST fetch and Socket event)
        const exists = prev.some(
            m => m.createdAt === newMessage.createdAt && m.userId === newMessage.userId
        );
        return exists ? prev : [...prev, newMessage];
      });
    };

    socket.on("receive_message", handleReceiveMessage);

    // Cleanup: Unsubscribe and leave room on unmount
    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.emit("leave_room", roomId);
    };
  }, [roomId]);

  // Trigger fetch history on mount
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // --- SEND HANDLER ---
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // We do NOT send userId here. 
    // The backend extracts it securely from the socket cookie.
    socket.emit("send_message", {
      roomId,
      message: text,
    });
  };

  return (
    <div className="flex flex-1 flex-col h-full min-h-0 bg-white overflow-hidden">
      {/* 1. HEADER */}
      <div className="flex-none ">
        <ChatHeader />
      </div>

      {/* 2. MESSAGE LIST */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageList 
            messages={messages} 
            loading={loading} 
            currentUserId={myUserId} // This prop controls the Right/Left alignment
        />
      </div>

      {/* 3. INPUT */}
      <div className="flex-none">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}