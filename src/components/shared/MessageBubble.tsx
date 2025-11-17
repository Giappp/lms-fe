"use client"
import {MessageResponse} from "@/types/response";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface MessageBubbleProps {
    message: MessageResponse;
}

export function MessageBubble({message}: MessageBubbleProps) {
    const isSentByMe = message.me;
    
    const senderInitials = message.sender.fullName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div
            className={cn(
                "flex mb-3 gap-3 animate-in fade-in-50 duration-300",
                isSentByMe ? "justify-end" : "justify-start"
            )}
        >
            {!isSentByMe && (
                <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={message.sender.avatarUrl} alt={message.sender.fullName}/>
                    <AvatarFallback className="text-xs">{senderInitials}</AvatarFallback>
                </Avatar>
            )}
            
            <div
                className={cn(
                    "max-w-[75%] rounded-2xl px-5 py-1.5 shadow-sm transition-all hover:shadow-md break-words overflow-hidden",
                    isSentByMe
                        ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm"
                        : "bg-muted/80 backdrop-blur-sm border border-border/50 rounded-bl-sm"
                )}
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            >
                <p className="text-[15px] leading-tight whitespace-pre-wrap break-words overflow-wrap-anywhere">
                    {message.message}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-0">
                    <span
                        className={cn(
                            "text-[11px] font-medium",
                            isSentByMe ? "text-primary-foreground/80" : "text-muted-foreground/90"
                        )}
                    >
                        {format(new Date(message.createdDate), "HH:mm")}
                    </span>
                    {isSentByMe && (
                        <span
                            className={cn(
                                "text-sm font-semibold transition-colors",
                                message.status === "READ" 
                                    ? "text-primary-foreground/90" 
                                    : "text-primary-foreground/60"
                            )}
                        >
                            {message.status === "READ" ? "✓✓" : "✓"}
                        </span>
                    )}
                </div>
            </div>
            
            {isSentByMe && (
                <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={message.sender.avatarUrl} alt={message.sender.fullName}/>
                    <AvatarFallback className="text-xs">{senderInitials}</AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}
