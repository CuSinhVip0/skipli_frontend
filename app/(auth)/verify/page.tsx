"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, Form, Button, App, Input, Flex } from "antd"
import { useRouter, useSearchParams } from "next/navigation"
import { authService } from "@/services/auth"
import { useAuthStore } from "@/store/auth"
import { SafetyOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import { ApiError } from "@/utils/apiClient"
import { signIn } from "next-auth/react"

function VerifyContent() {
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm()
    const searchParams = useSearchParams()
    const router = useRouter()
    const { setUser } = useAuthStore()
    const { message } = App.useApp()

    const phone = searchParams.get("phone")
    const email = searchParams.get("email")
    const method = searchParams.get("method") as "sms" | "email"
    const prefilledCode = searchParams.get("code")

    const handleVerify = async (values: { code: string }) => {
        setLoading(true)
        try {
            const result = await signIn("credentials", {
                email: method === "email" ? email : phone,
                otp: values.code,
                method: method,
                redirect: false,
            })

            if (result?.error) {
                message.error("Email hoặc mật khẩu không chính xác")
            } else {
                message.success("Login successful!")
                router.push("/")
                router.refresh()
            }
        } catch {
            message.error("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoading(false)
        }
    }

    const handleResendCode = async () => {
        try {
            if (method === "sms" && phone) {
                await authService.sendSmsCode(phone)
                message.success("New code sent to your phone!")
            } else if (method === "email" && email) {
                await authService.sendEmailCode(email)
                message.success("New code sent to your email!")
            }
        } catch (error) {
            message.error((error as ApiError).error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
            <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push("/login")}
                    className="mb-4 hover:bg-gray-100 rounded-lg"
                    size="large"
                >
                    Back
                </Button>

                <div className="text-center mb-8">
                    <div className="mb-4 flex items-center justify-center ">
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <SafetyOutlined className="text-3xl text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">
                        {method === "sms" ? "Phone" : "Email"} Verification
                    </h1>
                    <p className="text-gray-500 text-base">
                        Please enter verification code sent to
                    </p>
                    <p className="font-semibold text-gray-800 mt-2 text-base">{phone || email}</p>
                </div>

                <Form form={form} onFinish={handleVerify} layout="vertical">
                    <Form.Item
                        name="code"
                        rules={[
                            { required: true, message: "Please enter the verification code" },
                            { pattern: /^\d{6}$/, message: "Code must be exactly 6 digits" },
                        ]}
                    >
                        <Flex justify="center">
                            <Input.OTP length={6} inputMode="numeric" autoFocus />
                        </Flex>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        loading={loading}
                        className="mb-3"
                    >
                        Verify & Login
                    </Button>

                    <Button type="link" block onClick={handleResendCode} className="text-gray-600">
                        Didnt receive the code? Resend
                    </Button>
                </Form>

                <div className="mt-4 text-center">
                    <Button type="link" onClick={() => router.push("/login")}>
                        Back to Login
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    )
}
