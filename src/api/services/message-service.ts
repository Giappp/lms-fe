import {axiosInstance} from "@/api/core/axiosInstance";
import {Constants} from "@/constants";
import {SendMessageRequest, CreateConversationRequest} from "@/types/request";
import {ConversationResponse, MessageResponse, PaginatedResponse} from "@/types/response";
import {ApiResponse} from "@/api/core/apiCall";

export class MessageService {

    static async getMyConversations(pageNumber: number = 1, pageSize: number = 20): Promise<ApiResponse<PaginatedResponse<ConversationResponse>>> {
        const response = await axiosInstance.get(Constants.CONVERSATIONS_ROUTES.MY_CONVERSATIONS, {
            params: { pageNumber, pageSize }
        });
        return response.data;
    }

    static async createConversation(data: CreateConversationRequest): Promise<ApiResponse<ConversationResponse>> {
        const response = await axiosInstance.post(Constants.CONVERSATIONS_ROUTES.CREATE, data);
        return response.data;
    }

    static async getMessages(conversationId: string, pageNumber: number = 1, pageSize: number = 20): Promise<ApiResponse<PaginatedResponse<MessageResponse>>> {
        const response = await axiosInstance.get(Constants.MESSAGES_ROUTES.GET_MESSAGES, {
            params: {conversationId, pageNumber, pageSize}
        });
        return response.data;
    }

    static async getLastMessage(conversationId: string): Promise<ApiResponse<MessageResponse>> {
        const response = await axiosInstance.get(Constants.MESSAGES_ROUTES.LAST_MESSAGE, {
            params: {conversationId}
        });
        return response.data;
    }

    static async sendMessage(data: SendMessageRequest): Promise<ApiResponse<MessageResponse>> {
        const response = await axiosInstance.post(Constants.MESSAGES_ROUTES.SEND_MESSAGE, data);
        return response.data;
    }

    static async markMessagesAsRead(messageIds: string[]): Promise<ApiResponse<void>> {
        const response = await axiosInstance.put(`${Constants.MESSAGES_ROUTES.MARK_AS_READ}`, messageIds);
        return response.data;
    }

    static async checkUserOnlineStatus(userId: number): Promise<ApiResponse<{ userId: number; isOnline: boolean }>> {
        const response = await axiosInstance.get(`${Constants.WEBSOCKET_ROUTES.ONLINE_STATUS}/${userId}/online-status`);
        return response.data;
    }
}
