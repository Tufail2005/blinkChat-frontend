"use client";

import { useState, useEffect } from "react";
import { Video, Phone, MoreHorizontal, Loader2, LogOut, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { RoomInfoDialog } from "./RoomInfoDialog"; 

export function ChatHeader() {
  const params = useParams();
  const roomId = params.roomId as string;
  const router = useRouter();

  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchHeaderData = async () => {
      if (!roomId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:4000/api/room/${roomId}`, {
          withCredentials: true,
        });
        setRoom(res.data);
      } catch (error:any) {
        console.error("Failed to fetch room info");
        if (error.response && error.response.status === 404) {
              router.push("/message"); // Redirect to main chat list
              router.refresh();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchHeaderData();
  }, [roomId]);

  const getInitials = (name: string) =>
    name ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  const handleExit = async () => {
    if (confirm("Exit this room?")) {
        try {
            setIsExiting(true); // Start exiting spinner
            await axios.post(`http://localhost:4000/api/room/${roomId}/leave`, {}, { withCredentials: true });
            router.push("/message");
            router.refresh(); 
        } catch(e) { 
            console.error(e); 
            setIsExiting(false); // Stop spinner on error
        }
    }
  }

  if (loading) {
    return (
      <header className="flex items-center px-6 py-4 border-b h-[73px]">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </header>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white h-[73px]">
        
        <div 
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-discrete"
            onClick={() => setIsInfoOpen(true)}
        >
          <div className="relative">
            <Avatar className="h-10 w-10 border border-gray-100">
              <AvatarImage src={room?.photo} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
                {getInitials(room?.name)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              {room?.name}
            </h2>
            <p className="text-xs text-green-500 font-medium">
               {/* Fixed plural logic safely */}
              {room?._count?.members} {(room?._count?.members) >= 1 ? "member" : "members"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {menuOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
              aria-hidden="true"
            />
          )}
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              
              <DropdownMenuItem onClick={() => setIsInfoOpen(true)}>
                <Info className="mr-2 h-4 w-4" />
                <span>Room info</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleExit}
                disabled={isExiting} // Disable button while exiting
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                {isExiting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <LogOut className="mr-2 h-4 w-4" />
                )}
                <span>{isExiting ? "Exiting..." : "Exit Room"}</span>
              </DropdownMenuItem>
              
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <RoomInfoDialog 
        roomId={roomId} 
        isOpen={isInfoOpen} 
        onOpenChange={setIsInfoOpen} 
      />
    </>
  );
}