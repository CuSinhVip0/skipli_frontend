import { apiClient } from "../utils/apiClient"
import type {
    Conversation,
    CreateConversationPayload,
    CreateGroupPayload,
    EntitiesConversation,
    UpdateGroupPayload,
} from "@/types/chat.type"

export const chatService = {
    getConversations: async (): Promise<{ conversations: Conversation[] }> => {
        const response = await apiClient.get<{ conversations: Conversation[] }>(`/conversations`)
        return response.data
    },

    getEntities: async (): Promise<{ entities: EntitiesConversation[] }> => {
        const response = await apiClient.get<{ entities: EntitiesConversation[] }>(
            `/entitiesConversations`,
        )
        return response.data
    },

    createConversation: async (
        payload: CreateConversationPayload,
    ): Promise<{
        conversation: Conversation
        isNew: boolean
    }> => {
        const response = await apiClient.post<{ conversation: Conversation; isNew: boolean }>(
            "/conversation",
            payload,
        )
        return response.data
    },

    createGroup: async (
        payload: CreateGroupPayload,
    ): Promise<{
        group: Conversation
    }> => {
        const response = await apiClient.post<{ group: Conversation }>("/group", payload)
        return response.data
    },

    updateGroup: async (
        payload: UpdateGroupPayload,
    ): Promise<{
        group: Conversation
    }> => {
        const { groupId, ...data } = payload
        const response = await apiClient.put<{ group: Conversation }>(`/group/${groupId}`, data)
        return response.data
    },

    deleteGroup: async (groupId: string): Promise<{ message: string }> => {
        const response = await apiClient.delete<{ message: string }>(`/group/${groupId}`)
        return response.data
    },
}
