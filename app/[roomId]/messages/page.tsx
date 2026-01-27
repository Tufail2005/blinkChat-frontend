import { ChatSidebar } from "@/components/chat/chatSidebar";
import { ChatWindow } from "@/components/chat/chatWindow";

export default function ChatPage() {
    return (
        <div className="flex h-screen w-full p-0 md:p-4 overflow-hidden">
        <div className="flex h-full md:h-[calc(100vh-2rem)] w-full bg-white shadow-xl overflow-hidden rounded-xl">
            <div className="hidden md:flex h-full">
            <ChatSidebar />
            </div>

            <div className="flex-1 h-full w-full">
            <ChatWindow />
            </div>

        </div>
        </div>
    );
    }