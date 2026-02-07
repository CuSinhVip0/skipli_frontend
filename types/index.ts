export type UserType = "student" | "instructor"
export interface AuthUser {
    phone?: string
    email?: string
    name?: string
    userType: UserType
    createdAt: string
    updatedAt?: string
}
