import {
    AddStudentPayload,
    EditStudentPayload,
    GetStudentResponse,
    GetStudentsResponse,
} from "@/types/student.type"
import { apiClient } from "../utils/apiClient"
export interface ApiResponse<T = any> {
    success: boolean
    message?: string
    data?: T
    error?: string
    details?: string
}

export interface ApiError {
    error: string
    details?: string
    statusCode?: number
}

export interface PaginatedResponse<T> {
    success: boolean
    data: T[]
    count: number
    page?: number
    limit?: number
}

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export interface ApiRequestConfig {
    method: ApiMethod
    url: string
    data?: any
    params?: Record<string, any>
    headers?: Record<string, string>
}

export const instructorService = {
    addStudent: async (payload: AddStudentPayload): Promise<ApiResponse> => {
        const response = await apiClient.post<ApiResponse>("/addStudent", payload)
        return response.data
    },

    getStudents: async (): Promise<GetStudentsResponse> => {
        const response = await apiClient.get<GetStudentsResponse>("/students")
        return response.data
    },

    getStudent: async (phone: string): Promise<GetStudentResponse> => {
        const response = await apiClient.get<GetStudentResponse>(`/student/${phone}`)
        return response.data
    },

    editStudent: async (phone: string, data: EditStudentPayload): Promise<ApiResponse> => {
        const response = await apiClient.put<ApiResponse>(`/editStudent/${phone}`, data)
        return response.data
    },

    editStatusStudent: async (
        phone: string,
        data: Pick<EditStudentPayload, "id" | "isActive">,
    ): Promise<ApiResponse> => {
        const response = await apiClient.put<ApiResponse>(`/editStatusStudent/${phone}`, data)
        return response.data
    },

    deleteStudent: async (phone: string): Promise<ApiResponse> => {
        const response = await apiClient.delete<ApiResponse>(`/student/${phone}`)
        return response.data
    },
}
