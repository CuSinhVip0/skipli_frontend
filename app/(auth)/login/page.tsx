"use client"

import { useRef, useState } from "react"
import { Card, Form, Input, Button, App, Space, InputRef } from "antd"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth"
import { MailOutlined, PhoneOutlined, ArrowLeftOutlined, SafetyOutlined } from "@ant-design/icons"
import { FormItemInputProps } from "antd/lib/form/FormItemInput"
import { ApiError } from "@/utils/apiClient"

type LoginMethod = "select" | "email" | "phone"

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [loginMethod, setLoginMethod] = useState<LoginMethod>("select")
    const router = useRouter()
    const { message } = App.useApp()
    const [stateInput, setStateInput] = useState<FormItemInputProps["status"]>("success")
    const inputRef = useRef<InputRef>(null)
    const handleSmsLogin = async (values: { phoneNumber: string }) => {
        setLoading(true)
        try {
            let number = values.phoneNumber.trim()
            if (!number.startsWith("+")) {
                number = "+".concat(number)
            }
            await authService.sendSmsCode(number)
            message.success("Code sent to your phone!")
            router.push(`/verify?phone=${encodeURIComponent(number)}&method=sms`)
        } catch (e) {
            setStateInput("error")
            message.error((e as ApiError).error)
            message.error("Failed to send code")
            inputRef.current!.focus({
                cursor: "all",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleEmailLogin = async (values: { email: string }) => {
        setLoading(true)
        try {
            await authService.sendEmailCode(values.email.toString().trim())
            message.success("Code sent to your email!")
            router.push(`/verify?email=${encodeURIComponent(values.email)}&method=email`)
        } catch (error) {
            setStateInput("error")
            message.error((error as ApiError).error)
            message.error("Failed to send code")
            inputRef.current!.focus({
                cursor: "all",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
            <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl">
                {loginMethod !== "select" && (
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => setLoginMethod("select")}
                        className="mb-4 hover:bg-gray-100 rounded-lg"
                        size="large"
                    >
                        Back
                    </Button>
                )}

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {loginMethod === "select"
                            ? "Sign In"
                            : loginMethod === "email"
                              ? "Email verification"
                              : "Phone verification"}
                    </h1>
                    <p className="text-gray-600">
                        {loginMethod === "select"
                            ? "Please enter your email or phone to sign in"
                            : `Please enter your ${loginMethod} to receive a verification code`}
                    </p>
                </div>

                {loginMethod === "select" && (
                    <div className="space-y-3">
                        <Button
                            type="default"
                            size="large"
                            block
                            icon={<MailOutlined />}
                            onClick={() => setLoginMethod("email")}
                            className="h-14 text-base font-medium hover:border-blue-500 hover:text-blue-500"
                        >
                            Continue with Email
                        </Button>
                        <Button
                            type="default"
                            size="large"
                            block
                            icon={<PhoneOutlined />}
                            onClick={() => setLoginMethod("phone")}
                            className="h-14 text-base font-medium hover:border-blue-500 hover:text-blue-500"
                        >
                            Continue with Phone
                        </Button>
                    </div>
                )}

                {loginMethod === "phone" && (
                    <>
                        <Form onFinish={handleSmsLogin} layout="vertical">
                            <Form.Item
                                name="phoneNumber"
                                rules={[
                                    { required: true, message: "Please enter your phone number" },
                                    {
                                        pattern: /^\+?[0-9]{9,15}$/,
                                        message: "Invalid phone number format",
                                    },
                                ]}
                                getValueFromEvent={(e) => {
                                    const val = e.target.value
                                    // chỉ cho số và dấu +
                                    return val.replace(/[^0-9+]/g, "")
                                }}
                            >
                                <Input
                                    ref={inputRef}
                                    status={stateInput}
                                    placeholder="+84987654321"
                                    size="large"
                                    prefix={<PhoneOutlined className="text-gray-400" />}
                                    inputMode="numeric"
                                />
                            </Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                                className="h-12"
                            >
                                Submit
                            </Button>
                        </Form>
                        <div className="mt-4 text-center text-sm">
                            <span className="text-gray-600">Code not received? </span>
                            <Button type="link" className="p-0">
                                Send again
                            </Button>
                        </div>
                    </>
                )}

                {loginMethod === "email" && (
                    <>
                        <Form onFinish={handleEmailLogin} layout="vertical">
                            <Form.Item
                                name="email"
                                label="Email Address"
                                rules={[
                                    { required: true, message: "Please enter your email" },
                                    {
                                        type: "email",
                                        message: "Please enter a valid email",
                                    },
                                ]}
                            >
                                <Input
                                    ref={inputRef}
                                    status={stateInput}
                                    placeholder="your@email.com"
                                    size="large"
                                    inputMode={"email"}
                                    prefix={<MailOutlined className="text-gray-400" />}
                                />
                            </Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                size="large"
                                loading={loading}
                                className="h-12"
                            >
                                Submit
                            </Button>
                        </Form>
                        <div className="mt-4 text-center text-sm">
                            <span className="text-gray-600">Code not received? </span>
                            <Button type="link" className="p-0">
                                Send again
                            </Button>
                        </div>
                    </>
                )}

                {loginMethod === "select" && (
                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">Dont having account? </span>
                        <Button type="link" className="p-0 font-medium">
                            Sign up
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    )
}
