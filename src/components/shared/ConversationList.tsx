"use client"
import {ConversationResponse} from "@/types/response";
import {ConversationItem} from "@/components/shared/ConversationItem";
import {Input} from "@/components/ui/input";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import {Loader2} from "lucide-react";

interface ConversationListProps {
    conversations: ConversationResponse[];
    selectedConversationId: string | null;
    onSelectConversation: (conversation: ConversationResponse) => void;
    isLoading: boolean;
}

export function ConversationList({conversations, selectedConversationId, onSelectConversation, isLoading,}: ConversationListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredConversations = (conversations || []).filter((conv) =>
        conv.conversationName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full border-r">
            <div className="p-4 border-b">
                <div className="relative">
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
                    />
                    <Input
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-sm">
                            {searchQuery ? "No conversations found" : "No conversations yet"}
                        </p>
                    </div>
                ) : (
                    filteredConversations.map((conversation) => (
                        <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isActive={conversation.id === selectedConversationId}
                            onClick={() => onSelectConversation(conversation)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
