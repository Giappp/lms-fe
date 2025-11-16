"use client"
import {ConversationResponse} from "@/types/response";
import {cn} from "@/lib/utils";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {formatDistanceToNow} from "date-fns";
import {useLastMessage, useUserOnlineStatus} from "@/hooks/useMessages";
import {useSocket} from "@/contexts/socket-context";
import {onNewMessage, onUserOnline, onUserOffline} from "@/lib/socket";
import {useEffect} from "react";
import {useAuth} from "@/hooks/useAuth";

interface ConversationItemProps {
    conversation: ConversationResponse;
    isActive: boolean;
    onClick: () => void;
}

export function ConversationItem({conversation, isActive, onClick}: ConversationItemProps) {
    const displayName = conversation.conversationName
    const displayAvatar = conversation.conversationAvatar
    const {lastMessage, mutate: mutateLastMessage} = useLastMessage(conversation.id);
    const {socket} = useSocket();
    const {user} = useAuth();
    
    // Get other participant for DIRECT conversation
    const otherParticipant = conversation.type === "DIRECT" 
        ? conversation.participants.find(p => p.userId !== user?.id)
        : null;
    const {isOnline, mutate: mutateOnlineStatus} = useUserOnlineStatus(otherParticipant?.userId || null);
    
    const initials = displayName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const timeAgo = lastMessage 
        ? formatDistanceToNow(new Date(lastMessage.createdDate), { addSuffix: true })
        : formatDistanceToNow(new Date(conversation.modifiedDate), { addSuffix: true });

    // Listen for new messages and update last message cache
    useEffect(() => {
        if (socket) {
            const handleNewMessage = (message: any) => {
                // If message belongs to this conversation, update last message
                if (message.conversationId === conversation.id) {
                    mutateLastMessage(message, false); // Update cache without revalidation
                }
            };

            const handleUserOnline = (data: { userId: number }) => {
                // If this is the other participant, update their online status
                if (otherParticipant && data.userId === otherParticipant.userId) {
                    mutateOnlineStatus({ userId: data.userId, isOnline: true }, false);
                }
            };

            const handleUserOffline = (data: { userId: number }) => {
                // If this is the other participant, update their online status
                if (otherParticipant && data.userId === otherParticipant.userId) {
                    mutateOnlineStatus({ userId: data.userId, isOnline: false }, false);
                }
            };

            onNewMessage(handleNewMessage);
            onUserOnline(handleUserOnline);
            onUserOffline(handleUserOffline);

            return () => {
                socket.off("new_message", handleNewMessage);
                socket.off("user_online", handleUserOnline);
                socket.off("user_offline", handleUserOffline);
            };
        }
    }, [socket, conversation.id, mutateLastMessage, otherParticipant, mutateOnlineStatus]);

    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-accent/50 border-b",
                isActive && "bg-accent"
            )}
        >
            <div className="relative">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={displayAvatar} alt={displayName}/>
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                {conversation.type === "DIRECT" && isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate">
                        {displayName}
                    </h3>
                    <span className="text-xs text-muted-foreground ml-auto">{timeAgo}</span>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground line-clamp-2 break-words overflow-wrap-anywhere pr-2">
                        {lastMessage ? lastMessage.message : "Direct message"}
                    </p>
                </div>
            </div>
        </div>
    );
}
