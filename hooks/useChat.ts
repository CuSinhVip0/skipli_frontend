"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { socketService } from "../services/socket"
import type { ChatMessage, Conversation } from "@/types/chat.type"

interface UseChatOptions {
    roomId: string
    userId: string
    userName: string
    userType: "student" | "instructor"
}

export function useChat(options: UseChatOptions | null) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isConnected, setIsConnected] = useState(false)
    const [typingUsers, setTypingUsers] = useState<string[]>([])
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [conversations, setConversations] = useState<Conversation[]>([])

    useEffect(() => {
        if (!options) {
            return
        }

        const { roomId, userId, userName, userType } = options
        const socket = socketService.connect()

        // Join the room
        socket.emit("join_room", { roomId, userId, userName })
        const handleRoomJoined = () => {
            setIsConnected(true)
            socket.emit("get_history", { roomId, limit: 50 })
        }

        const handleChatHistory = (data: { messages: ChatMessage[] }) => {
            setMessages(data.messages || [])
        }

        const handleReceiveMessage = (message: ChatMessage) => {
            setMessages((prev) => [...prev, message])
            setConversations((prevConversations) => {
                const convoIndex = prevConversations.findIndex(
                    (convo) => convo.id === message.roomId,
                )
                if (convoIndex !== -1) {
                    const updatedConversations = [...prevConversations]
                    const convoToUpdate = updatedConversations[convoIndex]
                    convoToUpdate.lastMessage = {
                        text: message.message,
                        senderId: message.userId,
                        senderName: message.userName,
                        timestamp: message.timestamp,
                    }
                    convoToUpdate.updatedAt = message.timestamp
                    updatedConversations.splice(convoIndex, 1)
                    return [convoToUpdate, ...updatedConversations]
                }
                return prevConversations
            })
        }

        const handleUserJoined = (data: { userName: string }) => {}

        const handleUserLeft = (data: { userName: string }) => {}

        const handleUserTyping = (data: { userName: string; isTyping: boolean }) => {
            if (data.userName === userName) return

            setTypingUsers((prev) => {
                if (data.isTyping) {
                    if (!prev.includes(data.userName)) {
                        return [...prev, data.userName]
                    }
                } else {
                    return prev.filter((name) => name !== data.userName)
                }
                return prev
            })
        }

        const handleConnect = () => {
            setIsConnected(true)
        }

        const handleDisconnect = () => {
            setIsConnected(false)
        }

        socket.on("room_joined", handleRoomJoined)
        socket.on("chat_history", handleChatHistory)
        socket.on("receive_message", handleReceiveMessage)
        socket.on("user_joined", handleUserJoined)
        socket.on("user_left", handleUserLeft)
        socket.on("user_typing", handleUserTyping)
        socket.on("connect", handleConnect)
        socket.on("disconnect", handleDisconnect)

        return () => {
            socket.emit("leave_room", { roomId, userName })
            socket.off("room_joined", handleRoomJoined)
            socket.off("chat_history", handleChatHistory)
            socket.off("receive_message", handleReceiveMessage)
            socket.off("user_joined", handleUserJoined)
            socket.off("user_left", handleUserLeft)
            socket.off("user_typing", handleUserTyping)
            socket.off("connect", handleConnect)
            socket.off("disconnect", handleDisconnect)
        }
    }, [options?.roomId, options?.userId, options?.userName, options?.userType])

    const sendMessage = useCallback(
        (message: string) => {
            if (!options) return

            const socket = socketService.getSocket()
            if (socket && message.trim()) {
                socket.emit("send_message", {
                    roomId: options.roomId,
                    userId: options.userId,
                    userName: options.userName,
                    userType: options.userType,
                    message: message.trim(),
                })
            }
        },
        [options],
    )

    const sendTypingStatus = useCallback(
        (isTyping: boolean) => {
            if (!options) return

            const socket = socketService.getSocket()
            if (socket) {
                socket.emit("typing", {
                    roomId: options.roomId,
                    userName: options.userName,
                    isTyping,
                })
            }

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }

            if (isTyping) {
                typingTimeoutRef.current = setTimeout(() => {
                    if (socket) {
                        socket.emit("typing", {
                            roomId: options.roomId,
                            userName: options.userName,
                            isTyping: false,
                        })
                    }
                }, 3000)
            }
        },
        [options],
    )

    return {
        conversations,
        setConversations,
        messages,
        isConnected,
        typingUsers,
        sendMessage,
        sendTypingStatus,
    }
}
