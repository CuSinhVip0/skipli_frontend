"use client"

import { Avatar, Badge, Typography, Empty, Spin } from "antd"
import { UserOutlined, TeamOutlined } from "@ant-design/icons"
import type { Conversation } from "@/types/chat.type"
import { formatDistanceToNow } from "date-fns"

const { Text } = Typography

interface ConversationListProps {
    conversations: Conversation[]
    currentUserId: string
    selectConversationID?: string
    onSelectConversation: (conversation: Conversation) => void
    loading?: boolean
}

export default function ListConversation({
    conversations,
    currentUserId,
    selectConversationID,
    onSelectConversation,
    loading = false,
}: ConversationListProps) {
    const getConversationName = (conversation: Conversation) => {
        if (conversation.type === "group") {
            return conversation.name + " - Group Chat" || "Group Chat"
        }
        const otherParticipant = conversation.participants.find((p) => p.id !== currentUserId)
        return otherParticipant?.name || "Unknown User"
    }

    const formatTime = (timestamp: string) => {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    }

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spin size="large" />
            </div>
        )
    }

    if (conversations.length === 0) {
        return (
            <div className="h-full flex items-center justify-center">
                <Empty description="No conversations yet" />
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto flex flex-col gap-4">
            {conversations.map((conversation) => {
                const isSelect = conversation.id === selectConversationID
                const conversationName = getConversationName(conversation)

                return (
                    <div
                        key={conversation.id}
                        onClick={() => onSelectConversation(conversation)}
                        className={`cursor-pointer transition-all hover:bg-gray-50 border-b border-gray-100
                            ${isSelect ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}
                        `}
                    >
                        <div className="flex gap-3">
                            <Badge offset={[-5, 5]}>
                                <Avatar
                                    size={48}
                                    icon={
                                        conversation.type === "group" ? (
                                            <TeamOutlined />
                                        ) : (
                                            <UserOutlined />
                                        )
                                    }
                                    style={{
                                        backgroundColor:
                                            conversation.type === "group" ? "#722ed1" : "#1890ff",
                                    }}
                                >
                                    {conversationName.charAt(0).toUpperCase()}
                                </Avatar>
                            </Badge>

                            <div className="flex-1 ">
                                <div className="flex justify-between items-center mb-1">
                                    <Text strong className="text-base truncate">
                                        {conversationName}
                                    </Text>
                                    {conversation.lastMessage && (
                                        <Text
                                            type="secondary"
                                            className="text-xs whitespace-nowrap ml-2"
                                        >
                                            {formatTime(conversation.lastMessage.timestamp)}
                                        </Text>
                                    )}
                                </div>

                                <div className="text-sm text-gray-600 truncate">
                                    {conversation.lastMessage ? (
                                        <>
                                            <span className="font-medium">
                                                {conversation.lastMessage.senderName}:
                                            </span>{" "}
                                            {conversation.lastMessage.text}
                                        </>
                                    ) : (
                                        <Text type="secondary" italic>
                                            No messages yet
                                        </Text>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
