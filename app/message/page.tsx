import { ChatSidebar } from "@/components/chat/chatSidebar";
import { ChatWindow } from "@/components/chat/chatWindow";

export default function () {
  return (
    <div className="flex h-screen w-full p-4 overflow-hidden">
      <div className="flex h-[calc(100vh-2rem)] w-full  bg-white shadow-xl overflow-hidden">
        {/* Sidebar (Fixed Width) */}
        <ChatSidebar />

        {/* Chat Window (Flex Grow) */}
        <ChatWindow />
      </div>
    </div>
  );
}
