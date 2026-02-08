"use client"

import { useEffect, useState } from "react"
import { Card, Progress, Empty, Spin, Tag, Button, App, Flex } from "antd"
import {
    BookOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    EyeFilled,
} from "@ant-design/icons"
import { studentService } from "@/services/student"
import { format, set } from "date-fns"
import { ApiError } from "@/utils/apiClient"
import { Lesson } from "@/types/lesson.type"
import { LayoutComponent } from "@/components/LayoutComponent"
import DataView from "@/components/student/DetailsView"

export default function StudentDashboard() {
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingStatus, setLoadingStatus] = useState(false)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [dataSelect, setDataSelect] = useState<Lesson | null>(null)
    const { message } = App.useApp()
    useEffect(() => {
        setLoading(true)
        loadLessons()
    }, [])

    const loadLessons = async () => {
        try {
            const response = await studentService.getMyLessons()
            setLessons(response.lessons || [])
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to load lessons")
        } finally {
            setLoading(false)
        }
    }

    const handleMarkDone = async (lessonId: string) => {
        setLoadingStatus(true)
        try {
            await studentService.markLessonDone({ lessonId })
            message.success("Lesson marked as completed!")
            await loadLessons()
        } catch (error) {
            const apiError = error as ApiError
            message.error(apiError.error || "Failed to mark lesson as done")
        } finally {
            setLoadingStatus(false)
        }
    }

    const completedCount = lessons.filter((l) => l.completed).length
    const totalCount = lessons.length
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    return (
        <LayoutComponent
            title={"My Lessons"}
            subtitle={"Track your learning progress and complete assignments"}
            modals={
                <>
                    {openModal && (
                        <DataView
                            open={openModal}
                            values={dataSelect}
                            onClose={() => setOpenModal(false)}
                        />
                    )}
                </>
            }
        >
            <div className="flex flex-col gap-2 bg-white rounded-lg shadow-sm">
                <div className="basis-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Flex>
                        <Card className="w-full">
                            <div className="flex items-center gap-2">
                                <div className="bg-amber-100 p-3 rounded-lg">
                                    <BookOutlined
                                        style={{ color: "blue", fontSize: 24 }}
                                        className="text-2xl"
                                    />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">
                                        {totalCount}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Lessons</div>
                                </div>
                            </div>
                        </Card>
                        <Card className="w-full">
                            <div className="flex items-center gap-2">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <CheckCircleOutlined
                                        style={{ color: "green", fontSize: 24 }}
                                        className="text-2xl text-green-600"
                                    />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gray-800">
                                        {completedCount}
                                    </div>
                                    <div className="text-sm text-gray-600">Completed</div>
                                </div>
                            </div>
                        </Card>
                    </Flex>
                    <Card>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">
                                    Overall Progress
                                </span>
                                <span className="text-lg font-bold text-purple-600">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                            <Progress
                                percent={progress}
                                status={progress === 100 ? "success" : "active"}
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Spin size="large" />
                    </div>
                ) : lessons.length === 0 ? (
                    <Card>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No lessons assigned yet"
                        >
                            <p className="text-gray-500">
                                Your instructor will assign lessons for you to complete
                            </p>
                        </Empty>
                    </Card>
                ) : (
                    <div className="grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
                        {lessons.map((lesson) => {
                            return (
                                <div key={lesson.id} style={{ padding: "8px 0px" }}>
                                    <Card
                                        size="small"
                                        title={
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-semibold">
                                                    {lesson.title}
                                                </span>
                                                {lesson.completed ? (
                                                    <div className=" flex flex-row gap-2">
                                                        <div className="mt-1  text-sm">
                                                            <span className="font-medium">
                                                                Completed:
                                                            </span>{" "}
                                                            {format(
                                                                new Date(lesson?.completedAt || ""),
                                                                "MMM dd, yyyy",
                                                            )}
                                                        </div>
                                                        <Tag
                                                            icon={<CheckCircleOutlined />}
                                                            color="success"
                                                        >
                                                            Completed
                                                        </Tag>
                                                    </div>
                                                ) : (
                                                    <div className=" flex flex-row gap-2">
                                                        <div className="mt-1  text-sm">
                                                            <span className="font-medium">
                                                                Assigned:
                                                            </span>
                                                            {format(
                                                                new Date(lesson?.assignedAt || ""),
                                                                "MMM dd, yyyy",
                                                            )}
                                                        </div>
                                                        <Tag
                                                            icon={<ClockCircleOutlined />}
                                                            color="warning"
                                                        >
                                                            Pending
                                                        </Tag>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                        className="h-full flex flex-col"
                                        classNames={{ body: "!py-2 p-0!" }}
                                    >
                                        <p className="text-gray-600 text-xl flex-1">
                                            {lesson.description}
                                        </p>

                                        <div className="">
                                            {!lesson.completed && (
                                                <Flex gap={"small"}>
                                                    <Button
                                                        block
                                                        size="middle"
                                                        loading={loadingStatus}
                                                        onClick={() => {
                                                            setOpenModal(true)
                                                            setDataSelect(lesson)
                                                        }}
                                                        icon={<EyeFilled />}
                                                    >
                                                        Detail View
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        block
                                                        size="middle"
                                                        loading={loadingStatus}
                                                        onClick={() =>
                                                            handleMarkDone(lesson?.id || "")
                                                        }
                                                        icon={<CheckCircleOutlined />}
                                                    >
                                                        Mark as Complete
                                                    </Button>
                                                </Flex>
                                            )}

                                            {lesson.completed && (
                                                <Button
                                                    block
                                                    size="middle"
                                                    loading={loadingStatus}
                                                    onClick={() => {
                                                        setOpenModal(true)
                                                        setDataSelect(lesson)
                                                    }}
                                                    icon={<EyeFilled />}
                                                >
                                                    Detail View
                                                </Button>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </LayoutComponent>
    )
}
