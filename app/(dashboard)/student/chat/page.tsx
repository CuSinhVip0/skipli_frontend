"use client"

import { useEffect, useState, useMemo, useCallback, useContext } from "react"
import { Button, Input, App, AutoComplete, Empty } from "antd"
import { PlusOutlined, TeamOutlined, MessageOutlined, SearchOutlined } from "@ant-design/icons"
import { chatService } from "@//services/chat"
import { ApiError } from "@//services/instructor"
import { useChat } from "@/hooks/useChat"
import ChatContainer from "@/components/chat/ChatContainer"
import ConversationList from "@/components/chat/ConversationList"
import CreateGroupModal from "@/components/chat/CreateGroupModal"
import type { Conversation, EntitiesConversation } from "@/types/chat.type"
import { useSession } from "next-auth/react"
import { LayoutComponent } from "@/components/LayoutComponent"
import { SettingContext, SettingContextType } from "@/app/providers"
import { useDispatch, useSelector } from "react-redux"
import { setName } from "@/store/redux/slice/user"

export default function InstructorChatPage() {
    // const { state } = useContext<SettingContextType>(SettingContext)
    const theme = useSelector((state: any) => state)
    console.log("🚀 ~ InstructorChatPage ~ theme:", theme)
    const dispatch = useDispatch()
    const { data: session, status } = useSession()
    const { message } = App.useApp()
    const [conversationsEntities, setConversationsEntities] = useState<any[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [loading, setLoading] = useState(false)
    const [createGroupVisible, setCreateGroupVisible] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        loadConversations()
        loadEntities()
    }, [])

    const chat = useChat(
        selectedConversation && session?.user && session.user.id && session.user.name
            ? {
                  roomId: selectedConversation.id,
                  userId: session.user.id,
                  userName: session.user.name,
                  userType: session.user.role as "student" | "instructor",
              }
            : null,
    )

    const loadConversations = useCallback(async () => {
        try {
            setLoading(true)
            const response = await chatService.getConversations()
            chat.setConversations(response.conversations || [])
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to load conversations")
        } finally {
            setLoading(false)
        }
    }, [])

    const loadEntities = useCallback(async () => {
        try {
            const response = await chatService.getEntities()
            setConversationsEntities(response.entities || [])
        } catch (error) {
            console.error("Failed to load entities:", error)
        }
    }, [])

    const handleStartChat = async (entities: EntitiesConversation) => {
        if (!session?.user || !session.user.id || !session.user.name) return

        let conversationExists: Conversation | undefined
        if (entities.entitiesType === "object") {
            conversationExists = chat.conversations.find(
                (c) => c.participantIds.includes(entities.id) && c.type !== "group",
            )
        } else {
            conversationExists = chat.conversations.find((c) => c.id === entities.id)
        }
        if (conversationExists) {
            setSelectedConversation(conversationExists)
            return
        }

        try {
            const response = await chatService.createConversation({
                name: entities.name,
                participants: [
                    {
                        id: session.user.id,
                        name: session.user.name,
                        type: session.user.role as "student" | "instructor",
                    },
                    { id: entities?.id || "", name: entities.name, type: entities.type },
                ],
            })

            if (response.isNew) {
                chat.setConversations((prev) => [response.conversation, ...prev])
            }

            setSelectedConversation(response.conversation)
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to start conversation")
        }
    }

    const handleCreateGroup = async (groupName: string, participantIds: string[]) => {
        if (!session?.user || !session.user.id || !session.user.name) return

        try {
            const participants = [
                { id: session.user.id, name: session.user.name, type: "instructor" as const },
                ...participantIds.map((id) => {
                    const entity = conversationsEntities.find((e) => e.id === id)
                    return {
                        id,
                        name: entity?.name || "Unknown",
                        type: entity?.type || "student",
                    }
                }),
            ]

            const response = await chatService.createGroup({
                name: groupName,
                participants,
            })
            chat.setConversations((prev) => [response.group, ...prev])
            setSelectedConversation(response.group)
        } catch (error) {
            const apiError = error as ApiError
            throw new Error(apiError.error || "Failed to create group")
        }
    }
    const handleDeleteGroup = async (groupId: string) => {
        try {
            await chatService.deleteGroup(groupId)
            chat.setConversations((prev) => prev.filter((conv) => conv.id !== groupId))
            if (selectedConversation?.id === groupId) {
                setSelectedConversation(null)
            }
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to delete group")
        }
    }

    const searchOptions = useMemo(() => {
        if (!searchQuery.trim()) return []

        const query = searchQuery.toLowerCase()
        return conversationsEntities
            .filter((conv) => {
                return conv.name?.toLowerCase().includes(query)
            })
            .slice(0, 10)
            .map((conv) => {
                let label = ""
                if (conv.entitiesType === "group") {
                    label = conv.name + " - Group Chat" || "Group Chat"
                } else {
                    label = conv?.name || "Unknown User"
                }

                return {
                    value: conv.id,
                    label: (
                        <div
                            key={conv.id}
                            className="flex items-center justify-between"
                            style={{ padding: "4px 0" }}
                        >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                {conv.type === "group" ? (
                                    <TeamOutlined style={{ color: "#722ed1" }} />
                                ) : (
                                    <MessageOutlined style={{ color: "#1890ff" }} />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{label}</div>
                                </div>
                            </div>
                        </div>
                    ),
                    conversation: conv,
                }
            })
    }, [searchQuery, chat.conversations, session?.user])
    return (
        <LayoutComponent
            title="Messages"
            subtitle="Manage your conversations with students"
            modals={
                <CreateGroupModal
                    visible={createGroupVisible}
                    entities={conversationsEntities.filter(
                        (e) => e.entitiesType !== "group" && e.id !== session?.user?.id,
                    )}
                    onCancel={() => setCreateGroupVisible(false)}
                    onCreateGroup={handleCreateGroup}
                />
            }
        >
            <div className="h-full flex flex-col bg-gray-100">
                <div className="flex-1 overflow-hidden">
                    <div className="max-w-screen mx-auto h-full flex gap-0">
                        <div className="w-96 p-6 bg-white border-r border-r-gray-200  flex flex-col">
                            <div className=" flex gap-2 flex-col p-4 border-b border-b-gray-200">
                                <div className="flex gap-2 mt-3">
                                    <Button
                                        styles={{
                                            root: {
                                                backgroundColor: "red",
                                                width: "210px",
                                                margin: "0 auto",
                                            },
                                        }}
                                        type="primary"
                                        icon={<TeamOutlined />}
                                        // onClick={() => setCreateGroupVisible(true)}
                                        onClick={() => {
                                            dispatch(setName("Hello Redux"))
                                        }}
                                        block
                                    >
                                        New Group
                                    </Button>{" "}
                                </div>
                                <AutoComplete
                                    value={searchQuery}
                                    options={searchOptions}
                                    showSearch={{ onSearch: (value) => setSearchQuery(value) }}
                                    onSelect={(value) => {
                                        handleStartChat(
                                            conversationsEntities.find(
                                                (c) => c.id == value,
                                            ) as EntitiesConversation,
                                        )
                                        setSearchQuery("")
                                    }}
                                    placeholder="Search conversations..."
                                    allowClear
                                    size="middle"
                                    style={{ width: "100%" }}
                                ></AutoComplete>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <ConversationList
                                    conversations={chat.conversations}
                                    currentUserId={session?.user?.id || ""}
                                    selectConversationID={selectedConversation?.id}
                                    onSelectConversation={setSelectedConversation}
                                    loading={loading}
                                />
                            </div>
                        </div>

                        <div className="flex-1 bg-white">
                            {selectedConversation && chat ? (
                                <ChatContainer
                                    handleDeleteGroup={handleDeleteGroup}
                                    messages={chat.messages}
                                    isConnected={chat.isConnected}
                                    typingUsers={chat.typingUsers}
                                    onSendMessage={chat.sendMessage}
                                    onTyping={chat.sendTypingStatus}
                                    currentUserId={session?.user?.id || ""}
                                    conversation={selectedConversation}
                                    onBack={() => setSelectedConversation(null)}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description="Select a conversation to start chatting"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </LayoutComponent>
    )
}
