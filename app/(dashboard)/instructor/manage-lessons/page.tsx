"use client"

import { useEffect, useRef, useState } from "react"
import {
    Table,
    Button,
    Space,
    Modal,
    Tag,
    App,
    Tooltip,
    Switch,
    TableColumnType,
    Input,
    InputRef,
} from "antd"
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined,
    SearchOutlined,
} from "@ant-design/icons"
import { instructorService } from "@/services/instructor"
import { ApiError } from "@/services/instructor"
import { LayoutComponent } from "@/components/LayoutComponent"
import { FilterDropdownProps } from "antd/lib/table/interface"
import AssignLessonModal from "@/components/instructor/AssignLessonModal"
import { Lesson } from "@/types/lesson.type"

export default function Page() {
    const { message } = App.useApp()
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loading, setLoading] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [mode, setMode] = useState<"add" | "edit">("add")
    const [dataedit, setDataedit] = useState<Lesson | null>(null)
    const [loadingStatus, setLoadingStatus] = useState(false)
    const searchInput = useRef<InputRef>(null)

    useEffect(() => {
        loadLessons()
    }, [])

    const loadLessons = async () => {
        setLoading(true)
        try {
            const response = await instructorService.lessons()
            setLessons(response.lessons || [])
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to load lessons")
        } finally {
            setLoading(false)
        }
    }
    const handleUpdateLessonStatus = async (lesson: Lesson, isActive: boolean) => {
        try {
            setLoadingStatus(true)
            await instructorService.editStatusLesson({
                isActive: isActive,
                id: lesson.id,
            })
            message.success("Lesson status updated successfully")
            setLessons((prevLessons) =>
                prevLessons.map((s) => (s.id === lesson.id ? { ...s, isActive: isActive } : s)),
            )
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to update lesson status")
        } finally {
            setLoadingStatus(false)
        }
    }

    const handleEdit = (lesson: Lesson) => {
        setDataedit(lesson)
        setMode("edit")
        setAddModalOpen(true)
    }

    const handleDelete = (lesson: Lesson) => {
        Modal.confirm({
            title: "Delete Lesson",
            content: `Are you sure you want to delete ${lesson.title}? This action cannot be undone.`,
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    if (!lesson?.id) {
                        message.error("Lesson ID is missing")
                        return
                    }
                    await instructorService.deleteLesson(lesson?.id || "")
                    message.success("Lesson deleted successfully")
                    loadLessons()
                } catch (error) {
                    const apiError = error as ApiError
                    message.error(apiError.error || "Failed to delete lesson")
                }
            },
        })
    }
    const getColumnSearchProps = (dataIndex: keyof Lesson): TableColumnType<Lesson> => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: FilterDropdownProps) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => {
                            clearFilters && clearFilters()
                            confirm()
                        }}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()) || false,
    })
    const columns = [
        {
            title: "Actions",
            key: "actions",
            width: 100,
            render: (_: any, record: Lesson) => (
                <Space size="small">
                    <Tooltip title="Edit Lesson">
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Active Status">
                        <Switch
                            loading={loadingStatus}
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            checked={record?.isActive || false}
                            onChange={(checked) => {
                                handleUpdateLessonStatus(record, checked)
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Lesson">
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: (a: Lesson, b: Lesson) => a.title.localeCompare(b.title),
            ...getColumnSearchProps("title"),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean) => (
                <div className="flex items-center gap-2">
                    <Tag color={isActive ? "green" : "red"}>{isActive ? "Active" : "Inactive"}</Tag>
                </div>
            ),
        },
    ]

    return (
        <LayoutComponent
            title={"Manage Lessons"}
            subtitle={"Add, edit, and delete your lessons"}
            rightLayout={
                <div className={`grow flex flex-row justify-end items-center gap-4`}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        onClick={() => {
                            setMode("add")
                            setAddModalOpen(true)
                            setDataedit(null)
                        }}
                    >
                        Add Lesson
                    </Button>
                </div>
            }
            modals={
                <>
                    {addModalOpen && (
                        <AssignLessonModal
                            open={addModalOpen}
                            mode={mode}
                            values={dataedit || null}
                            onClose={() => {
                                setAddModalOpen(false)
                                setDataedit(null)
                            }}
                            onSuccess={loadLessons}
                        />
                    )}
                </>
            }
        >
            <div className="bg-white rounded-lg shadow-sm">
                <Table
                    columns={columns}
                    dataSource={lessons}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} lessons`,
                    }}
                />
            </div>
        </LayoutComponent>
    )
}
