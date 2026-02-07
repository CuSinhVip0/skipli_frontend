import { AuthUser, UserType } from "@/types"
import { apiClient } from "../utils/apiClient"

export interface SendCodeResponse {
    success: boolean
    message?: string
}

export interface ValidateCodeResponse {
    success: boolean
    message?: string
    userType: UserType
    userData: AuthUser
}

export const authService = {
    sendSmsCode: async (phoneNumber: string): Promise<SendCodeResponse> => {
        const response = await apiClient.post<SendCodeResponse>("/createAccessCode", {
            phoneNumber,
        })
        return response.data
    },

    validateSmsCode: async (
        phoneNumber: string,
        accessCode: string,
    ): Promise<ValidateCodeResponse> => {
        const response = await apiClient.post<ValidateCodeResponse>("/validateAccessCode", {
            phoneNumber,
            accessCode,
        })
        return response.data
    },

    sendEmailCode: async (email: string): Promise<SendCodeResponse> => {
        const response = await apiClient.post<SendCodeResponse>("/loginEmail", {
            email,
        })
        return response.data
    },

    validateEmailCode: async (email: string, accessCode: string): Promise<ValidateCodeResponse> => {
        const response = await apiClient.post<ValidateCodeResponse>("/validateAccessCodeEmail", {
            email,
            accessCode,
        })
        return response.data
    },
}
