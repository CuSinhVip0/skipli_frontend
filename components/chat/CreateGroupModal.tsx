"use client"

import { useState } from "react"
import { Modal, Form, Input, Select, Button, App } from "antd"
import { TeamOutlined } from "@ant-design/icons"
import { EntitiesConversation } from "@/types/chat.type"

interface CreateGroupModalProps {
    visible: boolean
    entities: EntitiesConversation[]
    onCancel: () => void
    onCreateGroup: (name: string, participantIds: string[]) => Promise<void>
}

export default function CreateGroupModal({
    visible,
    entities,
    onCancel,
    onCreateGroup,
}: CreateGroupModalProps) {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const { message } = App.useApp()
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()
            setLoading(true)
            await onCreateGroup(values.groupName, values.participants)
            message.success("Group created successfully")
            form.resetFields()
            onCancel()
        } catch (error) {
            const err = error as Error
            message.error(err.message || "Failed to create group")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <TeamOutlined />
                    <span>Create Group Chat</span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
                    Create Group
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical" className="mt-4">
                <Form.Item
                    name="groupName"
                    label="Group Name"
                    rules={[
                        { required: true, message: "Please enter group name" },
                        { min: 3, message: "Group name must be at least 3 characters" },
                    ]}
                >
                    <Input placeholder="Enter group name" prefix={<TeamOutlined />} size="large" />
                </Form.Item>

                <Form.Item
                    name="participants"
                    label="Select Members"
                    rules={[
                        { required: true, message: "Please select at least 1 member" },
                        {
                            validator: (_, value) => {
                                if (value && value.length < 1) {
                                    return Promise.reject("Please select at least 1 member")
                                }
                                return Promise.resolve()
                            },
                        },
                    ]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select entities to add to group"
                        size="large"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={entities.map((entity) => ({
                            label: `${entity.name} - ${entity.type == "student" ? "Student" : "Instructor"}`,
                            value: entity.id,
                        }))}
                        maxTagCount="responsive"
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
