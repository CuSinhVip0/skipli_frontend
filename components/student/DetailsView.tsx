"use client"

import { Modal, Form, Input, message, Select } from "antd"
import { Lesson } from "@/types/lesson.type"
const { TextArea } = Input

interface AssignLessonModalProps {
    open: boolean
    values: Lesson | null
    onClose: () => void
}

export default function DataView({ open, values, onClose }: AssignLessonModalProps) {
    const [form] = Form.useForm()
    const handleCancel = () => {
        form.resetFields()
        onClose()
    }

    return (
        <Modal title={values?.title} open={open} width={600} onCancel={handleCancel} footer={null}>
            <Form form={form} layout="vertical" initialValues={values || {}}>
                <Form.Item
                    name="description"
                    rules={[
                        { required: true, message: "Please enter lesson description" },
                        { min: 10, message: "Description must be at least 10 characters" },
                    ]}
                >
                    <TextArea rows={4} placeholder={values?.description || ""} />
                </Form.Item>
            </Form>
        </Modal>
    )
}
