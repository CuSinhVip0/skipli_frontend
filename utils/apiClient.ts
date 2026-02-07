import axios, { AxiosError } from "axios"
export interface ApiError {
    error: string
    details?: string
    statusCode?: number
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
})

// 404
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    (error: AxiosError) => {
        const apiError: ApiError = {
            error: "Failed system server",
            statusCode: error.response?.status,
        }

        if (error.response) {
            const responseData = error.response.data as ApiError
            apiError.error = responseData.error || "Failed system server"
            apiError.details = responseData.details
        } else {
            apiError.error = "Failed system server"
        }
        return Promise.reject(apiError)
    },
)
