"use client"

import { Modal, Form, Input, message } from "antd"
import { useState } from "react"
import { ApiError, instructorService } from "@/services/instructor"
import { MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons"
import { AddStudentPayload, Student } from "@/types/student.type"
import { phoneAddCode, phoneRegion } from "@/utils"
interface AddStudentModalProps {
    values: Student | null
    mode?: "add" | "edit"
    open: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function AddStudentModal({
    values = null,
    mode = "add",
    open,
    onClose,
    onSuccess,
}: AddStudentModalProps) {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (data: AddStudentPayload) => {
        setLoading(true)
        try {
            if (mode === "edit" && values) {
                await instructorService.editStudent(values.phone, {
                    ...data,
                    id: values.id,
                })
                message.success("Student updated successfully!")
            } else {
                await instructorService.addStudent({
                    ...data,
                    phone: phoneAddCode(data.phone),
                })
                message.success(
                    "Student added successfully!  An email will be sent to the student.",
                )
            }
            form.resetFields()
            onSuccess()
            onClose()
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to add student")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        form.resetFields()
        onClose()
    }

    return (
        <Modal
            title={mode === "add" ? "Add New Student" : "Edit Student"}
            centered
            open={open}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    ...values,
                    phone: phoneRegion(values?.phone || ""),
                }}
            >
                <Form.Item
                    name="name"
                    label="Student Name"
                    rules={[
                        { required: true, message: "Please enter student name" },
                        { min: 2, message: "Name must be at least 2 characters" },
                    ]}
                >
                    <Input placeholder="Student Name..." prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[
                        { required: true, message: "Please enter phone number" },
                        {
                            pattern: /^(\+84|84|0)[0-9]{9}$/,
                            message: "Please enter a valid phone number",
                        },
                    ]}
                >
                    <Input
                        disabled={mode === "edit"}
                        placeholder="0987654321"
                        prefix={<PhoneOutlined />}
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                        { required: true, message: "Please enter email address" },
                        { type: "email", message: "Please enter a valid email" },
                    ]}
                >
                    <Input placeholder="student@example.com" prefix={<MailOutlined />} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
