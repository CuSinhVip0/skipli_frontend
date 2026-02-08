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
    BookOutlined,
} from "@ant-design/icons"
import { instructorService } from "@/services/instructor"
import AddStudentModal from "@/components/instructor/AddStudentModal"
import { Student } from "@/types/student.type"
import { ApiError } from "@/services/instructor"
import { LayoutComponent } from "@/components/LayoutComponent"
import { phoneRegion } from "@/utils"
import { FilterDropdownProps } from "antd/lib/table/interface"

export default function InstructorDashboard() {
    const { message } = App.useApp()
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [mode, setMode] = useState<"add" | "edit">("add")
    const [dataedit, setDataedit] = useState<Student | null>(null)
    const [loadingStatus, setLoadingStatus] = useState(false)
    const searchInput = useRef<InputRef>(null)

    useEffect(() => {
        loadStudents()
    }, [])

    const loadStudents = async () => {
        setLoading(true)
        try {
            const response = await instructorService.getStudents()
            setStudents(response.students || [])
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to load students")
        } finally {
            setLoading(false)
        }
    }
    const handleUpdateStudentStatus = async (student: Student, isActive: boolean) => {
        try {
            setLoadingStatus(true)
            await instructorService.editStatusStudent(student.phone, {
                isActive: isActive,
                id: student.id,
            })
            message.success("Student status updated successfully")

            setStudents((prevStudents) =>
                prevStudents.map((s) => (s.id === student.id ? { ...s, isActive: isActive } : s)),
            )
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to update student status")
        } finally {
            setLoadingStatus(false)
        }
    }

    const handleEdit = (student: Student) => {
        setDataedit(student)
        setMode("edit")
        setAddModalOpen(true)
    }

    const handleDelete = (student: Student) => {
        Modal.confirm({
            title: "Delete Student",
            content: `Are you sure you want to delete ${student.name}? This action cannot be undone.`,
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    if (!student?.phone) {
                        message.error("Student phone is missing")
                        return
                    }
                    await instructorService.deleteStudent(student?.phone || "")
                    message.success("Student deleted successfully")
                    loadStudents()
                } catch (error) {
                    const apiError = error as ApiError
                    message.error(apiError.error || "Failed to delete student")
                }
            },
        })
    }
    const getColumnSearchProps = (dataIndex: keyof Student): TableColumnType<Student> => ({
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
            width: 150,
            render: (_: any, record: Student) => (
                <Space size="small">
                    <Tooltip title="Edit Student">
                        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Active Status">
                        <Switch
                            loading={loadingStatus}
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            checked={record?.isActive || false}
                            onChange={(checked) => {
                                handleUpdateStudentStatus(record, checked)
                            }}
                        />
                    </Tooltip>

                    <Tooltip title="Delete Student">
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
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a: Student, b: Student) => a.name.localeCompare(b.name),
            ...getColumnSearchProps("name"),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (phone: string) => phoneRegion(phone, "vi"),
            ...getColumnSearchProps("phone"),
        },

        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            ...getColumnSearchProps("email"),
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
            title={"Manage Students"}
            subtitle={"Add, edit, and manage your students"}
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
                        Add Student
                    </Button>
                </div>
            }
            modals={
                <>
                    {addModalOpen && (
                        <AddStudentModal
                            mode={mode}
                            values={dataedit}
                            open={addModalOpen}
                            onClose={() => setAddModalOpen(false)}
                            onSuccess={loadStudents}
                        />
                    )}
                </>
            }
        >
            <div className="bg-white rounded-lg shadow-sm">
                <Table
                    columns={columns}
                    dataSource={students}
                    rowKey="phone"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} students`,
                    }}
                />
            </div>
        </LayoutComponent>
    )
}
