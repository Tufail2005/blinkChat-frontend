"use client";

import { ChatSidebar } from "@/components/chat/chatSidebar"; 
import Image from "next/image";

export default function MessageHome() {
    return (
        <div className="flex h-screen w-full p-0 md:p-4 overflow-hidden bg-gray-100 md:bg-transparent">
        <div className="flex h-full md:h-[calc(100vh-2rem)] w-full bg-white md:shadow-xl overflow-hidden md:rounded-xl">

            <div className="w-full border-r-0 lg:border-r xl:w-auto h-full flex flex-col ">
            <ChatSidebar />
            </div>

            <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50/50">
            <div className="flex flex-col items-center justify-center text-center p-8 opacity-80 animate-in fade-in duration-500">
                <div className="relative h-72 w-72 mb-6 opacity-90">
                <Image 
                    src="/not-selected-chat.svg" 
                    alt="No chat selected"
                    fill
                    className="object-contain"
                    priority
                />
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-800">
                Welcome to BlinkChat
                </h3>
                <p className="text-gray-500 max-w-sm mt-3 text-sm leading-relaxed">
                Select a conversation from the sidebar to start messaging, or create a new room to hang out with friends.
                </p>
            </div>
            </div>

        </div>
        </div>
    );
}