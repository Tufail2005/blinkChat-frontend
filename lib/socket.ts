"use client";

import { io } from "socket.io-client";

// 🛑 Ensure this matches your backend URL (usually port 4000)
export const socket = io("http://localhost:4000", {
    withCredentials: true, 
    autoConnect: false, 
});