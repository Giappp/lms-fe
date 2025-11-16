"use client"
import {useEffect, useRef, useState} from "react";
import {ConversationResponse} from "@/types/response";
import {useMessages, useUserOnlineStatus} from "@/hooks/useMessages";
import {MessageBubble} from "@/components/shared/MessageBubble";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Loader2} from "lucide-react";
import {useAuth} from "@/hooks/useAuth";
import {useSocket} from "@/contexts/socket-context";
import {onNewMessage, onMessageRead, emitTyping, onUserOnline, onUserOffline} from "@/lib/socket";
import {MessageService} from "@/api/services/message-service";"@/lib/socket";

interface ChatBoxProps {
    conversation: ConversationResponse | null;
}

export function ChatBox({conversation}: ChatBoxProps) {
    const [messageText, setMessageText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const {user} = useAuth();
    const {socket} = useSocket();

    const {messages, isLoading, sendMessage, mutate} = useMessages(
        conversation?.id || null
    );
    
    // Get other participant for DIRECT conversation
    const otherParticipant = conversation?.participants.find(p => p.userId !== user?.id);
    const {isOnline, mutate: mutateOnlineStatus} = useUserOnlineStatus(otherParticipant?.userId || null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Mark unread messages as read when viewing conversation
    useEffect(() => {
        if (messages.length > 0 && user) {
            // Find unread messages sent by others
            const unreadMessages = messages.filter(
                msg => !msg.me && msg.status !== "READ"
            );
            
            // Mark all unread messages as read in a single API call
            if (unreadMessages.length > 0) {
                const messageIds = unreadMessages.map(msg => msg.id);
                MessageService.markMessagesAsRead(messageIds)
                    .catch(error => {
                        console.error("Failed to mark messages as read:", error);
                    });
            }
        }
    }, [messages, user]);

    // Listen for new messages via WebSocket
    useEffect(() => {
        if (socket && conversation) {
            const handleNewMessage = (message: any) => {
                // If message belongs to current conversation, refresh
                if (message.conversationId === conversation.id) {
                    mutate();
                }
            };

            const handleMessageRead = (data: any) => {
                console.log("📬 Message read notification:", data);
                // Refresh messages to update read status
                mutate();
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
            onMessageRead(handleMessageRead);
            onUserOnline(handleUserOnline);
            onUserOffline(handleUserOffline);

            return () => {
                socket.off("new_message", handleNewMessage);
                socket.off("message_read", handleMessageRead);
                socket.off("user_online", handleUserOnline);
                socket.off("user_offline", handleUserOffline);
            };
        }
    }, [socket, conversation, mutate, otherParticipant, mutateOnlineStatus]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageText(e.target.value);
        
        // Emit typing indicator
        if (conversation && socket) {
            emitTyping(conversation.id, true);
            
            // Clear existing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            
            // Stop typing after 2 seconds of inactivity
            typingTimeoutRef.current = setTimeout(() => {
                emitTyping(conversation.id, false);
            }, 2000);
        }
    };

    const handleSendMessage = async () => {
        if (!messageText.trim() || !conversation || isSending) return;

        setIsSending(true);
        try {
            await sendMessage(messageText);
            setMessageText("");
            
            // Stop typing indicator
            if (socket) {
                emitTyping(conversation.id, false);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!conversation) {
        return (
            <div className="flex-1 flex items-center justify-center h-full bg-muted/20">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg">Select a conversation to start messaging</p>
                </div>
            </div>
        );
    }

    const displayName = conversation.conversationName
    const displayAvatar = conversation.conversationAvatar
    
    const initials = displayName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="border-b px-6 py-4 bg-background">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={displayAvatar}
                                alt={displayName}
                            />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        {conversation.type === "DIRECT" && isOnline && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full"></span>
                        )}
                    </div>
                    <div>
                        <h2 className="font-semibold">{displayName}</h2>
                        <p className="text-sm text-muted-foreground">
                            {conversation.type === "GROUP" 
                                ? `${conversation.participants.length} members` 
                                : isOnline ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message) => (
                            <MessageBubble key={message.id} message={message}/>
                        ))}
                        <div ref={messagesEndRef}/>
                    </>
                )}
            </div>

            {/* Input */}
            <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-end gap-3">
                        <div className="flex-1 relative">
                            <Textarea
                                placeholder="Type your message..."
                                value={messageText}
                                onChange={handleTextChange}
                                onKeyDown={handleKeyDown}
                                className="resize-none min-h-[44px] max-h-32 pr-12 py-3 rounded-2xl border-2 focus:border-primary transition-colors break-words overflow-y-auto"
                                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                                rows={1}
                                disabled={isSending}
                            />
                            {messageText.length > 0 && (
                                <span className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                                    {messageText.length}
                                </span>
                            )}
                        </div>
                        <Button
                            onClick={handleSendMessage}
                            disabled={!messageText.trim() || isSending}
                            size="icon"
                            className="h-11 w-11 rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? (
                                <Loader2 className="h-5 w-5 animate-spin"/>
                            ) : (
                                <FontAwesomeIcon icon={faPaperPlane} className="h-5 w-5"/>
                            )}
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                            <span className="text-xs">↵</span>
                        </kbd>
                        <span>to send</span>
                        <span className="mx-1">•</span>
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                            <span className="text-xs">⇧</span>
                            <span className="text-xs">↵</span>
                        </kbd>
                        <span>for new line</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
