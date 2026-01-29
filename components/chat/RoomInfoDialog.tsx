"use client";

import { useEffect, useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    } from "@/components/ui/dialog";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { Pencil, Camera, Users, LogOut, Check, X } from "lucide-react";
    import axios from "axios";
    import { useRouter } from "next/navigation";

    interface RoomInfoDialogProps {
    roomId: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    }

    export function RoomInfoDialog({ roomId, isOpen, onOpenChange }: RoomInfoDialogProps) {
    const [roomDetails, setRoomDetails] = useState<any>(null);
    
    // State for editing Name
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");

    // State for editing Description
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [newDescription, setNewDescription] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // 1. Fetch Full Details when Dialog Opens
    useEffect(() => {
        if (isOpen && roomId) {
        axios
            .get(`http://localhost:4000/api/room/${roomId}`, { withCredentials: true })
            .then((res) => {
            setRoomDetails(res.data);
            setNewName(res.data.name || "");
            setNewDescription(res.data.description || "");
            })
            .catch((err) => console.error("Failed to load room details", err));
        }
    }, [isOpen, roomId]);

    // 2. Generic Update Function (Handles both Name and Description)
    const handleUpdateRoom = async (field: "name" | "description") => {
        const value = field === "name" ? newName : newDescription;
        
        // Don't update if empty (optional check)
        if (!value.trim()) return;

        try {
        // Sending strictly the field we want to update
        const payload = { [field]: value }; 

        await axios.put(
            `http://localhost:4000/api/room/${roomId}/update`, 
            payload,
            { withCredentials: true }
        );

        // Update local state to reflect changes immediately (Optimistic Update)
        setRoomDetails((prev: any) => ({ ...prev, [field]: value }));
        
        // Close the specific edit mode
        if (field === "name") setIsEditingName(false);
        if (field === "description") setIsEditingDesc(false);
        
        } catch (error: any) {
        console.error(`❌ Failed to update ${field}:`, error);
        if (error.response) {
            console.error("Server Message:", error.response.data);
            alert(`Error: ${error.response.data.message || "Update failed"}`);
        }
        }
    };

    // 3. Handle Image Upload Trigger
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        console.log("File selected:", file);
        alert("Image upload logic goes here!");
    };

    // 4. Handle Exit Group
    const handleExitGroup = async () => {
        if (!confirm("Are you sure you want to leave this group?")) return;

        try {
        await axios.post(`http://localhost:4000/api/room/${roomId}/leave`, {}, { withCredentials: true });
        router.push("/message");
        onOpenChange(false);
        } catch (error) {
        console.error("Failed to leave group", error);
        }
    };

    if (!roomDetails) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white">
            <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold">Group Info</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center p-6 pt-2 border-b bg-gray-50/50">
            {/* --- DP SECTION --- */}
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
                <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                <AvatarImage src={roomDetails.photo} />
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                    {roomDetails.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
                </div>
                <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange} 
                />
            </div>

            {/* --- NAME SECTION (Updated) --- */}
            <div className="mt-4 w-full flex justify-center items-center gap-2">
                {isEditingName ? (
                <div className="flex items-center gap-2 w-full max-w-[250px]">
                    <Input 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="h-8 text-center font-semibold text-lg"
                    autoFocus
                    />
                    <Button size="sm" onClick={() => handleUpdateRoom("name")} className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600">
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingName(false)} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                ) : (
                <div className="flex items-center gap-2 group">
                    <h2 className="text-xl font-semibold text-gray-900">{roomDetails.name}</h2>
                    <Pencil 
                        className="h-4 w-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600" 
                        onClick={() => setIsEditingName(true)}
                    />
                </div>
                )}
            </div>

            <p className="text-sm text-gray-500 mt-1">
                Group · {roomDetails._count?.members || 0} members
            </p>
            </div>

            <ScrollArea className="max-h-[400px]">
            <div className="p-6 space-y-6">
                
                {/* --- DESCRIPTION SECTION --- */}
                <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    {!isEditingDesc && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingDesc(true)} className="h-8 w-8 p-0">
                        <Pencil className="h-4 w-4 text-green-600" />
                    </Button>
                    )}
                </div>
                
                {isEditingDesc ? (
                    <div className="flex gap-2">
                    <Input 
                        value={newDescription} 
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                    />
                    <Button size="sm" onClick={() => handleUpdateRoom("description")} className="h-8 w-8 p-0 bg-green-500 hover:bg-green-600">
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingDesc(false)} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                    </Button>
                    </div>
                ) : (
                    <p className="text-sm text-gray-700 leading-relaxed">
                    {roomDetails.description || "Add a group description..."}
                    </p>
                )}
                </div>

                <div className="h-px bg-gray-100" />

                {/* --- MEMBERS SECTION --- */}
                <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{roomDetails.members?.length} Members</span>
                </div>
                
                <div className="space-y-3">
                    {roomDetails.members?.map((member: any) => (
                    <div key={member.id} className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                        <AvatarFallback>{member.userName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {member.userName || "Unknown User"}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* --- EXIT BUTTON --- */}
                <Button 
                variant="destructive" 
                className="w-full gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
                onClick={handleExitGroup}
                >
                <LogOut className="h-4 w-4" />
                Exit Room
                </Button>

            </div>
            </ScrollArea>
        </DialogContent>
        </Dialog>
    );
}