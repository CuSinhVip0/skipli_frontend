"use client"

import { useEffect, useState } from "react"
import { Card, Progress, Empty, Spin, Tag, Button, App } from "antd"
import { BookOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons"
import { studentService } from "@/services/student"
import { format } from "date-fns"
import { ApiError } from "@/utils/apiClient"
import { Lesson } from "@/types/lesson.type"
import { LayoutComponent } from "@/components/LayoutComponent"

export default function StudentDashboard() {
    const [lessons, setLessons] = useState<Lesson[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingStatus, setLoadingStatus] = useState(false)
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

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spin size="large" />
            </div>
        )
    }

    const completedCount = lessons.filter((l) => l.completed).length
    const totalCount = lessons.length
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

    return (
        <LayoutComponent
            title={"My Lessons"}
            subtitle={"Track your learning progress and complete assignments"}
        >
            <div className="bg-white rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <BookOutlined className="text-2xl text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-800">{totalCount}</div>
                                <div className="text-sm text-gray-600">Total Lessons</div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <CheckCircleOutlined className="text-2xl text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-800">
                                    {completedCount}
                                </div>
                                <div className="text-sm text-gray-600">Completed</div>
                            </div>
                        </div>
                    </Card>
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
                {lessons.length === 0 ? (
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson) => {
                            return (
                                <Card
                                    key={lesson.id}
                                    title={
                                        <div className="flex justify-between items-center">
                                            <span className="text-base font-semibold">
                                                {lesson.title}
                                            </span>
                                            {lesson.completed ? (
                                                <Tag icon={<CheckCircleOutlined />} color="success">
                                                    Completed
                                                </Tag>
                                            ) : (
                                                <Tag icon={<ClockCircleOutlined />} color="warning">
                                                    Pending
                                                </Tag>
                                            )}
                                        </div>
                                    }
                                    className="h-full flex flex-col"
                                    bodyStyle={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <p className="text-gray-600 mb-4 flex-1">
                                        {lesson.description}
                                    </p>

                                    <div className="space-y-3">
                                        <div className="text-sm text-gray-500 pb-3 border-b">
                                            <div>
                                                <span className="font-medium">Assigned:</span>{" "}
                                                {format(
                                                    new Date(lesson.assignedAt),
                                                    "MMM dd, yyyy",
                                                )}
                                            </div>
                                            {lesson.completed && lesson.completedAt && (
                                                <div className="mt-1">
                                                    <span className="font-medium">Completed:</span>{" "}
                                                    {format(
                                                        new Date(lesson.completedAt),
                                                        "MMM dd, yyyy",
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {!lesson.completed && (
                                            <Button
                                                type="primary"
                                                block
                                                size="large"
                                                loading={loadingStatus}
                                                onClick={() => handleMarkDone(lesson?.id || "")}
                                                icon={<CheckCircleOutlined />}
                                            >
                                                Mark as Complete
                                            </Button>
                                        )}

                                        {lesson.completed && (
                                            <div className="text-center text-green-600 font-medium py-2">
                                                <CheckCircleOutlined className="mr-2" />
                                                Lesson Completed!
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </LayoutComponent>
    )
}
