"use client"

import { Modal, Form, Input, message, Select } from "antd"
import { useEffect, useState } from "react"
import { instructorService } from "@/services/instructor"
import { ApiError } from "@/services/instructor"
import { Lesson } from "@/types/lesson.type"
import { phoneRegion } from "@/utils"
const { TextArea } = Input

interface AssignLessonModalProps {
    open: boolean
    values: Lesson | null
    mode?: "add" | "edit"
    onClose: () => void
    onSuccess: () => void
}

export default function AssignLessonModal({
    open,
    values,
    mode,
    onClose,
    onSuccess,
}: AssignLessonModalProps) {
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [students, setStudents] = useState<{ label: string; value: string }[]>([])
    const loadStudents = async () => {
        setLoading(true)
        try {
            const response = await instructorService.getStudents()
            setStudents(
                response.students.map((student: any) => ({
                    label: student.name + " (" + phoneRegion(student.phone) + ")",
                    value: student.phone,
                })),
            )
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to load students")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadStudents()
    }, [open])

    const handleSubmit = async (data: any) => {
        if (!data.studentPhone || data.studentPhone.length === 0) {
            message.error("No student selected")
            return
        }

        setLoading(true)
        try {
            if (mode === "edit" && data) {
                await instructorService.updateLesson({
                    id: values?.id || "",
                    studentPhone: data.studentPhone,
                    title: data.title,
                    description: data.description,
                })
                message.success("Lesson updated successfully!")
            } else {
                await instructorService.assignLesson({
                    studentPhone: data.studentPhone,
                    title: data.title,
                    description: data.description,
                })
                message.success("Lesson assigned successfully!")
            }
            form.resetFields()
            onSuccess()
            onClose()
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to assign lesson")
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
            title={`Assign Lesson`}
            open={open}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={values || {}}
            >
                <Form.Item
                    name="title"
                    label="Lesson Title"
                    rules={[
                        { required: true, message: "Please enter lesson title" },
                        { min: 3, message: "Title must be at least 3 characters" },
                    ]}
                >
                    <Input placeholder="Introduction to React" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Lesson Description"
                    rules={[
                        { required: true, message: "Please enter lesson description" },
                        { min: 10, message: "Description must be at least 10 characters" },
                    ]}
                >
                    <TextArea
                        rows={4}
                        placeholder="Learn the basics of React including components, props, and state..."
                    />
                </Form.Item>

                <Form.Item
                    name="studentPhone"
                    label="Student Assignment"
                    rules={[{ required: true, message: "Please enter student phone numbers" }]}
                >
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Please select"
                        options={students}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
