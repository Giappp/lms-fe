"use client"
import {useState} from "react";
import {useConversations} from "@/hooks/useMessages";
import {ConversationList} from "@/components/shared/ConversationList";
import {ChatBox} from "@/components/shared/ChatBox";
import {ConversationResponse} from "@/types/response";

export default function TeacherMessagesPage() {
    const {conversations, isLoading} = useConversations();
    const [selectedConversation, setSelectedConversation] =
        useState<ConversationResponse | null>(null);

    return (
        <div className="flex h-[calc(100vh-3.5rem)] bg-background">
            {/* Left Sidebar - Conversations */}
            <div className="w-80 flex-shrink-0">
                <ConversationList
                    conversations={conversations}
                    selectedConversationId={selectedConversation?.id || null}
                    onSelectConversation={setSelectedConversation}
                    isLoading={isLoading}
                />
            </div>

            {/* Right Side - Chat Box */}
            <ChatBox conversation={selectedConversation}/>
        </div>
    );
}
