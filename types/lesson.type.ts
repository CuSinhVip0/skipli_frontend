export interface Lesson {
    id?: string
    lessonId?: string
    title: string
    description: string
    assignedAt: string
    completed: boolean
    completedAt?: string
    isActive?: boolean
    studentPhone?: string[]
}

export interface AssignLessonPayload {
    studentPhone: string[]
    title: string
    description: string
}

export interface UpdateLessonPayload {
    id: string
    studentPhone: string[]
    title: string
    description: string
}
export interface GetLesssonsResponse {
    success: boolean
    lessons: Lesson[]
}
