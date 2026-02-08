"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Spin } from "antd"
import { useSession } from "next-auth/react"

export default function Home() {
    const router = useRouter()
    const { data: session, status } = useSession()
    useEffect(() => {
        if (status === "loading") return // Đang loading

        if (session) {
            const dashboardPath = session.user.role === "instructor" ? "/instructor" : "/student"
            router.push(dashboardPath)
        } else {
            router.push("/login")
        }
    }, [session, status, router])

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
