import { GetMyLessonsResponse } from "@/types/student.type"
import { apiClient } from "../utils/apiClient"
import type { UpdateProfilePayload, MarkLessonDonePayload, ApiResponse } from "@/types"

export const studentService = {
    getMyLessons: async (): Promise<GetMyLessonsResponse> => {
        const response = await apiClient.get<GetMyLessonsResponse>("/myLessons")
        return response.data
    },
    markLessonDone: async (payload: MarkLessonDonePayload): Promise<ApiResponse> => {
        const response = await apiClient.post<ApiResponse>("/markLessonDone", payload)
        return response.data
    },

    editProfile: async (payload: UpdateProfilePayload): Promise<ApiResponse> => {
        const response = await apiClient.put<ApiResponse>("/editProfile", payload)
        return response.data
    },
}
