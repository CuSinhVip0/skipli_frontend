"use client"

import { Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { format } from "date-fns"
import type { ChatMessage as ChatMessageType } from "@/types/chat.type"

interface ChatMessageProps {
    message: ChatMessageType
    isOwn: boolean
}

export default function ChatMessage({ message, isOwn }: ChatMessageProps) {
    return (
        <div className={`flex gap-3 mb-4 ${isOwn ? "flex-row-reverse" : ""}`}>
            <Avatar icon={<UserOutlined />} className={isOwn ? "bg-blue-500" : "bg-gray-500"} />

            <div className={`flex flex-col max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-600">{message.userName}</span>
                    <span className="text-xs text-gray-400">
                        {format(new Date(message.timestamp), "HH:mm")}
                    </span>
                </div>

                <div
                    style={{ padding: "4px 8px" }}
                    className={`px-4 py-2 rounded-lg ${isOwn ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                >
                    <p className="m-0 whitespace-pre-wrap wrap-break-word">{message.message}</p>
                </div>
            </div>
        </div>
    )
}
