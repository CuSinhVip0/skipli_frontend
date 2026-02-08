"use client"

import { useRef, useEffect, useState } from "react"
import { Card, Input, Button, Badge, Dropdown, Avatar, Tooltip, Spin } from "antd"
import {
    SendOutlined,
    ArrowLeftOutlined,
    TeamOutlined,
    UserOutlined,
    MoreOutlined,
    InfoCircleOutlined,
} from "@ant-design/icons"
import { useRouter } from "next/navigation"
import ChatMessage from "./ChatMessage"
import TypingIndicator from "./TypingIndicator"
import type { ChatMessage as ChatMessageType, Conversation, Participant } from "@/types/chat.type"

interface ChatContainerProps {
    messages: ChatMessageType[]
    isConnected: boolean
    typingUsers: string[]
    handleDeleteGroup: (groupId: string) => void
    onSendMessage: (message: string) => void
    onTyping: (isTyping: boolean) => void
    currentUserId: string
    conversation?: Conversation
    onBack?: () => void
}

export default function ChatContainer({
    messages,
    handleDeleteGroup,
    isConnected,
    typingUsers,
    onSendMessage,
    onTyping,
    currentUserId,
    conversation,
    onBack,
}: ChatContainerProps) {
    const [inputValue, setInputValue] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const router = useRouter()

    const getConversationTitle = () => {
        if (!conversation) return "Chat"

        if (conversation.type === "group") {
            return conversation.name || "Group Chat"
        }

        const otherParticipant = conversation.participants.find(
            (p: Participant) => p.id !== currentUserId,
        )
        return otherParticipant?.name || "Unknown User"
    }

    const getConversationSubtitle = () => {
        if (!conversation) return ""

        if (conversation.type === "group") {
            return `${conversation.participants.length} members`
        }

        const otherParticipant = conversation.participants.find(
            (p: Participant) => p.id !== currentUserId,
        )
        return otherParticipant?.userType === "student" ? "Student" : "Instructor"
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInputValue(value)

        if (value.length > 0 && !isTyping) {
            setIsTyping(true)
            onTyping(true)
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false)
            onTyping(false)
        }, 1000)
    }

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue)
            setInputValue("")
            setIsTyping(false)
            onTyping(false)

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleBack = () => {
        if (onBack) {
            onBack()
        } else {
            router.back()
        }
    }

    return (
        <div className="flex flex-col h-full">
            <Card className="mb-0 rounded-b-none border-b-0 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button icon={<ArrowLeftOutlined />} onClick={handleBack} type="text" />

                        <Avatar
                            size={44}
                            icon={
                                conversation?.type === "group" ? <TeamOutlined /> : <UserOutlined />
                            }
                            style={{
                                backgroundColor:
                                    conversation?.type === "group" ? "#722ed1" : "#1890ff",
                            }}
                        >
                            {getConversationTitle().charAt(0).toUpperCase()}
                        </Avatar>

                        <div>
                            <h3 className="text-lg font-semibold m-0">{getConversationTitle()}</h3>
                            <div className="flex items-center gap-2">
                                <Badge
                                    status={isConnected ? "success" : "error"}
                                    text={isConnected ? "Connected" : "Disconnected"}
                                    className="text-sm"
                                />
                                <span className="text-sm text-gray-500">
                                    • {getConversationSubtitle()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {conversation?.type === "group" && (
                        <Tooltip title="Group Info">
                            <Button
                                icon={<InfoCircleOutlined />}
                                onClick={() => setShowInfo(!showInfo)}
                                type="text"
                            />
                        </Tooltip>
                    )}
                </div>

                {showInfo && conversation?.type === "group" && (
                    <>
                        <div className="mt-4 pt-4 border-t border-t-gray-300">
                            <h4 className="text-sm font-semibold mb-2">Members</h4>
                            <div className="flex flex-wrap gap-2">
                                {conversation.participants.map((participant: Participant) => (
                                    <div
                                        key={participant.id}
                                        className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full"
                                    >
                                        <Avatar size={24} icon={<UserOutlined />} />
                                        <span className="text-sm">{participant.name}</span>
                                        {participant.role === "admin" && (
                                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-t-gray-300">
                            <Button
                                type="primary"
                                danger
                                icon={<TeamOutlined />}
                                onClick={() => handleDeleteGroup(conversation.id)}
                                block
                            >
                                Delete Group
                            </Button>
                        </div>
                    </>
                )}
            </Card>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                {isConnected ? (
                    <>
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <div className="text-center">
                                    <TeamOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                                    <p>No messages yet. Start the conversation!</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, index) => (
                                    <ChatMessage
                                        key={msg.id || index}
                                        message={msg}
                                        isOwn={msg.userId === currentUserId}
                                    />
                                ))}
                            </>
                        )}

                        {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}

                        <div ref={messagesEndRef} />
                    </>
                ) : (
                    <div className="flex items-center justify-center h-screen">
                        <Spin size="large" />
                    </div>
                )}
            </div>

            <Card className="mt-0 rounded-t-none border-t-0 shadow-md">
                <div className="flex gap-3">
                    <Input
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        size="large"
                        disabled={!isConnected}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSend}
                        size="large"
                        disabled={!inputValue.trim() || !isConnected}
                    >
                        Send
                    </Button>
                </div>
            </Card>
        </div>
    )
}
