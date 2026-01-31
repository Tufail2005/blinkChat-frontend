"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings } from "lucide-react";
import { UserInfoDialog } from "./UserInfoDialog"; 

interface UserSidebarFooterProps {
    user: any; 
    setUser: (user: any) => void;
    }

    export function UserSidebarFooter({ user, setUser }: UserSidebarFooterProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Even if user is missing, we render the box
    const isLoading = !user;

    return (
        <>
        {/* h-[80px]: This forces the box height to match the message input area */}
        <div className="h-[83px] px-4 border-t bg-gray-50 flex items-center mt-auto">
            
            {isLoading ? (
            // LOADING STATE: Keeps the shape while fetching
            <div className="flex items-center gap-3 w-full animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-12 bg-gray-200 rounded" />
                </div>
            </div>
            ) : (
            // LOADED STATE: Your actual content
            <div 
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer transition-all group border border-transparent hover:border-gray-200"
                onClick={() => setIsDialogOpen(true)}
            >
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage src={user.photo} className="object-cover" />
                <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">
                    {user.userName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-gray-800 truncate">
                    {user.userName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                    My Profile
                </p>
                </div>

                <Settings className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            )}
        </div>

        <UserInfoDialog 
            isOpen={isDialogOpen} 
            onOpenChange={setIsDialogOpen}
            currentUser={user}
            onUserUpdate={setUser}
        />
        </>
    );
}