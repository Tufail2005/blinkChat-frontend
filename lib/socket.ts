"use client";

import { io } from "socket.io-client";

// 🛑 Ensure this matches your backend URL (usually port 4000)
export const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
    withCredentials: true, 
    autoConnect: false, 
});