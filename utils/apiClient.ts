import axios, { AxiosError } from "axios"
import { getSession } from "next-auth/react"
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

apiClient.interceptors.request.use(
    async (config) => {
        try {
            // Lấy session từ NextAuth (client-side)
            await getSession().then((res) => {
                if (res?.accessToken) {
                    // Thêm JWT token vào Authorization header
                    config.headers.Authorization = `Bearer ${res.accessToken}`
                }
            })
        } catch (error) {
            console.error("Error getting session:", error)
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// 404
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as any

        // Check if error is due to expired token
        if (
            error.response?.status === 401 &&
            (error.response?.data as any)?.code === "TOKEN_EXPIRED" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true

            try {
                // Get fresh session which will trigger NextAuth to refresh token
                const session = await getSession()

                if (session?.accessToken) {
                    // Update the authorization header with new token
                    originalRequest.headers.Authorization = `Bearer ${session.accessToken}`
                    // Retry the original request
                    return apiClient(originalRequest)
                }
            } catch (refreshError) {
                console.error("Error refreshing token:", refreshError)
                // Redirect to login if refresh fails
                window.location.href = "/login"
                return Promise.reject(refreshError)
            }
        }

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
