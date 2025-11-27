import { io, Socket } from "socket.io-client";
import { Constants } from "@/constants";

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
    return socket;
};

/**
 * Backend requires token as URL parameter: ws://localhost:9092?token=eyJhbGc...
 */
export const initializeSocket = (token: string): Socket => {
    if (socket?.connected) {
        return socket;
    }

    if (socket) {
        disconnectSocket();
    }

    socket = io(Constants.SOCKET_URL, {
        transports: ["websocket", "polling"],
        query: {
            token,
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
        console.log("✅ Socket.IO connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("❌ Socket.IO disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
        console.error("❌ Socket.IO connection error:", error.message);
    });

    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
        console.log("🔌 Socket.IO disconnected");
    }
};

export const onNewMessage = (callback: (message: any) => void) => {
    socket?.on("new_message", (data: string | any) => {
        try {
            // Backend sends JSON string, need to parse it
            const message = typeof data === 'string' ? JSON.parse(data) : data;
            console.log("📨 Received new_message:", message);
            callback(message);
        } catch (error) {
            console.error("❌ Failed to parse new_message:", error, data);
        }
    });
};

export const onMessageRead = (callback: (data: any) => void) => {
    socket?.on("message_read", callback);
};

export const onUserTyping = (callback: (data: { conversationId: string; userId: number; isTyping: boolean }) => void) => {
    socket?.on("user_typing", callback);
};

export const emitTyping = (conversationId: string, isTyping: boolean) => {
    socket?.emit("typing", { conversationId, isTyping });
};

export const onUserOnline = (callback: (data: { userId: number }) => void) => {
    socket?.on("user_online", (data: string | any) => {
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            console.log("🟢 User came online:", parsed);
            callback(parsed);
        } catch (error) {
            console.error("❌ Failed to parse user_online:", error, data);
        }
    });
};

export const onUserOffline = (callback: (data: { userId: number }) => void) => {
    socket?.on("user_offline", (data: string | any) => {
        try {
            const parsed = typeof data === 'string' ? JSON.parse(data) : data;
            console.log("🔴 User went offline:", parsed);
            callback(parsed);
        } catch (error) {
            console.error("❌ Failed to parse user_offline:", error, data);
        }
    });
};

/**
 * Listen for new enrollment requests (Teacher receives)
 */
export const onEnrollmentRequest = (callback: (enrollment: any) => void) => {
    socket?.on("enrollment_request", (data: string | any) => {
        try {
            const enrollment = typeof data === 'string' ? JSON.parse(data) : data;
            console.log("📚 Received enrollment_request:", enrollment);
            callback(enrollment);
        } catch (error) {
            console.error("❌ Failed to parse enrollment_request:", error, data);
        }
    });
};

/**
 * Listen for enrollment status updates (Student receives)
 */
export const onEnrollmentStatusUpdate = (callback: (enrollment: any) => void) => {
    socket?.on("enrollment_status_update", (data: string | any) => {
        try {
            const enrollment = typeof data === 'string' ? JSON.parse(data) : data;
            console.log("🎓 Received enrollment_status_update:", enrollment);
            callback(enrollment);
        } catch (error) {
            console.error("❌ Failed to parse enrollment_status_update:", error, data);
        }
    });
};
