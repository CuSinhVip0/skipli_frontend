export interface ChatMessage {
    id?: string
    roomId: string
    userId: string
    userName: string
    userType: "student" | "instructor"
    message: string
    timestamp: string
}

export interface Participant {
    id: string
    name: string
    userType: "student" | "instructor"
    role?: "admin" | "member"
}

export interface Conversation {
    id: string
    type: "direct" | "group"
    name?: string
    participantIds: string[]
    participants: Participant[]
    creatorId?: string
    lastMessage?: {
        text: string
        senderId: string
        senderName: string
        timestamp: string
    }
    lastSeen?: Record<string, string>
    createdAt: string
    updatedAt: string
}

export interface EntitiesConversation {
    id: string
    entitiesType: "object" | "group"
    name: string
    type: "student" | "instructor"
}

export interface ChatRoom {
    roomId: string
    participants: string[]
    lastMessage?: ChatMessage
}

export interface TypingStatus {
    userId: string
    userName: string
    isTyping: boolean
}

export interface JoinRoomPayload {
    roomId: string
    userId: string
    userName: string
}

export interface SendMessagePayload {
    roomId: string
    userId: string
    userName: string
    userType: "student" | "instructor"
    message: string
}

export interface GetHistoryPayload {
    roomId: string
    limit?: number
}

export interface ChatHistoryResponse {
    messages: ChatMessage[]
}

export interface TypingPayload {
    roomId: string
    userName: string
    isTyping: boolean
}

export interface CreateConversationPayload {
    name?: string
    participants: Array<{
        id: string
        name: string
        type: "student" | "instructor"
    }>
}

export interface CreateGroupPayload {
    name: string
    participants: Array<{
        id: string
        name: string
        type: "student" | "instructor"
    }>
}

export interface UpdateGroupPayload {
    groupId: string
    action: "rename" | "update_members"
    name?: string
    participants?: Array<{
        id: string
        name: string
        type: "student" | "instructor"
        role?: "admin" | "member"
    }>
}
