export interface Student {
    id?: string
    phone: string
    name: string
    email: string
    createdAt: string
    updatedAt?: string
    isActive?: boolean
}

export interface AddStudentPayload {
    name: string
    phone: string
    email: string
}

export interface EditStudentPayload {
    id?: string
    phone?: string
    name?: string
    email?: string
    isActive?: boolean
}

export interface GetStudentsResponse {
    success: boolean
    students: Student[]
}

export interface GetStudentResponse {
    success: boolean
    student: Student
}
