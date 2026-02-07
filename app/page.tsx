"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Spin } from "antd"
import { useAuthStore } from "@/store/auth"

export default function Home() {
    const router = useRouter()
    const { user, isAuthenticated } = useAuthStore()

    useEffect(() => {
        console.log("🚀 ~ Home ~ user:", user)
        if (isAuthenticated && user?.userType) {
            const dashboardPath = user.userType === "instructor" ? "/instructor" : "/student"
            router.push(dashboardPath)
        } else {
            router.push("/login")
        }
    }, [isAuthenticated, user, router])

    // Hiển thị loading trong khi redirect
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <Spin size="large" />
                <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
            </div>
        </div>
    )
}
