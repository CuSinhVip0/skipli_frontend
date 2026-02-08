export type UserType = "student" | "instructor"
export interface AuthUser {
    phone?: string
    email?: string
    name?: string
    userType: UserType
    createdAt: string
    updatedAt?: string
}
export interface ApiResponse<T = any> {
    success: boolean
    message?: string
    data?: T
    error?: string
    details?: string
}

export interface UpdateProfilePayload {
    phone: string
    name?: string
    email?: string
}

export interface MarkLessonDonePayload {
    lessonId: string
}
