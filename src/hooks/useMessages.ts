import useSWR from "swr";
import {ConversationResponse, MessageResponse} from "@/types/response";
import {MessageService} from "@/api/services/message-service";
import {Constants} from "@/constants";
import {SendMessageRequest} from "@/types/request";

/**
 * Hook to fetch all conversations with pagination
 */
export const useConversations = (pageNumber: number = 1, pageSize: number = 20) => {
    const key = `${Constants.CONVERSATIONS_ROUTES.MY_CONVERSATIONS}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    
    const {data, error, isLoading, mutate} = useSWR<ConversationResponse[]>(
        key,
        async () => {
            const res = await MessageService.getMyConversations(pageNumber, pageSize);
            if (res.status === "SUCCESS" && res.data) {
                const responseData = res.data as any;
                
                if (responseData.content && Array.isArray(responseData.content)) {
                    return responseData.content;
                }
                
                if (Array.isArray(responseData)) {
                    return responseData;
                }
            }
            return [];
        },
        {
            revalidateOnFocus: false,
        }
    );

    return {
        conversations: Array.isArray(data) ? data : [],
        isLoading,
        error,
        mutate,
    };
};

export const useMessages = (conversationId: string | null, pageNumber: number = 1, pageSize: number = 20) => {
    const key = conversationId 
        ? `${Constants.MESSAGES_ROUTES.GET_MESSAGES}?conversationId=${conversationId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        : null;
    
    const {data, error, isLoading, mutate} = useSWR<MessageResponse[]>(
        key,
        async () => {
            if (!conversationId) return [];
            
            const res = await MessageService.getMessages(conversationId, pageNumber, pageSize);
            if (res.status === "SUCCESS" && res.data) {
                const responseData = res.data as any;
                
                if (responseData.content && Array.isArray(responseData.content)) {
                    return responseData.content.reverse();
                }
                
                if (Array.isArray(responseData)) {
                    return responseData.reverse();
                }
            }
            
            return [];
        },
        {
            revalidateOnFocus: false,
        }
    );

    const sendMessage = async (messageText: string) => {
        if (!conversationId) return;
        
        const requestData: SendMessageRequest = {
            conversationId,
            message: messageText,
        };

        const res = await MessageService.sendMessage(requestData);
        return res;
    };

    const markAsRead = async (messageIds: string[]) => {
        await MessageService.markMessagesAsRead(messageIds);
        await mutate();
    };

    return {
        messages: Array.isArray(data) ? data : [],
        isLoading,
        error,
        mutate,
        sendMessage,
        markAsRead,
    };
};

export const useUserOnlineStatus = (userId: number | null) => {
    const key = userId ? `${Constants.WEBSOCKET_ROUTES.ONLINE_STATUS}/${userId}/online-status` : null;
    
    const {data, error, isLoading, mutate} = useSWR<{ userId: number; isOnline: boolean }>(
        key,
        async () => {
            if (!userId) return { userId: 0, isOnline: false };
            const res = await MessageService.checkUserOnlineStatus(userId);
            return res.data || { userId, isOnline: false };
        },
        {
            revalidateOnFocus: false,
        }
    );

    return {
        isOnline: data?.isOnline || false,
        isLoading,
        error,
        mutate,
    };
};

export const useLastMessage = (conversationId: string | null) => {
    const key = conversationId ? `${Constants.MESSAGES_ROUTES.LAST_MESSAGE}?conversationId=${conversationId}` : null;
    
    const {data, error, isLoading, mutate} = useSWR<MessageResponse | null>(
        key,
        async () => {
            if (!conversationId) return null;
            const res = await MessageService.getLastMessage(conversationId);
            return res.data || null;
        },
        {
            revalidateOnFocus: false,
        }
    );

    return {
        lastMessage: data,
        isLoading,
        error,
        mutate,
    };
};
