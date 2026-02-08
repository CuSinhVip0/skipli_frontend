"use client"

import { useState, useEffect } from "react"
import { Card, Form, Input, Button, message, Space, Divider } from "antd"
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    SaveOutlined,
    RollbackOutlined,
} from "@ant-design/icons"
import { useRouter } from "next/navigation"
import { studentService } from "@/services/student"
import { useSession } from "next-auth/react"
import { ApiError } from "@/utils/apiClient"
import { phoneRegion } from "@/utils"
import { LayoutComponent } from "@/components/LayoutComponent"

export default function EditProfilePage() {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const { data: session, status, update } = useSession()

    useEffect(() => {
        if (session) {
            form.setFieldsValue({
                phone: phoneRegion(session?.user.phone || ""),
                name: session?.user.name,
                email: session?.user.email,
            })
        }
    }, [session, form])

    const handleSubmit = async (values: { name: string; email: string }) => {
        if (!session?.user.phone && !session?.user.email) {
            message.error("User information not found")
            return
        }

        setLoading(true)
        try {
            await studentService.editProfile({
                name: values.name,
                email: values.email,
            })

            message.success("Profile updated successfully!")
            await update({
                user: {
                    ...session?.user,
                    name: values.name,
                    email: values.email,
                },
            })
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to update profile")
        } finally {
            setLoading(false)
        }
    }

    return (
        <LayoutComponent title={"Edit Profile"} subtitle={"Update your personal information"}>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <Card>
                    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
                        <Form.Item
                            name="name"
                            label="Full Name"
                            rules={[
                                { required: true, message: "Please enter your name" },
                                { min: 2, message: "Name must be at least 2 characters" },
                                { max: 100, message: "Name must not exceed 100 characters" },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-gray-400" />}
                                placeholder="Enter your full name"
                                size="large"
                                maxLength={100}
                            />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[{ required: true, message: "Please enter your phone number" }]}
                        >
                            <Input
                                prefix={<PhoneOutlined className="text-gray-400" />}
                                placeholder="Enter your phone number"
                                size="large"
                                disabled={true}
                                maxLength={100}
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email Address"
                            rules={[
                                { required: true, message: "Please enter your email address" },
                                { type: "email", message: "Please enter a valid email address" },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-gray-400" />}
                                placeholder="your.email@example.com"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item className="mb-0 mt-6">
                            <Space size="middle">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={loading}
                                    size="large"
                                >
                                    Save Changes
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </LayoutComponent>
    )
}
