"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquarePlus, UserPlus } from "lucide-react";
import { CreateRoomDialog } from "./createRoomDialog";
import { NearbyRoomDialog } from "./NearbyRoomDialog";

interface SidebarCreateMenuProps {
  children: React.ReactNode;
  onRefresh?: () => void;
}

export function SidebarCreateMenu({
  children,
  onRefresh,
}: SidebarCreateMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showNearbyRoom, setShowNearbyRoom] = useState(false);

  return (
    <>
      {/* Dialogs */}
      <CreateRoomDialog
        open={showCreateRoom}
        onOpenChange={setShowCreateRoom}
        onSuccess={onRefresh}
      />
      
      <NearbyRoomDialog
        open={showNearbyRoom}
        onOpenChange={setShowNearbyRoom}
        onJoinSuccess={onRefresh}
      />

      {/* dropdown */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
          aria-hidden="true"
        />
      )}

      {/* Menu */}
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 z-50">
          <DropdownMenuLabel>Create New</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              setShowCreateRoom(true);
              setMenuOpen(false);
            }}
          >
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            <span>Create Room</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => {
              setShowNearbyRoom(true); // 4. Open Nearby Dialog
              setMenuOpen(false);
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Nearby Room List</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
