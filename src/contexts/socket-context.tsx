"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { initializeSocket, disconnectSocket, getSocket } from "@/lib/socket";
import { useAuth } from "@/hooks/useAuth";
import { Constants } from "@/constants";

interface SocketContextState {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextState | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within SocketProvider");
    }
    return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Only connect if user is authenticated
        if (user) {
            const token = localStorage.getItem(Constants.LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
            
            if (token) {
                const socketInstance = initializeSocket(token);
                setSocket(socketInstance);

                socketInstance.on("connect", () => {
                    setIsConnected(true);
                });

                socketInstance.on("disconnect", () => {
                    setIsConnected(false);
                });
            }
        } else {
            // Disconnect when user logs out
            disconnectSocket();
            setSocket(null);
            setIsConnected(false);
        }

        return () => {
            // Cleanup on unmount
            disconnectSocket();
        };
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
